import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

// ==========================================
// 1. SHADERS (from Framer Flame Character)
// ==========================================
const BASE_VERTEX_SHADER = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vLocalPos;

void main() {
    vUv = uv;
    vLocalPos = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 viewSpacePos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-viewSpacePos.xyz);
    gl_Position = projectionMatrix * viewSpacePos;
}
`;

const PUFF_FRAGMENT = `
uniform vec3 colorCenter;
uniform vec3 colorEdge;
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewDir);
    float rim = 1.0 - max(dot(n, v), 0.0);
    float mixFactor = pow(smoothstep(0.15, 0.85, rim), 1.2); 
    vec3 col = mix(colorCenter, colorEdge, mixFactor);
    vec3 l = normalize(vec3(0.2, 1.0, 0.8)); 
    vec3 h = normalize(l + v); 
    float spec = pow(max(dot(n, h), 0.0), 60.0); 
    col += vec3(1.0) * spec * 0.6; 
    gl_FragColor = vec4(col, 1.0);
}
`;

const BOTTY_VERTEX = `
uniform float uTime;
varying vec3 vNormal;
varying float vHeight;
varying vec3 vViewDir;

void main() {
    vec3 pos = position;
    
    // Tail wagging animation
    if (pos.y < -0.95) {
        float tailT = (abs(pos.y) - 0.95) / 0.6; 
        pos.x += sin(uTime * 5.0) * (tailT * tailT) * 0.12;
    }
    
    vNormal = normalize(normalMatrix * normalize(pos));
    vHeight = pos.y; 
    vec4 viewSpacePos = modelViewMatrix * vec4(pos, 1.0);
    vViewDir = normalize(-viewSpacePos.xyz);
    gl_Position = projectionMatrix * viewSpacePos;
}
`;

const BOTTY_FRAGMENT = `
uniform vec3 colorTop;
uniform vec3 colorBottom;
varying vec3 vNormal;
varying float vHeight;
varying vec3 vViewDir;

void main() {
    float h = clamp((vHeight + 1.15) / 2.3, 0.0, 1.0);
    vec3 col = mix(colorBottom, colorTop, smoothstep(0.15, 0.85, h));
    
    float rim = smoothstep(0.5, 1.0, 1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0));
    col += vec3(1.0) * rim * 0.45;
    
    gl_FragColor = vec4(col, 1.0);
}
`;

const PIP_VERTEX = `
uniform vec2 uCurve;
uniform vec3 uLocalOffset;
uniform vec3 uLocalScale;
uniform float uTime;
varying vec3 vFakeNormal;
varying float vHeight;
varying vec3 vViewDir;
void main() {
    vec3 pos = position;
    if (pos.y > 0.0) {
        float t = pos.y / 1.5; 
        float curveStrength = (pos.y * pos.y) * 0.25;
        pos.x += curveStrength * uCurve.x;
        pos.z += curveStrength * uCurve.y;
        pos.x += sin(t * 3.14 - uTime * 3.5) * (t * t * 0.12);
        pos.z += cos(t * 2.5 - uTime * 2.8) * (t * t * 0.08);
    }
    vec3 groupPos = (pos * uLocalScale) + uLocalOffset;
    vFakeNormal = normalize(normalMatrix * normalize(vec3(groupPos.x, groupPos.y * 0.8, groupPos.z)));
    vHeight = groupPos.y; 
    vec4 viewSpacePos = modelViewMatrix * vec4(pos, 1.0);
    vViewDir = normalize(-viewSpacePos.xyz);
    gl_Position = projectionMatrix * viewSpacePos;
}
`;

const PIP_FRAGMENT = `
uniform vec3 colorBottom;
uniform vec3 colorMiddle;
uniform vec3 colorTop;
varying vec3 vFakeNormal;
varying float vHeight;
varying vec3 vViewDir;
void main() {
    float h = clamp((vHeight + 1.0) / 2.5, 0.0, 1.0);
    vec3 col = mix(mix(colorBottom, colorMiddle, smoothstep(0.0, 0.45, h)), colorTop, smoothstep(0.45, 0.95, h));
    float rim = smoothstep(0.4, 1.0, 1.0 - max(dot(normalize(vFakeNormal), normalize(vViewDir)), 0.0));
    col += vec3(1.0, 0.85, 0.4) * rim * 0.55;
    gl_FragColor = vec4(col, 1.0);
}
`;

const SPOOK_FRAGMENT = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vLocalPos;

void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewDir);
    
    vec3 pink = vec3(1.0, 0.75, 0.85);
    vec3 yellow = vec3(1.0, 0.95, 0.6);
    vec3 green = vec3(0.6, 1.0, 0.8);
    vec3 blue = vec3(0.6, 0.8, 1.0);
    
    float mixX = clamp((vLocalPos.x + 1.0) / 2.0, 0.0, 1.0);
    float mixY = clamp((vLocalPos.y + 1.0) / 2.0, 0.0, 1.0);
    
    vec3 c1 = mix(pink, yellow, smoothstep(0.1, 0.6, mixX));
    vec3 c2 = mix(green, blue, smoothstep(0.4, 0.9, mixX));
    vec3 col = mix(c1, c2, smoothstep(0.2, 0.8, mixY));
    
    float rim = 1.0 - max(dot(n, v), 0.0);
    col = mix(vec3(1.0), col, smoothstep(0.0, 0.7, rim)); 
    
    vec3 l = normalize(vec3(0.5, 1.0, 0.8)); 
    vec3 h = normalize(l + v); 
    float spec = pow(max(dot(n, h), 0.0), 40.0); 
    col += vec3(1.0) * spec * 0.4; 
    
    gl_FragColor = vec4(col, 1.0);
}
`;

