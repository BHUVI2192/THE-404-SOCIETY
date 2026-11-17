import React, { useEffect, useRef, useMemo } from 'react';

export interface LiquidBackgroundProps {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  scale?: number;
  rotation?: number;
  swirl?: number;
  swirlIterations?: number;
  softness?: number;
  distortion?: number;
  className?: string;
  style?: React.CSSProperties;
}

const vertexShaderSource = `#version 300 es
layout(location = 0) in vec4 a_position;
void main() {
  gl_Position = a_position;
}
`;

const warpFragmentShader = `#version 300 es
precision highp float;

uniform float u_time;
uniform float u_pixelRatio;
uniform vec2 u_resolution;

uniform float u_scale;
uniform float u_rotation;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;
uniform float u_proportion;
uniform float u_softness;
uniform float u_shape;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;

out vec4 fragColor;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

vec4 blend_colors(vec4 c1, vec4 c2, vec4 c3, float mixer, float edgesWidth, float edge_blur) {
  vec3 color1 = c1.rgb * c1.a;
  vec3 color2 = c2.rgb * c2.a;
  vec3 color3 = c3.rgb * c3.a;

  float r1 = smoothstep(0.0 + 0.35 * edgesWidth, 0.7 - 0.35 * edgesWidth + 0.5 * edge_blur, mixer);
  float r2 = smoothstep(0.3 + 0.35 * edgesWidth, 1.0 - 0.35 * edgesWidth + edge_blur, mixer);

  vec3 blended_color_2 = mix(color1, color2, r1);
  float blended_opacity_2 = mix(c1.a, c2.a, r1);

  vec3 c = mix(blended_color_2, color3, r2);
  float o = mix(blended_opacity_2, c3.a, r2);
  return vec4(c, o);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = 0.4 * u_time;
  float noise_scale = 0.0005 + 0.006 * u_scale;

  uv -= 0.5;
  uv *= (noise_scale * u_resolution);
  uv = rotate(uv, u_rotation * 0.5 * PI);
  uv /= u_pixelRatio;
  uv += 0.5;

  float n1 = noise(uv * 1.0 + t);
  float n2 = noise(uv * 2.0 - t);
  float angle = n1 * TWO_PI;
  uv.x += 4.0 * u_distortion * n2 * cos(angle);
  uv.y += 4.0 * u_distortion * n2 * sin(angle);

  float iterations_number = ceil(clamp(u_swirlIterations, 1.0, 20.0));
  for (float i = 1.0; i <= iterations_number; i++) {
    uv.x += clamp(u_swirl, 0.0, 2.0) / i * cos(t + i * 1.5 * uv.y);
    uv.y += clamp(u_swirl, 0.0, 2.0) / i * cos(t + i * 1.0 * uv.x);
  }

  float proportion = clamp(u_proportion, 0.0, 1.0);
  float sh = 1.0 - uv.y;
  sh -= 0.5;
  sh /= (noise_scale * u_resolution.y);
  sh += 0.5;
  float shape_scaling = 0.2 * (1.0 - u_shapeScale);
  float shape = smoothstep(0.45 - shape_scaling, 0.55 + shape_scaling, sh + 0.3 * (proportion - 0.5));
  float mixer = shape;

  vec4 color_mix = blend_colors(u_color1, u_color2, u_color3, mixer, 1.0 - clamp(u_softness, 0.0, 1.0), 0.01 + 0.01 * u_scale);
  fragColor = vec4(color_mix.rgb, color_mix.a);
}
`;

function hexToRgba(hex: string): [number, number, number, number] {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  if (c.length === 6) c = c + 'ff';
  const num = parseInt(c, 16);
  return [
    ((num >> 24) & 255) / 255,
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

export const AnimatedLiquidBackground: React.FC<LiquidBackgroundProps> = ({
  color1 = '#f8fafc',
  color2 = '#e2e8f0',
  color3 = '#ffffff',
  speed = 1.2,
  scale = 0.8,
  rotation = 0.2,
  swirl = 0.45,
  swirlIterations = 6,
  softness = 1.0,
  distortion = 0.12,
  className = '',
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const rgba1 = useMemo(() => hexToRgba(color1), [color1]);
  const rgba2 = useMemo(() => hexToRgba(color2), [color2]);
  const rgba3 = useMemo(() => hexToRgba(color3), [color3]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { alpha: true, antialias: true, depth: false });
    if (!gl) return;

    // Compile Shader helper
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragShader = createShader(gl.FRAGMENT_SHADER, warpFragmentShader);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    gl.detachShader(program, vertShader);
    gl.detachShader(program, fragShader);
    gl.deleteShader(vertShader);
    gl.deleteShader(fragShader);

    // Setup Quad Buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uPixelRatio = gl.getUniformLocation(program, 'u_pixelRatio');
    const uScale = gl.getUniformLocation(program, 'u_scale');
    const uRotation = gl.getUniformLocation(program, 'u_rotation');
    const uColor1 = gl.getUniformLocation(program, 'u_color1');
    const uColor2 = gl.getUniformLocation(program, 'u_color2');
    const uColor3 = gl.getUniformLocation(program, 'u_color3');
    const uProportion = gl.getUniformLocation(program, 'u_proportion');
    const uSoftness = gl.getUniformLocation(program, 'u_softness');
    const uShape = gl.getUniformLocation(program, 'u_shape');
    const uShapeScale = gl.getUniformLocation(program, 'u_shapeScale');
    const uDistortion = gl.getUniformLocation(program, 'u_distortion');
    const uSwirl = gl.getUniformLocation(program, 'u_swirl');
    const uSwirlIterations = gl.getUniformLocation(program, 'u_swirlIterations');

    let animationFrameId: number;
    let startTime = performance.now();

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth * dpr;
      const height = canvas.clientHeight * dpr;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    const render = (now: number) => {
      const elapsed = ((now - startTime) / 1000) * speed;

      gl.useProgram(program);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uPixelRatio, Math.min(window.devicePixelRatio || 1, 2));

      gl.uniform1f(uScale, scale);
      gl.uniform1f(uRotation, rotation);
      gl.uniform4fv(uColor1, rgba1);
      gl.uniform4fv(uColor2, rgba2);
      gl.uniform4fv(uColor3, rgba3);
      gl.uniform1f(uProportion, 0.45);
      gl.uniform1f(uSoftness, softness);
      gl.uniform1f(uShape, 2.0); // Edge shape for ambient wave/liquid
      gl.uniform1f(uShapeScale, 0.5);
      gl.uniform1f(uDistortion, distortion);
      gl.uniform1f(uSwirl, swirl);
      gl.uniform1f(uSwirlIterations, swirlIterations);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (gl) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
      }
    };
  }, [rgba1, rgba2, rgba3, speed, scale, rotation, swirl, swirlIterations, softness, distortion]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
      style={style}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-90"
        style={{ width: '100%', height: '100%' }}
      />
      {/* Ambient lighting gradient overlay for a polished white-and-black contrast */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/70 backdrop-blur-[1px]"
      />
    </div>
  );
};

export default AnimatedLiquidBackground;
