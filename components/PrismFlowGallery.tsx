// PrismFlow Gallery — WebGL 3D Interactive Carousel
// Adapted from Framer Component: https://framer.com/m/PrismFlow-Gallery-je0J8O.js@JzO5QHDXWcbkvA7vTCSS
// Powered by Three.js with custom GLSL wave distortion and rounded rectangular masking

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 440;
const MAX_RENDER_WIDTH = 2560;
const MAX_RENDER_HEIGHT = 1400;

export interface PrismFlowItem {
  id: string;
  image: string;
  title: string;
  number?: string;
  category?: string;
}

export interface PrismFlowGalleryProps {
  items: PrismFlowItem[];
  height?: number | string;
  background?: string;
  onItemSelect?: (item: PrismFlowItem, index: number) => void;
  layout?: {
    itemWidth?: number;
    itemHeight?: number;
    gap?: number;
    cameraZoom?: number;
    radius?: number;
  };
  motion?: {
    drag?: boolean;
    dragSpeed?: number;
    wheel?: boolean;
    wheelSpeed?: number;
    autoplay?: boolean;
    autoplaySpeed?: number;
    pauseOnHover?: boolean;
    snap?: boolean;
    intro?: boolean;
    loopMode?: 'infinite' | 'restart' | 'off';
    smoothness?: number;
    openSmoothness?: number;
  };
  effects?: {
    wave?: boolean;
    wavePower?: number;
    vignette?: boolean;
    vignetteOpacity?: number;
    edgeFade?: boolean;
    edgeFadeOpacity?: number;
    quality?: number;
    meshDetail?: number;
  };
  close?: {
    showHint?: boolean;
    hintText?: string;
    textColor?: string;
    background?: string;
  };
}

const vertexShader = `
varying vec2 vUv;
uniform float uOpen;
uniform float uIntro;
uniform vec2 uZoomScale;
uniform float uWaveStrength;

void main() {
    vUv = uv;

    vec3 pos = position;

    float angle = uOpen * 3.14159265 / 2.0;
    float wave = cos(angle);
    float centerWave = sin(length(uv - 0.5) * 15.0 + uOpen * 12.0) * 0.5 + 0.5;

    pos.x *= mix(1.0, uZoomScale.x + wave * centerWave * uWaveStrength, uOpen);
    pos.y *= mix(1.0, uZoomScale.y + wave * centerWave * uWaveStrength, uOpen);
    pos.y += (1.0 - uIntro) * -0.12;
    pos.z += (1.0 - uIntro) * -0.12;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uImageRes;
uniform vec2 uPlaneSize;
uniform float uIntro;
uniform float uOpacity;
uniform float uRadius;

varying vec2 vUv;

vec2 coverUv(vec2 uv, vec2 screenSize, vec2 imageSize) {
    float screenRatio = screenSize.x / screenSize.y;
    float imageRatio = imageSize.x / imageSize.y;

    vec2 newSize = screenRatio < imageRatio
        ? vec2(imageSize.x * screenSize.y / imageSize.y, screenSize.y)
        : vec2(screenSize.x, imageSize.y * screenSize.x / imageSize.x);

    vec2 offset = screenRatio < imageRatio
        ? vec2((newSize.x - screenSize.x) / 2.0, 0.0)
        : vec2(0.0, (newSize.y - screenSize.y) / 2.0);

    return uv * screenSize / newSize + offset / newSize;
}

float roundedRectMask(vec2 uv, vec2 size, float radius) {
    if (radius <= 0.0001) return 1.0;

    float safeRadius = min(radius, min(size.x, size.y) * 0.48);
    vec2 p = (uv - 0.5) * size;
    vec2 b = size * 0.5 - vec2(safeRadius);
    vec2 q = abs(p) - b;

    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - safeRadius;
    float aa = min(size.x, size.y) * 0.006;

    return 1.0 - smoothstep(0.0, aa, d);
}

void main() {
    vec2 uv = coverUv(vUv, uRes, uImageRes);
    vec3 color = texture2D(uTex, uv).rgb;
    float mask = roundedRectMask(vUv, uPlaneSize, uRadius);

    gl_FragColor = vec4(color, uIntro * uOpacity * mask);
}
`;

function safeSize(value: number, fallback: number, max: number): number {
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.min(Math.round(value), max);
}

function damp(current: number, target: number, speed: number, delta: number): number {
  return THREE.MathUtils.damp(current, target, speed, delta);
}