// ==========================================
// 2. PROCEDURAL GEOMETRY GENERATORS
// ==========================================
const getPipGeo = () => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 100; i++) {
    const y = -1 + (i / 100) * 2.5;
    const x = y < 0 ? Math.sqrt(Math.max(0, 1 - y * y)) : Math.pow(1 - Math.pow(y / 1.5, 2), 1.5);
    pts.push(new THREE.Vector2(x, y));
  }
  return new THREE.LatheGeometry(pts, 128);
};

const getPuffGeo = () => {
  const geo = new THREE.SphereGeometry(1, 128, 128);
  const pos = geo.attributes.position;
  const vec = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    vec.fromBufferAttribute(pos, i);
    const az = Math.atan2(vec.y, vec.x);
    const el = Math.pow(1 - Math.abs(vec.z), 1.5);
    const lobe = Math.cos(az * 8) * 0.12;
    vec.x += Math.cos(az) * lobe * el;
    vec.y += Math.sin(az) * lobe * el;
    vec.z *= 0.4;
    vec.x *= 1.05;
    pos.setXYZ(i, vec.x, vec.y, vec.z);
  }
  geo.computeVertexNormals();
  return geo;
};

const getBottyGeo = () => {
  const geo = new THREE.SphereGeometry(1, 128, 128);
  const pos = geo.attributes.position;
  const vec = new THREE.Vector3();
  const blend = 0.55;
  const tail_az = Math.PI / 2 - 0.65;
  const tail_el = Math.PI - 0.35;
  for (let i = 0; i < pos.count; i++) {
    vec.fromBufferAttribute(pos, i);
    const az = Math.atan2(vec.z, vec.x);
    const el = Math.acos(vec.y);
    const l4 = Math.pow(Math.pow(Math.abs(vec.x), 4) + Math.pow(Math.abs(vec.y), 4) + Math.pow(Math.abs(vec.z), 4), 0.25);
    const r = 1 / (l4 * blend + 1 * (1 - blend));
    vec.multiplyScalar(r);
    vec.x *= 1.2;
    vec.y *= 1.05;
    vec.z *= 0.85;
    const dl = Math.sqrt(Math.pow((az - tail_az) * Math.sin(el) * 1.2, 2) + Math.pow(el - tail_el, 2));
    if (dl < 0.5) {
      const t = 1 - dl / 0.5;
      const pull = Math.pow(t, 2) * 0.45;
      vec.x += pull * Math.cos(tail_az) * 1.5;
      vec.y -= pull * 1;
      vec.z += pull * Math.sin(tail_az) * 0.2;
    }
    pos.setXYZ(i, vec.x, vec.y, vec.z);
  }
  geo.computeVertexNormals();
  return geo;
};

