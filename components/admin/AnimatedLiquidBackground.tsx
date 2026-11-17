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
  shape?: number; // 0: Checks, 1: Stripes, 2: Edge
  shapeScale?: number;
  proportion?: number;
  offset?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

const vertexShaderSource = `#version 300 es
layout(location = 0) in vec4 a_position;
void main() {
  gl_Position = a_position;
}
`;

/**
 * Exact Framer warpFragmentShader from AnimatedLiquidBackground-Prod
 * Supports Checks (0), Stripes (1), Edge (2) with swirl & 3D perlin noise
 */
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
  float t = 0.5 * u_time;
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

  float iterations_number = ceil(clamp(u_swirlIterations, 1.0, 30.0));
  for (float i = 1.0; i <= iterations_number; i++) {
    uv.x += clamp(u_swirl, 0.0, 2.0) / i * cos(t + i * 1.5 * uv.y);
    uv.y += clamp(u_swirl, 0.0, 2.0) / i * cos(t + i * 1.0 * uv.x);
  }

  float proportion = clamp(u_proportion, 0.0, 1.0);
  float shape = 0.0;
  float mixer = 0.0;

  if (u_shape < 0.5) {
    // Checks (Prism preset)
    vec2 checks_shape_uv = uv * (0.5 + 3.5 * u_shapeScale);
    shape = 0.5 + 0.5 * sin(checks_shape_uv.x) * cos(checks_shape_uv.y);
    mixer = shape + 0.48 * sign(proportion - 0.5) * pow(abs(proportion - 0.5), 0.5);
  } else if (u_shape < 1.5) {
    // Stripes
    vec2 stripes_shape_uv = uv * (0.25 + 3.0 * u_shapeScale);
    float f = fract(stripes_shape_uv.y);
    shape = smoothstep(0.0, 0.55, f) * smoothstep(1.0, 0.45, f);
    mixer = shape + 0.48 * sign(proportion - 0.5) * pow(abs(proportion - 0.5), 0.5);
  } else {
    // Edge
    float sh = 1.0 - uv.y;
    sh -= 0.5;
    sh /= (noise_scale * u_resolution.y);
    sh += 0.5;
    float shape_scaling = 0.2 * (1.0 - u_shapeScale);
    shape = smoothstep(0.45 - shape_scaling, 0.55 + shape_scaling, sh + 0.3 * (proportion - 0.5));
    mixer = shape;
  }

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

/**
 * AnimatedLiquidBackground using the exact Framer Prism preset:
 * - Color 1: #050505
 * - Color 2: #66B3FF (Prism Cyan/Blue)
 * - Color 3: #FFFFFF (Clean White)
 * - Shape: Checks (0)
 * - Rotation: -50 deg
 * - Softness: 0.47
 * - Swirl: 0.50 with 16 iterations
 */
export const AnimatedLiquidBackground: React.FC<LiquidBackgroundProps> = ({
  color1 = '#050505',
  color2 = '#66B3FF',
  color3 = '#FFFFFF',
  speed = 1.0,
  scale = 0.01,
  rotation = -0.277, // -50 degrees in shader rotation units (-50/180)
  swirl = 0.5,
  swirlIterations = 16,
  softness = 0.47,
  distortion = 0.0,
  shape = 0.0, // Checks
  shapeScale = 0.45,
  proportion = 0.01,
  offset = -2990,
  opacity = 0.85,
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

    // Quad Buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // Get Uniform Locations
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uPixelLoc = gl.getUniformLocation(program, 'u_pixelRatio');
    const uResLoc = gl.getUniformLocation(program, 'u_resolution');
    const uScaleLoc = gl.getUniformLocation(program, 'u_scale');
    const uRotLoc = gl.getUniformLocation(program, 'u_rotation');
    const uColor1Loc = gl.getUniformLocation(program, 'u_color1');
    const uColor2Loc = gl.getUniformLocation(program, 'u_color2');
    const uColor3Loc = gl.getUniformLocation(program, 'u_color3');
    const uPropLoc = gl.getUniformLocation(program, 'u_proportion');
    const uSoftLoc = gl.getUniformLocation(program, 'u_softness');
    const uShapeLoc = gl.getUniformLocation(program, 'u_shape');
    const uShapeScaleLoc = gl.getUniformLocation(program, 'u_shapeScale');
    const uDistLoc = gl.getUniformLocation(program, 'u_distortion');
    const uSwirlLoc = gl.getUniformLocation(program, 'u_swirl');
    const uSwirlIterLoc = gl.getUniformLocation(program, 'u_swirlIterations');

    let animationId: number;
    let startTime = performance.now() + offset;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const render = (now: number) => {
      const elapsed = ((now - startTime) / 1000) * speed;

      gl.useProgram(program);
      gl.bindVertexArray(vao);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform1f(uPixelLoc, dpr);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform1f(uScaleLoc, scale);
      gl.uniform1f(uRotLoc, rotation);
      gl.uniform4f(uColor1Loc, rgba1[0], rgba1[1], rgba1[2], rgba1[3]);
      gl.uniform4f(uColor2Loc, rgba2[0], rgba2[1], rgba2[2], rgba2[3]);
      gl.uniform4f(uColor3Loc, rgba3[0], rgba3[1], rgba3[2], rgba3[3]);
      gl.uniform1f(uPropLoc, proportion);
      gl.uniform1f(uSoftLoc, softness);
      gl.uniform1f(uShapeLoc, shape);
      gl.uniform1f(uShapeScaleLoc, shapeScale);
      gl.uniform1f(uDistLoc, distortion);
      gl.uniform1f(uSwirlLoc, swirl);
      gl.uniform1f(uSwirlIterLoc, swirlIterations);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      gl.deleteBuffer(positionBuffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }, [
    rgba1,
    rgba2,
    rgba3,
    speed,
    scale,
    rotation,
    swirl,
    swirlIterations,
    softness,
    distortion,
    shape,
    shapeScale,
    proportion,
    offset,
  ]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{
        zIndex: 0,
        overflow: 'hidden',
        background: '#fafafa',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          opacity: opacity,
        }}
      />
      {/* Soft ambient overlay ensuring clean readability with the prism liquid below */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.75) 100%)',
        }}
      />
    </div>
  );
};
