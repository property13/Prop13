import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const MODEL_URL = '/apple-iphone-18-pro-max-black-2026/source/apple_iphone_18_pro_max_black.glb';
let modelRequest;

function loadModel() {
  modelRequest ??= new GLTFLoader().loadAsync(MODEL_URL).catch((error) => {
    modelRequest = undefined;
    throw error;
  });
  return modelRequest;
}

// Called from App.jsx on page load so the GLB is downloaded before the user scrolls here.
export const preloadIPhoneModel = () => loadModel().catch(() => {});

export default function IPhoneModel({ displayRef, image, onReady, ready, zoom, yaw, pitch }) {
  const hostRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      return undefined;
    }

    let disposed = false;
    let observer;
    let screenMaterial;
    let environment;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 5);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
    host.appendChild(renderer.domElement);

    const unavailable = (event) => {
      event.preventDefault();
      onReady(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', unavailable);

    loadModel().then(({ scene: source }) => {
      if (disposed) return;
      const model = source.clone(true);
      const screen = model.getObjectByName('Front_Screen');
      if (!screen?.isMesh || !screen.material?.emissive) return;

      screenMaterial = screen.material.clone();
      screen.material = screenMaterial;
      screenMaterial.emissive.set(0xffffff);
      screenMaterial.emissiveIntensity = 1;
      screenMaterial.toneMapped = false;

      const room = new RoomEnvironment();
      const pmrem = new THREE.PMREMGenerator(renderer);
      try {
        environment = pmrem.fromScene(room);
      } finally {
        pmrem.dispose();
        room.dispose();
      }
      scene.environment = environment.texture;
      scene.environmentIntensity = 1.25;
      const key = new THREE.DirectionalLight(0xfff4e4, 2.6);
      key.position.set(-1, 2, 2);
      const rim = new THREE.DirectionalLight(0xe4edff, 1.6);
      rim.position.set(2, 1, -1);
      const pivot = new THREE.Group();
      scene.add(pivot, key, rim);

      const bounds = new THREE.Box3().setFromObject(screen);
      const center = bounds.getCenter(new THREE.Vector3());
      const size = bounds.getSize(new THREE.Vector3());
      model.position.sub(center);
      pivot.add(model);
      camera.position.z = 1;

      let frame = 0;
      let bufferWidth = 0;
      let bufferHeight = 0;
      const draw = () => {
        if (disposed || renderer.getContext().isContextLost()) return;
        const display = displayRef.current;
        const width = host.clientWidth;
        const height = host.clientHeight;
        if (!display?.clientWidth || !display.clientHeight || !width || !height) return;
        // Match the mesh aperture to the existing rounded DOM display. The
        // shared parent then applies the same scroll transforms to both.
        camera.right = size.x * width / display.clientWidth / 2;
        camera.left = -camera.right;
        camera.top = size.y * height / display.clientHeight / 2;
        camera.bottom = -camera.top;
        camera.updateProjectionMatrix();
        // Allocate pixels for the CSS-transformed size, not the layout box.
        const pixelBudget = 6_000_000;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const requested = Math.ceil(Math.max(1, zoom.get()) * dpr * 4) / 4;
        const density = Math.min(requested, Math.sqrt(pixelBudget / (width * height)), 4096 / Math.max(width, height));
        const nextWidth = Math.round(width * density);
        const nextHeight = Math.round(height * density);
        if (nextWidth !== bufferWidth || nextHeight !== bufferHeight) {
          renderer.setSize(nextWidth, nextHeight, false);
          bufferWidth = nextWidth;
          bufferHeight = nextHeight;
        }
        pivot.rotation.set(-THREE.MathUtils.degToRad(pitch.get()), THREE.MathUtils.degToRad(yaw.get()), 0);
        renderer.render(scene, camera);
        onReady(true);
      };

      const requestDraw = () => {
        if (frame || disposed) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          draw();
        });
      };
      const unsubscribe = [zoom, yaw, pitch].map((value) => value.on('change', requestDraw));
      viewerRef.current = {
        draw: requestDraw,
        material: screenMaterial,
        anisotropy: renderer.capabilities.getMaxAnisotropy(),
        dispose() {
          unsubscribe.forEach((stop) => stop());
          cancelAnimationFrame(frame);
          renderer.domElement.removeEventListener('webglcontextrestored', draw);
        },
      };
      observer = new ResizeObserver(requestDraw);
      observer.observe(host);
      renderer.domElement.addEventListener('webglcontextrestored', draw);
      draw();
    }).catch(() => {
      if (!disposed) onReady(false);
    });

    return () => {
      disposed = true;
      observer?.disconnect();
      if (viewerRef.current) {
        viewerRef.current.dispose();
      }
      renderer.domElement.removeEventListener('webglcontextlost', unavailable);
      viewerRef.current = null;
      screenMaterial?.dispose();
      environment?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [displayRef, onReady, zoom, yaw, pitch]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!ready || !viewer || !image) return undefined;
    let cancelled = false;
    const originalMap = viewer.material.emissiveMap;
    const texture = new THREE.TextureLoader().load(image, (loaded) => {
      if (cancelled) return;
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.flipY = false;
      loaded.anisotropy = Math.min(viewer.anisotropy, 8);
      // Crop the image to the portrait aperture without stretching it.
      const ratio = loaded.image.width / loaded.image.height;
      const screenRatio = displayRef.current?.clientWidth / displayRef.current?.clientHeight;
      if (screenRatio > 0) {
        loaded.repeat.set(Math.min(1, screenRatio / ratio), Math.min(1, ratio / screenRatio));
        loaded.offset.set((1 - loaded.repeat.x) / 2, (1 - loaded.repeat.y) / 2);
      }
      viewer.material.emissiveMap = loaded;
      viewer.material.needsUpdate = true;
      viewer.draw();
    }, undefined, () => {});
    return () => {
      cancelled = true;
      if (viewer.material.emissiveMap === texture) viewer.material.emissiveMap = originalMap;
      texture.dispose();
    };
  }, [displayRef, image, ready]);

  return <div ref={hostRef} aria-hidden="true" style={{ position: 'absolute', inset: '-6%', pointerEvents: 'none', visibility: ready ? 'visible' : 'hidden' }} />;
}