const getSpookGeo = () => {
  const geo = new THREE.SphereGeometry(1, 128, 128, 0, Math.PI * 2, 0, Math.PI - 0.5);
  const pos = geo.attributes.position;
  const vec = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    vec.fromBufferAttribute(pos, i);
    if (vec.y < 0) {
      const az = Math.atan2(vec.z, vec.x);
      const wave = Math.cos(az * 5) * 0.15;
      const t = Math.abs(vec.y) / Math.abs(Math.cos(Math.PI - 0.5));
      vec.y += wave * Math.pow(t, 3);
      vec.x += vec.x * Math.pow(t, 2) * 0.1;
      vec.z += vec.z * Math.pow(t, 2) * 0.1;
    }
    vec.x *= 1.15;
    vec.y *= 1.3;
    vec.z *= 1.15;
    pos.setXYZ(i, vec.x, vec.y, vec.z);
  }
  geo.computeVertexNormals();
  return geo;
};

const getStarGeo = () => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.5);
  shape.quadraticCurveTo(0.1, 0.1, 0.5, 0);
  shape.quadraticCurveTo(0.1, -0.1, 0, -0.5);
  shape.quadraticCurveTo(-0.1, -0.1, -0.5, 0);
  shape.quadraticCurveTo(-0.1, 0.1, 0, 0.5);
  return new THREE.ShapeGeometry(shape);
};

// ==========================================
// 3. TYPES & PROPS
// ==========================================
export type CharacterType = 'pip' | 'puff' | 'botty' | 'spook' | 'custom';

