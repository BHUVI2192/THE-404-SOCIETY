import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface LiquidHotspot {
  x: number;
  y: number;
}

export interface LiquidImageProps {
  src: string;
  alt?: string;
  strength?: number;
  speed?: number;
  colorReveal?: boolean;
  fit?: 'cover' | 'contain' | 'fill';
  borderRadius?: number | string;
  style?: React.CSSProperties;
  className?: string;
  hotspots?: LiquidHotspot[];
  background?: string;
  logoPadding?: number;
  children?: React.ReactNode;
}

const VS_SOURCE = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FS_SOURCE = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_image;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_strength;
uniform float u_speed;
uniform vec2 u_resolution;
#define MAX_WAKE 16
uniform int u_wakeCount;
uniform vec3 u_wake[MAX_WAKE]; // x, y, t
uniform float u_maskRadius;
uniform float u_colorReveal;

void main() {
    vec2 uv = v_uv;
    
    // Wake ripples from cursor movement
    for (int i = 0; i < MAX_WAKE; ++i) {
        if (i >= u_wakeCount) break;
        vec2 w = u_wake[i].xy;
        float t = u_time - u_wake[i].z;
        float dist = distance(uv, w);
        float amp = exp(-dist * 16.0) * exp(-t * 1.2);
        float ripple = sin(32.0 * dist - t * 8.0 * u_speed) * 0.04;
        uv += normalize(uv - w + vec2(0.0001)) * ripple * u_strength * amp * 2.0;
    }

    // Continuous live mouse ripple
    if (u_mouse.x >= 0.0 && u_mouse.x <= 1.0 && u_mouse.y >= 0.0 && u_mouse.y <= 1.0) {
        float dist = distance(uv, u_mouse);
        float ripple = sin(32.0 * dist - u_time * 8.0 * u_speed) * 0.04;
        float effect = exp(-dist * 12.0);
        uv += normalize(uv - u_mouse + vec2(0.0001)) * ripple * u_strength * effect * 2.0;
    }

    uv = clamp(uv, 0.0, 1.0);
    vec4 color = texture2D(u_image, uv);

    // Grayscale calculations
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    vec3 grayColor = vec3(gray);

    // Color reveal mask
    float mask = 0.0;
    float maskRadius = u_maskRadius;
    if (u_mouse.x >= 0.0 && u_mouse.x <= 1.0 && u_mouse.y >= 0.0 && u_mouse.y <= 1.0 && maskRadius > 0.0) {
        float d = distance(uv, u_mouse);
        mask = max(mask, smoothstep(maskRadius, maskRadius * 0.8, d));
    }
    for (int i = 0; i < MAX_WAKE; ++i) {
        if (i >= u_wakeCount) break;
        vec2 w = u_wake[i].xy;
        float d = distance(uv, w);
        mask = max(mask, smoothstep(maskRadius, maskRadius * 0.8, d));
    }

    float revealMask = mix(1.0, mask, u_colorReveal);
    vec3 finalColor = mix(grayColor, color.rgb, revealMask);
    gl_FragColor = vec4(finalColor, color.a);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('Shader compile failed:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vs: WebGLShader,
  fs: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('Program link failed:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export const LiquidImage: React.FC<LiquidImageProps> = ({
  src,
  alt = 'Liquid Visual',
  strength = 0.06,
  speed = 0.16,
  colorReveal = false,
  fit = 'contain',
  borderRadius = 16,
  style = {},
  className = '',
  hotspots = [],
  background = 'radial-gradient(ellipse at center, #0B1636 0%, #040817 70%, #02040B 100%)',
  logoPadding = 0.72,
  children,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [size, setSize] = useState({ width: 400, height: 260 });
  const sizeRef = useRef({ width: 400, height: 260 });
  const dprRef = useRef(1);
  const fitRef = useRef(fit);
  fitRef.current = fit;

  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -10,
    y: -10,
    active: false,
  });
  const maskRadiusRef = useRef(0);
  const wakeRef = useRef<Array<{ x: number; y: number; t: number }>>([]);
  const hotspotsRef = useRef(hotspots);
  hotspotsRef.current = hotspots;
  const hoveredRef = useRef(false);

  // ResizeObserver for responsive fluid dimensions
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const measure = () => {
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      dprRef.current = dpr;
      const rect = el.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      sizeRef.current = { width: w, height: h };
      setSize((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Pointer interactions
  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    mouseRef.current = { x, y, active: true };
    hoveredRef.current = true;

    const now = Date.now();
    wakeRef.current = [...wakeRef.current.filter((w) => now - w.t < 1200), { x, y, t: now }].slice(-12);
  }, []);

  const handleLeave = useCallback(() => {
    mouseRef.current = { ...mouseRef.current, active: false };
    hoveredRef.current = false;
  }, []);

  // Smooth mask radius animation on hover
  useEffect(() => {
    let animId: number;
    let lastHovered = false;
    let start: number | null = null;
    let from = 0;
    let to = 0;
    const duration = 650;

    function easeInOutCubic(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animate(ts: number) {
      const hovered = hoveredRef.current;
      if (hovered !== lastHovered) {
        lastHovered = hovered;
        start = ts;
        from = maskRadiusRef.current;
        to = hovered ? 1.5 : 0;
      }
      if (start === null) start = ts;
      const elapsed = Math.min((ts - start) / duration, 1);
      const eased = easeInOutCubic(elapsed);
      maskRadiusRef.current = from + (to - from) * eased;
      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // WebGL Shader pipeline & animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false }) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) return;

    let animId: number;
    const startTime = Date.now();
    let appliedW = 0;
    let appliedH = 0;
    let loaded = false;

    // Load source image
    const img = new Image();
    img.crossOrigin = 'anonymous';

    // Compile Shaders
    const vs = createShader(gl, gl.VERTEX_SHADER, VS_SOURCE);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE);
    if (!vs || !fs) return;

    const program = createProgram(gl, vs, fs);
    if (!program) return;
    gl.useProgram(program);

    // Quad geometry
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const locPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(locPos);
    gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uStrength = gl.getUniformLocation(program, 'u_strength');
    const uSpeed = gl.getUniformLocation(program, 'u_speed');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uWake = gl.getUniformLocation(program, 'u_wake');
    const uWakeCount = gl.getUniformLocation(program, 'u_wakeCount');
    const uMaskRadius = gl.getUniformLocation(program, 'u_maskRadius');
    const uColorReveal = gl.getUniformLocation(program, 'u_colorReveal');
    const uImage = gl.getUniformLocation(program, 'u_image');

    // Setup Texture
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(uImage, 0);

    const getOffscreen = (w: number, h: number) => {
      let off = offCanvasRef.current;
      if (!off) {
        off = document.createElement('canvas');
        offCanvasRef.current = off;
      }
      if (off.width !== w || off.height !== h) {
        off.width = w;
        off.height = h;
      }
      return off;
    };

    const updateTexture = () => {
      if (!tex || !gl) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      const offW = sizeRef.current.width;
      const offH = sizeRef.current.height;
      const off = getOffscreen(offW, offH);
      const ctx = off.getContext('2d');
      if (!ctx) return;

      const iw = img.naturalWidth || img.width || 721;
      const ih = img.naturalHeight || img.height || 746;

      const fitMode = fitRef.current;
      let sx = 0;
      let sy = 0;
      let sw = offW;
      let sh = offH;

      if (fitMode === 'fill') {
        sx = 0;
        sy = 0;
        sw = offW;
        sh = offH;
      } else if (fitMode === 'contain') {
        const targetW = offW * logoPadding;
        const targetH = offH * logoPadding;
        const scaleFactor = Math.min(targetW / iw, targetH / ih);
        sw = iw * scaleFactor;
        sh = ih * scaleFactor;
        sx = (offW - sw) / 2;
        sy = (offH - sh) / 2;
      } else {
        const scaleFactor = Math.max(offW / iw, offH / ih);
        sw = iw * scaleFactor;
        sh = ih * scaleFactor;
        sx = (offW - sw) / 2;
        sy = (offH - sh) / 2;
      }

      ctx.clearRect(0, 0, offW, offH);

      // Render custom dark liquid surface backdrop
      if (background && background !== 'transparent') {
        if (background.startsWith('radial-gradient')) {
          const radGrad = ctx.createRadialGradient(
            offW / 2,
            offH / 2,
            offW * 0.05,
            offW / 2,
            offH / 2,
            offW * 0.7
          );
          radGrad.addColorStop(0, '#101D48');
          radGrad.addColorStop(0.45, '#070E26');
          radGrad.addColorStop(1, '#040711');
          ctx.fillStyle = radGrad;
          ctx.fillRect(0, 0, offW, offH);
        } else {
          ctx.fillStyle = background;
          ctx.fillRect(0, 0, offW, offH);
        }
      }

      // Draw the crisp logo onto the liquid canvas
      if (img.complete && (img.naturalWidth > 0 || img.width > 0)) {
        ctx.drawImage(img, sx, sy, sw, sh);
      }

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, off);
    };

    const render = () => {
      if (!loaded || !gl) return;

      const curW = sizeRef.current.width;
      const curH = sizeRef.current.height;
      const d = dprRef.current || 1;

      if (curW !== appliedW || curH !== appliedH) {
        if (canvasRef.current) {
          canvasRef.current.width = curW;
          canvasRef.current.height = curH;
          canvasRef.current.style.width = `${curW / d}px`;
          canvasRef.current.style.height = `${curH / d}px`;
        }
        appliedW = curW;
        appliedH = curH;
      }

      updateTexture();
      gl.viewport(0, 0, curW, curH);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const now = (Date.now() - startTime) / 1000;
      gl.uniform1f(uTime, now);

      const mx = mouseRef.current.active
        ? Math.max(0, Math.min(1, mouseRef.current.x))
        : -10;
      let my = mouseRef.current.active
        ? Math.max(0, Math.min(1, mouseRef.current.y))
        : -10;
      my = 1 - my; // Invert Y for WebGL texture coordinates

      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uStrength, strength * 2.5);
      gl.uniform1f(uSpeed, speed);
      gl.uniform2f(uResolution, curW, curH);

      // Wake effects (recent cursor movements + persistent hotspots)
      const nowMs = Date.now();
      const wakeArr = wakeRef.current.slice(-10);
      const hotspotArr = (hotspotsRef.current || [])
        .slice(0, 6)
        .map((h) => ({ x: h.x, y: h.y, t: nowMs - 100000 }));
      const allWake = [...wakeArr, ...hotspotArr].slice(-16);
      const wakeData = new Float32Array(16 * 3);
      let count = 0;

      for (let i = 0; i < allWake.length; ++i) {
        const w = allWake[i];
        wakeData[i * 3 + 0] = w.x;
        wakeData[i * 3 + 1] = 1 - w.y;
        wakeData[i * 3 + 2] = (w.t - startTime) / 1000;
        count++;
      }

      gl.uniform1i(uWakeCount, count);
      gl.uniform3fv(uWake, wakeData);

      gl.uniform1f(uMaskRadius, maskRadiusRef.current);
      gl.uniform1f(uColorReveal, colorReveal ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    };

    let isRendering = false;
    const startRender = () => {
      if (isRendering) return;
      isRendering = true;
      loaded = true;
      render();
    };

    img.onload = startRender;
    img.src = src;
    if (img.complete && img.naturalWidth !== 0) {
      startRender();
    }

    return () => {
      isRendering = false;
      cancelAnimationFrame(animId);
      gl.deleteBuffer(posBuffer);
      gl.deleteTexture(tex);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
    };
  }, [src, strength, speed, colorReveal, background, logoPadding]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchMove={handleMove}
      onTouchEnd={handleLeave}
      style={{
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        width={size.width}
        height={size.height}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
        }}
        aria-label={alt}
      />
      {children && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default LiquidImage;
