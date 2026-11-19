import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ==========================================
// 1. PIP FLAME CHARACTER SHADERS
// ==========================================
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
    float rim = smoothstep(0.35, 1.0, 1.0 - max(dot(normalize(vFakeNormal), normalize(vViewDir)), 0.0));
    col += vec3(1.0, 0.9, 0.5) * rim * 0.6;
    gl_FragColor = vec4(col, 1.0);
}
`;

// Procedural Lathe Geometry for Pip
const getPipGeo = () => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 100; i++) {
    const y = -1 + (i / 100) * 2.5;
    const x = y < 0 ? Math.sqrt(Math.max(0, 1 - y * y)) : Math.pow(1 - Math.pow(y / 1.5, 2), 1.5);
    pts.push(new THREE.Vector2(x, y));
  }
  return new THREE.LatheGeometry(pts, 128);
};

export interface InteractivePetProps {
  scale?: number;
  pipColorBottom?: string;
  pipColorMiddle?: string;
  pipColorTop?: string;
  globalEyeColor?: string;
  bubbleText?: string;
  idleText?: string;
  showBubble?: boolean;
  bubbleBg?: string;
  bubbleColor?: string;
  speed?: number;
  wobbleSpeed?: number;
  enableIdle?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export const InteractivePet: React.FC<InteractivePetProps> = ({
  scale = 1.0,
  pipColorBottom = '#FFD700',
  pipColorMiddle = '#FF5500',
  pipColorTop = '#FF2244',
  globalEyeColor = '#111111',
  bubbleText = 'Need any help? 👋',
  idleText = 'Zzz... 💤',
  showBubble = true,
  bubbleBg = 'rgba(8, 14, 30, 0.88)',
  bubbleColor = '#FFFFFF',
  speed = 0.06,
  wobbleSpeed = 2.2,
  enableIdle = true,
  onClick,
  style = {},
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const textNodeRef = useRef<HTMLSpanElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const lastMouseTime = useRef(performance.now());
  const sizeRef = useRef({ w: 0, h: 0 });

  const sharedUniformsRef = useRef<{
    colorBottom: { value: THREE.Color };
    colorMiddle: { value: THREE.Color };
    colorTop: { value: THREE.Color };
    uTime: { value: number };
  } | null>(null);

  const eyesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;
    eyesRef.current = [];

    const w = mountRef.current.clientWidth || 180;
    const h = mountRef.current.clientHeight || 200;
    sizeRef.current = { w, h };

    const scene = new THREE.Scene();
    // Camera positioned with center at Y = 0.28 where Pip's face is centered
    const camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 100);
    camera.position.set(0, 0.28, 4.3);
    camera.lookAt(0, 0.28, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(2, 4, 5);
    scene.add(dirLight);

    const petGroup = new THREE.Group();
    scene.add(petGroup);

    // ── BUILD THE FLAME PET (PIP) ──
    const geo = getPipGeo();
    const sharedUniforms = {
      colorBottom: { value: new THREE.Color(pipColorBottom) },
      colorMiddle: { value: new THREE.Color(pipColorMiddle) },
      colorTop: { value: new THREE.Color(pipColorTop) },
      uTime: { value: 0 },
    };
    sharedUniformsRef.current = sharedUniforms;

    // Main Flame Body
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
    petGroup.add(new THREE.Mesh(geo, matMain));

    // Left Flame Wing/Ear
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
    const meshLeft = new THREE.Mesh(geo, matLeft);
    meshLeft.scale.set(0.4, 0.65, 0.4);
    meshLeft.position.set(-0.62, 0.25, 0);
    petGroup.add(meshLeft);

    // Right Flame Wing/Ear
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
    const meshRight = new THREE.Mesh(geo, matRight);
    meshRight.scale.set(0.35, 0.55, 0.35);
    meshRight.position.set(0.62, 0.2, 0);
    petGroup.add(meshRight);

    // Cute Face Group
    const faceGroup = new THREE.Group();
    petGroup.add(faceGroup);

    const eyeGeo = new THREE.SphereGeometry(0.09, 64, 64);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(globalEyeColor),
      roughness: 0.1,
      metalness: 0.1,
    });

    const clGeo = new THREE.SphereGeometry(0.026, 32, 32);
    const clMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

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

    // Cute Smiling Mouth
    const mouthGeo = new THREE.SphereGeometry(0.045, 64, 64);
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0x3d0b00, roughness: 0.5 });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.scale.set(1, 0.5, 1);
    mouth.position.set(0, -0.22, 0.96);
    faceGroup.add(mouth);

    // ── MOUSE TRACKING ──
    const handleMove = (clientX: number, clientY: number) => {
      lastMouseTime.current = performance.now();
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      // Clamped normalized offset
      mousePos.current.x = Math.max(-1.5, Math.min(1.5, (clientX - centerX) / 400));
      mousePos.current.y = Math.max(-1.5, Math.min(1.5, -((clientY - centerY) / 400)));
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

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

    // ── ANIMATION & PHYSICS LOOP ──
    let frameId: number;
    const tempV = new THREE.Vector3();

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const time = performance.now() * 0.001;

      // 1. Idle Detection (sleeps after 3s of inactivity)
      const isIdle = enableIdle && performance.now() - lastMouseTime.current > 3000;
      if (textNodeRef.current) {
        const targetText = isIdle ? idleText : bubbleText;
        if (textNodeRef.current.innerText !== targetText) {
          textNodeRef.current.innerText = targetText;
        }
      }

      // 2. Eye Blinking & Sleeping
      let targetScaleY = 1;
      if (isIdle) {
        targetScaleY = 0.08; // sleeping closed eyes
      } else {
        if (time % 4.5 < 0.16 || time % 7.2 > 7.04) {
          targetScaleY = 0.1; // natural organic blink
        }
      }
      eyesRef.current.forEach((eye) => {
        if (eye.userData.origScaleY !== undefined) {
          eye.scale.y += (eye.userData.origScaleY * targetScaleY - eye.scale.y) * 0.22;
        }
      });

      if (sharedUniformsRef.current) {
        sharedUniformsRef.current.uTime.value = time;
      }

      // 3. Gentle Breathing Wobble
      const breathY = 1 + Math.sin(time * wobbleSpeed) * (isIdle ? 0.03 : 0.02);
      const breathXZ = 1 - Math.sin(time * wobbleSpeed) * (isIdle ? 0.015 : 0.01);
      petGroup.scale.set(scale * breathXZ, scale * breathY, scale * breathXZ);

      // 4. Floating & Physics
      // Keep Pip safely in center of frame with subtle restrained displacement
      const floatOffset = Math.sin(time * wobbleSpeed * 0.8) * 0.06;
      const targetX = Math.max(-0.25, Math.min(0.25, mousePos.current.x * 0.25));
      const targetY = Math.max(-0.12, Math.min(0.2, mousePos.current.y * 0.15)) + floatOffset;

      const targetRotY = mousePos.current.x * 0.55;
      const targetRotX = -mousePos.current.y * 0.35;

      petGroup.position.x += (targetX - petGroup.position.x) * speed;
      petGroup.position.y += (targetY - petGroup.position.y) * speed;

      const velocityX = targetX - petGroup.position.x;
      const targetRotZ = -velocityX * 0.25;

      petGroup.rotation.y += (targetRotY - petGroup.rotation.y) * (speed * 1.5);
      petGroup.rotation.x += (targetRotX - petGroup.rotation.x) * (speed * 1.5);
      petGroup.rotation.z += (targetRotZ - petGroup.rotation.z) * (speed * 1.5);

      // 5. Speech Bubble Anchor
      if (showBubble && bubbleRef.current && sizeRef.current.w > 0) {
        tempV.copy(petGroup.position);
        tempV.x += 0.35 * scale;
        tempV.y += 1.35 * scale;
        tempV.project(camera);
        const px = (tempV.x * 0.5 + 0.5) * sizeRef.current.w;
        const py = (tempV.y * -0.5 + 0.5) * sizeRef.current.h;
        bubbleRef.current.style.transform = `translate3d(-50%, -100%, 0) translate3d(${px}px, ${py}px, 0)`;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      resizeObserver.disconnect();
      geo.dispose();
      matMain.dispose();
      matLeft.dispose();
      matRight.dispose();
      eyeGeo.dispose();
      eyeMat.dispose();
      clGeo.dispose();
      clMat.dispose();
      mouthGeo.dispose();
      mouthMat.dispose();
      scene.clear();
      renderer.forceContextLoss();
      renderer.dispose();
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [scale, pipColorBottom, pipColorMiddle, pipColorTop, globalEyeColor, wobbleSpeed, speed, enableIdle]);

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        minWidth: 160,
        minHeight: 180,
        position: 'relative',
        overflow: 'visible',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
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
              boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.4), 0 0 16px rgba(255, 85, 0, 0.25)',
              fontWeight: 600,
              fontSize: '12px',
              fontFamily: '"Geist", -apple-system, sans-serif',
              whiteSpace: 'nowrap',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 120, 50, 0.35)',
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
                borderTop: '6px solid rgba(255, 100, 30, 0.85)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractivePet;