function positiveModulo(value: number, length: number): number {
  return ((value % length) + length) % length;
}

function wrapPosition(value: number, length: number): number {
  return positiveModulo(value + length / 2, length) - length / 2;
}

function radiusToWorldUnits(radius: number, width: number, height: number): number {
  const normalized = Math.max(0, radius) / 100;
  return Math.min(normalized, Math.min(width, height) * 0.48);
}

function getTextureImageSize(texture: THREE.Texture): { width: number; height: number } {
  const source = texture.image;
  if (!source || typeof source !== 'object') {
    return { width: 1200, height: 1600 };
  }
  const width = typeof source.naturalWidth === 'number' && source.naturalWidth > 0
    ? source.naturalWidth
    : typeof source.width === 'number' && source.width > 0
    ? source.width
    : 1200;
  const height = typeof source.naturalHeight === 'number' && source.naturalHeight > 0
    ? source.naturalHeight
    : typeof source.height === 'number' && source.height > 0
    ? source.height
    : 1600;
  return { width, height };
}

function createFallbackTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const texture = new THREE.DataTexture(new Uint8Array([20, 20, 24, 255]), 1, 1, THREE.RGBAFormat);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }
  const gradient = ctx.createLinearGradient(0, 0, 64, 96);
  gradient.addColorStop(0, '#1c1c24');
  gradient.addColorStop(0.5, '#121218');
  gradient.addColorStop(1, '#252532');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 96);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export const PrismFlowGallery: React.FC<PrismFlowGalleryProps> = ({
  items,
  height = '500px',
  background = 'transparent',
  onItemSelect,
  layout = {},
  motion = {},
  effects = {},
  close = {},
}) => {
  const cfgLayout = useMemo(
    () => ({
      itemWidth: layout.itemWidth ?? 1.1,
      itemHeight: layout.itemHeight ?? 2.35,
      gap: layout.gap ?? 0.18,
      cameraZoom: layout.cameraZoom ?? 5.2,
      radius: layout.radius ?? 24,
    }),
    [layout.itemWidth, layout.itemHeight, layout.gap, layout.cameraZoom, layout.radius]
  );

  const cfgMotion = useMemo(
    () => ({
      drag: motion.drag ?? true,
      dragSpeed: motion.dragSpeed ?? 0.65,
      wheel: motion.wheel ?? true,
      wheelSpeed: motion.wheelSpeed ?? 0.55,
      autoplay: motion.autoplay ?? true,
      autoplaySpeed: motion.autoplaySpeed ?? 0.15,
      pauseOnHover: motion.pauseOnHover ?? true,
      snap: motion.snap ?? false,
      intro: motion.intro ?? true,
      loopMode: motion.loopMode ?? 'infinite',
      smoothness: motion.smoothness ?? 10,
      openSmoothness: motion.openSmoothness ?? 8,
    }),
    [
      motion.drag,
      motion.dragSpeed,
      motion.wheel,
      motion.wheelSpeed,
      motion.autoplay,
      motion.autoplaySpeed,
      motion.pauseOnHover,
      motion.snap,
      motion.intro,
      motion.loopMode,
      motion.smoothness,
      motion.openSmoothness,
    ]
  );

  const cfgEffects = useMemo(
    () => ({
      wave: effects.wave ?? true,
      wavePower: effects.wavePower ?? 0.85,
      vignette: effects.vignette ?? true,
      vignetteOpacity: effects.vignetteOpacity ?? 0.35,
      edgeFade: effects.edgeFade ?? true,
      edgeFadeOpacity: effects.edgeFadeOpacity ?? 0.45,
      quality: effects.quality ?? 1.1,
      meshDetail: effects.meshDetail ?? 16,
    }),
    [
      effects.wave,
      effects.wavePower,
      effects.vignette,
      effects.vignetteOpacity,
      effects.edgeFade,
      effects.edgeFadeOpacity,
      effects.quality,
      effects.meshDetail,
    ]
  );

  const cfgClose = useMemo(
    () => ({
      showHint: close.showHint ?? true,
      hintText: close.hintText ?? 'Click anywhere to close · Click item to view deep intelligence',
      textColor: close.textColor ?? '#FFFFFF',
      background: close.background ?? 'rgba(15, 15, 20, 0.75)',
    }),
    [close.showHint, close.hintText, close.textColor, close.background]
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeItemRef = useRef<THREE.Mesh | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<PrismFlowItem | null>(null);
  const [hoveredItem, setHoveredItem] = useState<PrismFlowItem | null>(null);

  const imageUrls = useMemo(() => items.map((it) => it.image), [items]);

  const closeActive = useCallback(() => {
    activeItemRef.current = null;
    setIsOpen(false);
    setActiveItem(null);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas || items.length === 0) return;

    const imageCount = Math.max(1, imageUrls.length);
    const isInfinite = cfgMotion.loopMode === 'infinite';
    const isRestart = cfgMotion.loopMode === 'restart';
    const isOff = cfgMotion.loopMode === 'off';

    const poolCount = isInfinite ? Math.min(Math.max(imageCount * 2, 18), 40) : imageCount;
    const centerOffset = isInfinite ? Math.floor(poolCount / 2) : 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(new THREE.Color(0x000000), 0);
    renderer.sortObjects = true;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    const fallbackTexture = createFallbackTexture();
    const textureCache = new Map<number, THREE.Texture>();
    const meshes: THREE.Mesh[] = [];
    const materials: THREE.ShaderMaterial[] = [];

    let width = DEFAULT_WIDTH;
    let heightVal = DEFAULT_HEIGHT;
    let viewportWidth = 1;
    let viewportHeight = 1;

    let progress = 0;
    let targetProgress = 0;
    let startOffset = 0;
    let scrollDirection = 1;

    let hoveredMesh: THREE.Mesh | null = null;
    let isDragging = false;
    let didDrag = false;
    let lastX = 0;
    let lastTime = window.performance.now();
    let frame = 0;
    let userInteractingUntil = 0;
    let isVisible = true;
    let tabVisible = true;

    const itemDistance = cfgLayout.itemWidth + cfgLayout.gap;
    const loopWidth = poolCount * itemDistance;
    const maxProgress = Math.max(0, imageCount - 1);

    function getPixelRatio(): number {
      const isMobile = window.innerWidth < 768;
      const maxQuality = isMobile ? Math.min(cfgEffects.quality, 1) : Math.min(cfgEffects.quality, 1.35);
      return Math.min(window.devicePixelRatio || 1, maxQuality);
    }

    function updateViewport() {
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      width = safeSize(rect.width, DEFAULT_WIDTH, MAX_RENDER_WIDTH);
      heightVal = safeSize(rect.height, DEFAULT_HEIGHT, MAX_RENDER_HEIGHT);
      renderer.setSize(width, heightVal, false);
      renderer.setPixelRatio(getPixelRatio());
      camera.aspect = width / heightVal;
      camera.position.z = cfgLayout.cameraZoom;
      camera.updateProjectionMatrix();

      const vFov = THREE.MathUtils.degToRad(camera.fov);
      viewportHeight = 2 * Math.tan(vFov / 2) * camera.position.z;
      viewportWidth = viewportHeight * camera.aspect;

      materials.forEach((material) => {
        material.uniforms.uZoomScale.value.set(
          viewportWidth / cfgLayout.itemWidth,
          viewportHeight / cfgLayout.itemHeight
        );
      });
    }

    function assignTexture(material: THREE.ShaderMaterial, imageIndex: number) {
      const safeIndex = imageIndex % imageUrls.length;
      const cached = textureCache.get(safeIndex);
      if (cached) {
        const size = getTextureImageSize(cached);
        material.uniforms.uTex.value = cached;
        material.uniforms.uImageRes.value.set(size.width, size.height);
        return;
      }

      material.uniforms.uTex.value = fallbackTexture;
      loader.load(
        imageUrls[safeIndex],
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.needsUpdate = true;
          textureCache.set(safeIndex, texture);
          const size = getTextureImageSize(texture);
          material.uniforms.uTex.value = texture;
          material.uniforms.uImageRes.value.set(size.width, size.height);
        },
        undefined,
        () => {
          material.uniforms.uTex.value = fallbackTexture;
        }
      );
    }

    // Create Mesh Pool
    for (let i = 0; i < poolCount; i++) {
      const baseIndex = isInfinite ? i - centerOffset : i;
      const imageIndex = isInfinite ? positiveModulo(baseIndex, imageCount) : i;
      const radiusWorld = radiusToWorldUnits(cfgLayout.radius, cfgLayout.itemWidth, cfgLayout.itemHeight);

      const uniforms = {
        uOpen: { value: 0 },
        uIntro: { value: cfgMotion.intro ? 0 : 1 },
        uZoomScale: { value: new THREE.Vector2(1, 1) },
        uTex: { value: fallbackTexture },
        uRes: { value: new THREE.Vector2(cfgLayout.itemWidth, cfgLayout.itemHeight) },
        uImageRes: { value: new THREE.Vector2(1200, 1600) },
        uPlaneSize: { value: new THREE.Vector2(cfgLayout.itemWidth, cfgLayout.itemHeight) },
        uWaveStrength: { value: cfgEffects.wave ? cfgEffects.wavePower : 0 },
        uOpacity: { value: 1 },
        uRadius: { value: radiusWorld },
      };

      const segments = Math.max(4, Math.round(cfgEffects.meshDetail));
      const geometry = new THREE.PlaneGeometry(cfgLayout.itemWidth, cfgLayout.itemHeight, segments, segments);
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = baseIndex * itemDistance;
      mesh.scale.setScalar(cfgMotion.intro ? 0.96 : 1);
      mesh.userData = {
        index: i,
        baseIndex,
        imageIndex,
        baseX: baseIndex * itemDistance,
        item: items[imageIndex],
      };
      mesh.renderOrder = 1;

      assignTexture(material, imageIndex);
      scene.add(mesh);
      meshes.push(mesh);
      materials.push(material);
    }

    function getPointer(event: PointerEvent) {
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    }

    function hitTest(event: PointerEvent): THREE.Mesh | null {
      getPointer(event);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(meshes, false);
      return hits.length ? (hits[0].object as THREE.Mesh) : null;
    }

    function getTargetX(mesh: THREE.Mesh, index: number): number {
      if (isInfinite) {
        const baseX = mesh.userData.baseX;
        return wrapPosition(baseX - progress * itemDistance, loopWidth);
      }
      return startOffset + index * itemDistance - progress * itemDistance;
    }

    function animate() {
      frame = requestAnimationFrame(animate);
      if (!isVisible || !tabVisible) {
        lastTime = window.performance.now();
        return;
      }

      const now = window.performance.now();
      const delta = Math.min(0.04, (now - lastTime) / 1000);
      lastTime = now;

      const activeMesh = activeItemRef.current;
      const userIsInteracting = now < userInteractingUntil;
      const hoverPaused = cfgMotion.pauseOnHover && hoveredMesh !== null && !activeMesh;

      if (cfgMotion.autoplay && !activeMesh && !isDragging && !userIsInteracting && !hoverPaused) {
        targetProgress += cfgMotion.autoplaySpeed * delta;
      }

      if (Math.abs(targetProgress - progress) > 0.0005) {
        scrollDirection = targetProgress > progress ? 1 : -1;
      }

      if (cfgMotion.snap && !activeMesh && !isDragging && !cfgMotion.autoplay) {
        targetProgress = damp(targetProgress, Math.round(targetProgress), 5, delta);
      }

      if (isOff) {
        targetProgress = THREE.MathUtils.clamp(targetProgress, 0, maxProgress);
      }

      progress = damp(progress, targetProgress, cfgMotion.smoothness, delta);

      if (isInfinite && Math.abs(progress) > imageCount * 1000) {
        const shift = Math.trunc(progress / imageCount) * imageCount;
        progress -= shift;
        targetProgress -= shift;
      }

      const radiusWorld = radiusToWorldUnits(cfgLayout.radius, cfgLayout.itemWidth, cfgLayout.itemHeight);

      meshes.forEach((mesh, index) => {
        const material = mesh.material as THREE.ShaderMaterial;
        const isActive = activeMesh === mesh;
        const isHovered = hoveredMesh === mesh && !activeMesh;

        let targetX = getTargetX(mesh, index);
        const distanceFromCenter = Math.abs(targetX / itemDistance);
        let targetOpacity = 1 - Math.min(distanceFromCenter * 0.04, 0.32);
        let targetScale = isHovered ? 1.05 : 1;
        let targetZ = 0;
        let targetOpen = 0;
        let targetResX = cfgLayout.itemWidth;
        let targetResY = cfgLayout.itemHeight;
        let targetRadius = radiusWorld;

        mesh.renderOrder = 1;

        if (isActive) {
          targetX = 0;
          targetOpacity = 1;
          targetScale = 1;
          targetZ = 0.35;
          targetOpen = 1;
          targetResX = viewportWidth;
          targetResY = viewportHeight;
          targetRadius = radiusToWorldUnits(cfgLayout.radius, viewportWidth, viewportHeight);
          mesh.renderOrder = 999;
        } else if (activeMesh) {
          targetOpacity = 0.16;
          targetZ = -0.35;
        }

        const wrapJumpLimit = viewportWidth + itemDistance * 4;
        const distanceToTarget = Math.abs(mesh.position.x - targetX);

        if (isInfinite && !isActive && distanceToTarget > wrapJumpLimit) {
          mesh.position.x = targetX;
        } else {
          mesh.position.x = damp(
            mesh.position.x,
            targetX,
            isActive ? cfgMotion.openSmoothness : 16,
            delta
          );
        }

        mesh.position.z = damp(mesh.position.z, targetZ, 12, delta);
        mesh.scale.x = damp(mesh.scale.x, targetScale, 12, delta);
        mesh.scale.y = damp(mesh.scale.y, targetScale, 12, delta);

        material.uniforms.uIntro.value = damp(material.uniforms.uIntro.value, 1, 7, delta);
        material.uniforms.uOpen.value = damp(
          material.uniforms.uOpen.value,
          targetOpen,
          cfgMotion.openSmoothness,
          delta
        );
        material.uniforms.uOpacity.value = damp(material.uniforms.uOpacity.value, targetOpacity, 12, delta);
        material.uniforms.uWaveStrength.value = cfgEffects.wave ? cfgEffects.wavePower : 0;
        material.uniforms.uRadius.value = damp(
          material.uniforms.uRadius.value,
          targetRadius,
          cfgMotion.openSmoothness,
          delta
        );
        material.uniforms.uZoomScale.value.set(
          viewportWidth / cfgLayout.itemWidth,
          viewportHeight / cfgLayout.itemHeight
        );
        material.uniforms.uPlaneSize.value.set(targetResX, targetResY);
        material.uniforms.uRes.value.x = damp(
          material.uniforms.uRes.value.x,
          targetResX,
          cfgMotion.openSmoothness,
          delta
        );
        material.uniforms.uRes.value.y = damp(
          material.uniforms.uRes.value.y,
          targetResY,
          cfgMotion.openSmoothness,
          delta
        );
      });

      renderer.setRenderTarget(null);
      renderer.clear();
      renderer.render(scene, camera);
    }

    function handlePointerDown(event: PointerEvent) {
      isDragging = true;
      didDrag = false;
      lastX = event.clientX;
      userInteractingUntil = window.performance.now() + 1400;
      if (wrapper) wrapper.style.cursor = 'grabbing';
      try {
        wrapper?.setPointerCapture(event.pointerId);
      } catch {}
    }

    function handlePointerMove(event: PointerEvent) {
      if (!isDragging && !activeItemRef.current) {
        const hit = hitTest(event);
        hoveredMesh = hit;
        setHoveredItem(hit ? hit.userData.item : null);
      }
      if (wrapper) {
        wrapper.style.cursor = activeItemRef.current !== null ? 'pointer' : hoveredMesh ? 'pointer' : isDragging ? 'grabbing' : 'grab';
      }

      if (!cfgMotion.drag || activeItemRef.current || !isDragging) return;

      const deltaX = event.clientX - lastX;
      const isMobile = window.innerWidth < 768;
      const mobileFactor = isMobile ? 0.7 : 1;

      if (Math.abs(deltaX) > 2) didDrag = true;

      const movement = -deltaX * 0.014 * cfgMotion.dragSpeed * mobileFactor;
      targetProgress += movement;
      if (movement > 0) scrollDirection = 1;
      if (movement < 0) scrollDirection = -1;

      if (isOff) {
        targetProgress = THREE.MathUtils.clamp(targetProgress, 0, maxProgress);
      }

      lastX = event.clientX;
      userInteractingUntil = window.performance.now() + 1400;
    }

    function handlePointerUp(event: PointerEvent) {
      if (!isDragging) return;
      isDragging = false;
      if (wrapper) wrapper.style.cursor = 'grab';
      try {
        wrapper?.releasePointerCapture(event.pointerId);
      } catch {}

      if (didDrag) return;

      if (activeItemRef.current) {
        const selected = activeItemRef.current.userData.item;
        const selectedIdx = activeItemRef.current.userData.imageIndex;
        closeActive();
        if (onItemSelect && selected) {
          onItemSelect(selected, selectedIdx);
        }
        return;
      }

      const mesh = hitTest(event);
      if (mesh) {
        const worldX = mesh.position.x;
        targetProgress += worldX / itemDistance;
        if (isOff) {
          targetProgress = THREE.MathUtils.clamp(targetProgress, 0, maxProgress);
        }
        activeItemRef.current = mesh;
        setIsOpen(true);
        setActiveItem(mesh.userData.item);
        if (onItemSelect && mesh.userData.item) {
          onItemSelect(mesh.userData.item, mesh.userData.imageIndex);
        }
      }
    }

    function handlePointerLeave() {
      isDragging = false;
      hoveredMesh = null;
      setHoveredItem(null);
      if (wrapper) {
        wrapper.style.cursor = activeItemRef.current ? 'pointer' : 'grab';
      }
    }

    function handleWheel(event: WheelEvent) {
      if (!cfgMotion.wheel || activeItemRef.current) return;
      event.preventDefault();
      const wheelDelta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      const movement = wheelDelta * 0.0048 * cfgMotion.wheelSpeed;
      targetProgress += movement;
      if (movement > 0) scrollDirection = 1;
      if (movement < 0) scrollDirection = -1;
      if (isOff) {
        targetProgress = THREE.MathUtils.clamp(targetProgress, 0, maxProgress);
      }
      userInteractingUntil = window.performance.now() + 1400;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeActive();
    }

    function handleVisibilityChange() {
      tabVisible = document.visibilityState === 'visible';
    }

    updateViewport();
    animate();

    const resizeObserver = new ResizeObserver(updateViewport);
    resizeObserver.observe(wrapper);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? true;
      },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(wrapper);

    wrapper.style.cursor = 'grab';
    wrapper.addEventListener('pointerdown', handlePointerDown);
    wrapper.addEventListener('pointermove', handlePointerMove);
    wrapper.addEventListener('pointerup', handlePointerUp);
    wrapper.addEventListener('pointerleave', handlePointerLeave);
    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      wrapper.removeEventListener('pointerdown', handlePointerDown);
      wrapper.removeEventListener('pointermove', handlePointerMove);
      wrapper.removeEventListener('pointerup', handlePointerUp);
      wrapper.removeEventListener('pointerleave', handlePointerLeave);
      wrapper.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      textureCache.forEach((texture) => texture.dispose());
      fallbackTexture.dispose();
      meshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.ShaderMaterial).dispose();
      });
      renderer.dispose();
    };
  }, [
    items,
    imageUrls,
    cfgLayout,
    cfgMotion,
    cfgEffects,
    onItemSelect,
    closeActive,
  ]);

  const radiusPx = `${cfgLayout.radius}px`;

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        minWidth: 320,
        minHeight: 280,
        position: 'relative',
        overflow: 'hidden',
        background,
        borderRadius: radiusPx,
        clipPath: `inset(0 round ${radiusPx})`,
        WebkitClipPath: `inset(0 round ${radiusPx})`,
        isolation: 'isolate',
        userSelect: 'none',
        touchAction: 'none',
        contain: 'layout paint',
        transform: 'translateZ(0)',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          borderRadius: radiusPx,
        }}
      />

      {/* Subtle Vignette Overlay */}
      {cfgEffects.vignette && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: radiusPx,
            background: `radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, ${cfgEffects.vignetteOpacity}) 100%)`,
          }}
        />
      )}

      {/* Side Edge Fade for cinematic infinite marquee effect */}
      {cfgEffects.edgeFade && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: radiusPx,
            background: `linear-gradient(90deg, rgba(0,0,0,${cfgEffects.edgeFadeOpacity}) 0%, transparent 16%, transparent 84%, rgba(0,0,0,${cfgEffects.edgeFadeOpacity}) 100%)`,
          }}
        />
      )}

      {/* Active Item Title & Category Overlay on Hover */}
      {(hoveredItem || activeItem) && !isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(10, 10, 14, 0.72)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '8px 20px',
            borderRadius: '999px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
            transition: 'opacity 0.25s ease',
          }}
        >
          <div
            style={{
              fontFamily: '"Geist Mono", monospace',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.55)',
            }}
          >
            {(hoveredItem || activeItem)?.number} // {(hoveredItem || activeItem)?.category}
          </div>
          <div
            style={{
              fontFamily: '"Geist", sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            {(hoveredItem || activeItem)?.title}
          </div>
        </div>
      )}

      {/* Expanded Close Hint */}
      {isOpen && cfgClose.showHint && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 24,
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            borderRadius: 999,
            color: cfgClose.textColor,
            background: cfgClose.background,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            fontFamily: '"Geist Mono", monospace',
            fontSize: '12px',
            letterSpacing: '0.04em',
          }}
        >
          {cfgClose.hintText}
        </div>
      )}
    </div>
  );
};

export default PrismFlowGallery;