export interface InteractivePetProps {
  characterType?: CharacterType;
  customImage?: string;
  customImageSize?: number;
  customDepth?: number;
  scale?: number;
  pipColorBottom?: string;
  pipColorMiddle?: string;
  pipColorTop?: string;
  puffColorCenter?: string;
  puffColorEdge?: string;
  bottyColorTop?: string;
  bottyColorBottom?: string;
  bottyEyeColor?: string;
  globalEyeColor?: string;
  bubbleText?: string;
  idleText?: string;
  showBubble?: boolean;
  bubbleBg?: string;
  bubbleColor?: string;
  bubbleOffsetX?: number;
  bubbleOffsetY?: number;
  speed?: number;
  wobbleSpeed?: number;
  enableIdle?: boolean;
  link?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export const InteractivePet: React.FC<InteractivePetProps> = ({
  characterType = 'pip',
  customImage,
  customImageSize = 1.8,
  customDepth = 0.25,
  scale = 1,
  pipColorBottom = '#FFD700',
  pipColorMiddle = '#FF5500',
  pipColorTop = '#FF2244',
  puffColorCenter = '#FFFFFF',
  puffColorEdge = '#3A64FF',
  bottyColorTop = '#6EA8FF',
  bottyColorBottom = '#2A7DFF',
  bottyEyeColor = '#FFFFFF',
  globalEyeColor = '#111111',
  bubbleText = 'Need any help? 👋',
  idleText = 'Zzz... 💤',
  showBubble = true,
  bubbleBg = '#0B132B',
  bubbleColor = '#FFFFFF',
  bubbleOffsetX = 1.2,
  bubbleOffsetY = 1.5,
  speed = 0.05,
  wobbleSpeed = 2,
  enableIdle = true,
  link = '',
  onClick,
  style = {},
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const textNodeRef = useRef<HTMLSpanElement>(null);
  const isIntersecting = useRef(true);
  const mousePos = useRef({ x: 0, y: 0 });
  const lastMouseTime = useRef(performance.now());
  const sizeRef = useRef({ w: 0, h: 0 });

  const sharedUniformsRef = useRef<any>(null);
  const materialsRef = useRef<any>({});
  const spookStarRef = useRef<THREE.Mesh | null>(null);
  const eyesRef = useRef<THREE.Mesh[]>([]);
  const loadedTexturesRef = useRef<THREE.Texture[]>([]);

  const propsRef = useRef({
    characterType,
    customImage,
    customImageSize,
    customDepth,
    scale,
    pipColorBottom,
    pipColorMiddle,
    pipColorTop,
    puffColorCenter,
    puffColorEdge,
    bottyColorTop,
    bottyColorBottom,
    bottyEyeColor,
    globalEyeColor,
    bubbleText,
    idleText,
    showBubble,
    bubbleOffsetX,
    bubbleOffsetY,
    speed,
    wobbleSpeed,
    enableIdle,
  });

  propsRef.current = {
    characterType,
    customImage,
    customImageSize,
    customDepth,
    scale,
    pipColorBottom,
    pipColorMiddle,
    pipColorTop,
    puffColorCenter,
    puffColorEdge,
    bottyColorTop,
    bottyColorBottom,
    bottyEyeColor,
    globalEyeColor,
    bubbleText,
    idleText,
    showBubble,
    bubbleOffsetX,
    bubbleOffsetY,
    speed,
    wobbleSpeed,
    enableIdle,
  };

  useEffect(() => {
    if (!mountRef.current) return;
    spookStarRef.current = null;
    eyesRef.current = [];
    loadedTexturesRef.current = [];

    const w = mountRef.current.clientWidth || 180;
    const h = mountRef.current.clientHeight || 200;
    sizeRef.current = { w, h };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 5.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(2, 5, 5);
    scene.add(dirLight);

    const petGroup = new THREE.Group();
    scene.add(petGroup);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    // ----------------------------------------
    // BUILD MASCOT
    // ----------------------------------------
    if (characterType === 'pip') {
      // 🔥 PIP (FLAME CHARACTER)
      const geo = getPipGeo();
      geometries.push(geo);
      const sharedUniforms = {
        colorBottom: { value: new THREE.Color(pipColorBottom) },
        colorMiddle: { value: new THREE.Color(pipColorMiddle) },
        colorTop: { value: new THREE.Color(pipColorTop) },
        uTime: { value: 0 },
      };
      sharedUniformsRef.current = sharedUniforms;

      const matMain = new THREE.ShaderMaterial({
        vertexShader: PIP_VERTEX,
        fragmentShader: PIP_FRAGMENT,
        uniforms: {
          ...sharedUniforms,
          uCurve: { value: new THREE.Vector2(0, 0) },
          uLocalOffset: { value: new THREE.Vector3(0, 0, 0) },
          uLocalScale: { value: new THREE.Vector3(1, 1, 1) },
        },
      });
      materials.push(matMain);
      petGroup.add(new THREE.Mesh(geo, matMain));

      const matLeft = new THREE.ShaderMaterial({
        vertexShader: PIP_VERTEX,
        fragmentShader: PIP_FRAGMENT,
        uniforms: {
          ...sharedUniforms,
          uCurve: { value: new THREE.Vector2(-1.8, 0) },
          uLocalOffset: { value: new THREE.Vector3(-0.62, 0.25, 0) },
          uLocalScale: { value: new THREE.Vector3(0.4, 0.65, 0.4) },
        },
      });
      materials.push(matLeft);
      const meshLeft = new THREE.Mesh(geo, matLeft);
      meshLeft.scale.set(0.4, 0.65, 0.4);
      meshLeft.position.set(-0.62, 0.25, 0);
      petGroup.add(meshLeft);

      const matRight = new THREE.ShaderMaterial({
        vertexShader: PIP_VERTEX,
        fragmentShader: PIP_FRAGMENT,
        uniforms: {
          ...sharedUniforms,
          uCurve: { value: new THREE.Vector2(1.8, 0) },
          uLocalOffset: { value: new THREE.Vector3(0.62, 0.2, 0) },
          uLocalScale: { value: new THREE.Vector3(0.35, 0.55, 0.35) },
        },
      });
      materials.push(matRight);
      const meshRight = new THREE.Mesh(geo, matRight);
      meshRight.scale.set(0.35, 0.55, 0.35);
      meshRight.position.set(0.62, 0.2, 0);
      petGroup.add(meshRight);

      // Face Group
      const faceGroup = new THREE.Group();
      petGroup.add(faceGroup);

      const eyeGeo = new THREE.SphereGeometry(0.09, 64, 64);
      geometries.push(eyeGeo);
      const eyeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(globalEyeColor),
        roughness: 0.1,
        metalness: 0.1,
      });
      materials.push(eyeMat);
      materialsRef.current.globalEyes = eyeMat;

      const clGeo = new THREE.SphereGeometry(0.025, 32, 32);
      geometries.push(clGeo);
      const clMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      materials.push(clMat);

      // Left Eye
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.scale.set(1, 1.4, 2);
      leftEye.position.set(-0.35, -0.05, 0.85);
      leftEye.rotation.y = -0.15;
      leftEye.rotation.z = 0.05;
      leftEye.userData.origScaleY = 1.4;

      const clL = new THREE.Mesh(clGeo, clMat);
      clL.scale.set(1, 1 / 1.4, 1 / 2);
      clL.position.set(0.035, 0.04, 0.075);
      leftEye.add(clL);
      faceGroup.add(leftEye);
      eyesRef.current.push(leftEye);

      // Right Eye
      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.scale.set(1, 1.4, 2);
      rightEye.position.set(0.35, -0.05, 0.85);
      rightEye.rotation.y = 0.15;
      rightEye.rotation.z = -0.05;
      rightEye.userData.origScaleY = 1.4;

      const clR = new THREE.Mesh(clGeo, clMat);
      clR.scale.set(1, 1 / 1.4, 1 / 2);
      clR.position.set(0.035, 0.04, 0.075);
      rightEye.add(clR);
      faceGroup.add(rightEye);
      eyesRef.current.push(rightEye);

      // Mouth
      const mouthGeo = new THREE.SphereGeometry(0.04, 64, 64);
      geometries.push(mouthGeo);
      const mouthMat = new THREE.MeshStandardMaterial({ color: 0x2a0800, roughness: 0.6 });
      materials.push(mouthMat);
      const mouth = new THREE.Mesh(mouthGeo, mouthMat);
      mouth.scale.set(1, 0.5, 1);
      mouth.position.set(0, -0.22, 0.96);
      faceGroup.add(mouth);
    } else if (characterType === 'botty') {
      // 🤖 BOTTY (CHATBOT)
      const bodyGeo = getBottyGeo();
      geometries.push(bodyGeo);
      const sharedUniforms = {
        colorTop: { value: new THREE.Color(bottyColorTop) },
        colorBottom: { value: new THREE.Color(bottyColorBottom) },
        uTime: { value: 0 },
      };
      sharedUniformsRef.current = sharedUniforms;
      const mat = new THREE.ShaderMaterial({
        vertexShader: BOTTY_VERTEX,
        fragmentShader: BOTTY_FRAGMENT,
        uniforms: sharedUniforms,
      });
      materials.push(mat);
      petGroup.add(new THREE.Mesh(bodyGeo, mat));

      const faceGroup = new THREE.Group();
      petGroup.add(faceGroup);
      const eyeGeo = new THREE.CapsuleGeometry(0.14, 0.38, 32, 32);
      geometries.push(eyeGeo);
      const eyeMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(bottyEyeColor) });
      materials.push(eyeMat);
      materialsRef.current.bottyEyes = eyeMat;

      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-0.35, 0.05, 0.82);
      leftEye.userData.origScaleY = 1;
      faceGroup.add(leftEye);
      eyesRef.current.push(leftEye);

      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.position.set(0.35, 0.05, 0.82);
      rightEye.userData.origScaleY = 1;
      faceGroup.add(rightEye);
      eyesRef.current.push(rightEye);
    } else if (characterType === 'puff') {
      // ☁️ PUFF
      const geo = getPuffGeo();
      geometries.push(geo);
      const sharedUniforms = {
        colorCenter: { value: new THREE.Color(puffColorCenter) },
        colorEdge: { value: new THREE.Color(puffColorEdge) },
      };
      sharedUniformsRef.current = sharedUniforms;
      const mat = new THREE.ShaderMaterial({
        vertexShader: BASE_VERTEX_SHADER,
        fragmentShader: PUFF_FRAGMENT,
        uniforms: sharedUniforms,
      });
      materials.push(mat);
      petGroup.add(new THREE.Mesh(geo, mat));

      const eyeGeo = new THREE.SphereGeometry(0.08, 64, 64);
      geometries.push(eyeGeo);
      const eyeMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(globalEyeColor) });
      materials.push(eyeMat);
      materialsRef.current.globalEyes = eyeMat;

      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.scale.set(0.9, 1.8, 0.4);
      leftEye.position.set(-0.22, 0, 0.38);
      leftEye.userData.origScaleY = 1.8;
      petGroup.add(leftEye);
      eyesRef.current.push(leftEye);

      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.scale.set(0.9, 1.8, 0.4);
      rightEye.position.set(0.22, 0, 0.38);
      rightEye.userData.origScaleY = 1.8;
      petGroup.add(rightEye);
      eyesRef.current.push(rightEye);
    } else if (characterType === 'spook') {
      // 👻 SPOOK
      const geo = getSpookGeo();
      geometries.push(geo);
      const mat = new THREE.ShaderMaterial({
        vertexShader: BASE_VERTEX_SHADER,
        fragmentShader: SPOOK_FRAGMENT,
        side: THREE.DoubleSide,
      });
      materials.push(mat);
      petGroup.add(new THREE.Mesh(geo, mat));

      const faceGroup = new THREE.Group();
      petGroup.add(faceGroup);
      const eyeGeo = new THREE.SphereGeometry(0.18, 64, 64);
      geometries.push(eyeGeo);
      const eyeMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(globalEyeColor) });
      materials.push(eyeMat);
      materialsRef.current.globalEyes = eyeMat;

      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.scale.set(0.65, 1, 0.4);
      leftEye.position.set(-0.35, 0.1, 1.05);
      leftEye.rotation.z = 0.1;
      leftEye.userData.origScaleY = 1;
      faceGroup.add(leftEye);
      eyesRef.current.push(leftEye);

      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.scale.set(0.65, 1, 0.4);
      rightEye.position.set(0.35, 0.1, 1.05);
      rightEye.rotation.z = -0.1;
      rightEye.userData.origScaleY = 1;
      faceGroup.add(rightEye);
      eyesRef.current.push(rightEye);

      const starGeo = getStarGeo();
      geometries.push(starGeo);
      const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      materials.push(starMat);
      const star = new THREE.Mesh(starGeo, starMat);
      star.scale.set(0.35, 0.35, 0.35);
      star.position.set(1.3, 1.1, 0.8);
      petGroup.add(star);
      spookStarRef.current = star;
    }

    // ----------------------------------------
    // GLOBAL INTERACTION OBSERVERS
    // ----------------------------------------
    const handleMove = (clientX: number, clientY: number) => {
      if (!mountRef.current) return;
      lastMouseTime.current = performance.now();
      const rect = mountRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mousePos.current.x = (clientX - centerX) / (window.innerWidth / 2);
      mousePos.current.y = -((clientY - centerY) / (window.innerHeight / 2));
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          sizeRef.current = { w: width, h: height };
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(mountRef.current);

    const io = new IntersectionObserver(([entry]) => {
      isIntersecting.current = entry.isIntersecting;
    });
    io.observe(mountRef.current);

    // ----------------------------------------
    // ANIMATION LOOP & PHYSICS
    // ----------------------------------------
    let frameId: number;
    const tempV = new THREE.Vector3();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isIntersecting.current) return;

      const time = performance.now() * 0.001;
      const p = propsRef.current;

      // 1. Idle Detection
      const isIdle = p.enableIdle && performance.now() - lastMouseTime.current > 3000;
      if (textNodeRef.current) {
        const targetText = isIdle ? p.idleText || p.bubbleText : p.bubbleText;
        if (textNodeRef.current.innerText !== targetText) {
          textNodeRef.current.innerText = targetText;
        }
      }

      // 2. Smooth Organic Blinking & Sleeping Engine
      let targetScaleY = 1;
      if (isIdle) {
        targetScaleY = 0.1; // Sleeping
      } else {
        if (time % 4 < 0.15 || time % 7 > 6.85) {
          targetScaleY = 0.1; // Blinking
        }
      }
      eyesRef.current.forEach((eye) => {
        if (eye.userData.origScaleY !== undefined) {
          eye.scale.y += (eye.userData.origScaleY * targetScaleY - eye.scale.y) * 0.2;
        }
      });

      if (sharedUniformsRef.current && (p.characterType === 'pip' || p.characterType === 'botty')) {
        sharedUniformsRef.current.uTime.value = time;
      }

      // 3. Spook Star Rotation
      if (p.characterType === 'spook' && spookStarRef.current) {
        spookStarRef.current.rotation.z = time * 1.5;
        spookStarRef.current.position.y = 1.1 + Math.sin(time * 3) * 0.1;
      }

      // 4. Breathing Mechanics
      const wobbleSpeed_ = p.wobbleSpeed || 2;
      const breathY = 1 + Math.sin(time * wobbleSpeed_) * (isIdle ? 0.035 : 0.02);
      const breathXZ = 1 - Math.sin(time * wobbleSpeed_) * (isIdle ? 0.02 : 0.01);
      const baseScale = p.scale || 1;
      petGroup.scale.set(baseScale * breathXZ, baseScale * breathY, baseScale * breathXZ);
      const floatOffset = Math.sin(time * wobbleSpeed_ * 0.8) * 0.08;

      // 5. Physics & Tracking
      let targetX = mousePos.current.x * 2.5;
      let targetY = mousePos.current.y * 1.5 + floatOffset;
      let targetRotY = mousePos.current.x * 0.6;
      let targetRotX = -mousePos.current.y * 0.4;
      if (isIdle) {
        targetX = Math.sin(time * 0.8) * 0.4;
        targetY = Math.cos(time * 0.6) * 0.3 + floatOffset;
        targetRotY = Math.sin(time * 0.5) * 0.3;
        targetRotX = Math.cos(time * 0.4) * 0.1;
      }

      const spd = p.speed || 0.06;
      petGroup.position.x += (targetX - petGroup.position.x) * spd;
      petGroup.position.y += (targetY - petGroup.position.y) * spd;

      const velocityX = targetX - petGroup.position.x;
      const targetRotZ = -velocityX * 0.15;
      petGroup.rotation.y += (targetRotY - petGroup.rotation.y) * (spd * 1.5);
      petGroup.rotation.x += (targetRotX - petGroup.rotation.x) * (spd * 1.5);
      petGroup.rotation.z += (targetRotZ - petGroup.rotation.z) * (spd * 1.5);

      // 6. Calculate 2D Screen Position for HTML Speech Bubble
      if (p.showBubble && bubbleRef.current && sizeRef.current.w > 0) {
        tempV.copy(petGroup.position);
        tempV.x += (p.bubbleOffsetX || 1.2) * baseScale;
        tempV.y += (p.bubbleOffsetY || 1.5) * baseScale;
        tempV.project(camera);
        const px = (tempV.x * 0.5 + 0.5) * sizeRef.current.w;
        const py = (tempV.y * -0.5 + 0.5) * sizeRef.current.h;
        bubbleRef.current.style.transform = `translate3d(-50%, -100%, 0) translate3d(${px}px, ${py}px, 0)`;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ----------------------------------------
    // WEBGL CLEANUP
    // ----------------------------------------
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      resizeObserver.disconnect();
      io.disconnect();
      petGroup.traverse((child: any) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m: any) => {
                if (m.map) m.map.dispose();
                m.dispose();
              });
            } else {
              if (child.material.map) child.material.map.dispose();
              child.material.dispose();
            }
          }
        }
      });
      loadedTexturesRef.current.forEach((t) => t.dispose());
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      scene.clear();
      renderer.forceContextLoss();
      renderer.dispose();
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [characterType, customImage, customImageSize, customDepth]);

  // Reactive Colors
  useEffect(() => {
    if (sharedUniformsRef.current) {
      if (characterType === 'pip') {
        sharedUniformsRef.current.colorBottom?.value.set(pipColorBottom);
        sharedUniformsRef.current.colorMiddle?.value.set(pipColorMiddle);
        sharedUniformsRef.current.colorTop?.value.set(pipColorTop);
      } else if (characterType === 'puff') {
        sharedUniformsRef.current.colorCenter?.value.set(puffColorCenter);
        sharedUniformsRef.current.colorEdge?.value.set(puffColorEdge);
      } else if (characterType === 'botty') {
        sharedUniformsRef.current.colorTop?.value.set(bottyColorTop);
        sharedUniformsRef.current.colorBottom?.value.set(bottyColorBottom);
      }
    }
    if (materialsRef.current.globalEyes) materialsRef.current.globalEyes.color.set(globalEyeColor);
    if (materialsRef.current.bottyEyes) materialsRef.current.bottyEyes.color.set(bottyEyeColor);
  }, [
    pipColorBottom,
    pipColorMiddle,
    pipColorTop,
    globalEyeColor,
    puffColorCenter,
    puffColorEdge,
    bottyColorTop,
    bottyColorBottom,
    bottyEyeColor,
    characterType,
  ]);

  const isLinked = Boolean(link && link.trim() !== '');
  const WrapperTag = isLinked ? 'a' : 'div';

  return (
    <WrapperTag
      {...(isLinked ? { href: link } : {})}
      onClick={onClick}
      className={className}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        minWidth: 120,
        minHeight: 120,
        position: 'relative',
        overflow: 'visible',
        cursor: isLinked || onClick ? 'pointer' : 'default',
        textDecoration: 'none',
        ...style,
      }}
    >
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          overflow: 'visible',
        }}
      />
      {showBubble && (
        <div
          ref={bubbleRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 100,
            willChange: 'transform',
          }}
        >
          <div
            style={{
              backgroundColor: bubbleBg,
              color: bubbleColor,
              padding: '8px 16px',
              borderRadius: '20px',
              boxShadow: '0px 14px 34px rgba(0, 0, 0, 0.35), 0px 4px 10px rgba(0, 0, 0, 0.2)',
              fontWeight: 600,
              fontSize: '12px',
              fontFamily: '"Geist", -apple-system, sans-serif',
              whiteSpace: 'nowrap',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <span ref={textNodeRef}>{bubbleText}</span>
            <div
              style={{
                position: 'absolute',
                bottom: '-6px',
                left: '20px',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: `6px solid ${bubbleBg}`,
              }}
            />
          </div>
        </div>
      )}
    </WrapperTag>
  );
};

export default InteractivePet;
