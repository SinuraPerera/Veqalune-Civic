import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NODE_COUNT = 34;

export const CivicSignalScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.5, 13);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);

    const signalGroup = new THREE.Group();
    scene.add(signalGroup);

    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x34d399, wireframe: true, transparent: true, opacity: 0.35 });
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, wireframe: true, transparent: true, opacity: 0.18 });
    const nodes: Array<{ mesh: THREE.Mesh; phase: number; base: THREE.Vector3 }> = [];
    const nodePositions: THREE.Vector3[] = [];

    for (let nodeIndex = 0; nodeIndex < NODE_COUNT; nodeIndex += 1) {
      const angle = (nodeIndex / NODE_COUNT) * Math.PI * 2;
      const radius = 2.7 + (nodeIndex % 4) * 0.55;
      const base = new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle * 1.7) * 1.75,
        Math.sin(angle) * 1.7 - 0.5,
      );
      const node = new THREE.Mesh(new THREE.SphereGeometry(nodeIndex % 5 === 0 ? 0.11 : 0.065, 10, 10), nodeMaterial.clone());
      node.position.copy(base);
      signalGroup.add(node);
      nodes.push({ mesh: node, phase: nodeIndex * 0.42, base });
      nodePositions.push(base);
    }

    const linePositions: number[] = [];
    nodePositions.forEach((position, sourceIndex) => {
      const neighbors = nodePositions
        .map((candidate, candidateIndex) => ({ candidate, candidateIndex, distance: position.distanceTo(candidate) }))
        .filter(({ candidateIndex, distance }) => candidateIndex !== sourceIndex && distance < 2.9)
        .sort((first, second) => first.distance - second.distance)
        .slice(0, 2);
      neighbors.forEach(({ candidate }) => {
        linePositions.push(position.x, position.y, position.z, candidate.x, candidate.y, candidate.z);
      });
    });

    const signalGeometry = new THREE.BufferGeometry();
    signalGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const signalLines = new THREE.LineSegments(
      signalGeometry,
      new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.18 }),
    );
    signalGroup.add(signalLines);

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.45, 2), coreMaterial);
    signalGroup.add(core);

    const rings: THREE.Mesh[] = [];
    [2.15, 2.65, 3.15].forEach((ringRadius, ringIndex) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(ringRadius, 0.012, 6, 96), ringMaterial.clone());
      ring.rotation.x = Math.PI / 2 + ringIndex * 0.18;
      ring.rotation.y = ringIndex * 0.42;
      signalGroup.add(ring);
      rings.push(ring);
    });

    const hotspotGeometry = new THREE.SphereGeometry(0.24, 12, 12);
    const hotspotMaterial = new THREE.MeshBasicMaterial({ color: 0xfb7185, transparent: true, opacity: 0.85 });
    const hotspots = [
      new THREE.Vector3(-2.8, 1.45, 0.2),
      new THREE.Vector3(2.85, -0.8, -0.25),
      new THREE.Vector3(0.55, 2.15, -0.4),
    ].map((position) => {
      const hotspot = new THREE.Mesh(hotspotGeometry, hotspotMaterial.clone());
      hotspot.position.copy(position);
      signalGroup.add(hotspot);
      return hotspot;
    });

    const pointer = new THREE.Vector2();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrame = 0;
    let resizeObserver: ResizeObserver | undefined;

    const resize = () => {
      const width = canvas.clientWidth || canvas.parentElement?.clientWidth || 1;
      const height = canvas.clientHeight || canvas.parentElement?.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    };

    const animate = (time: number) => {
      const elapsed = time * 0.001;
      const movement = reducedMotion ? 0 : elapsed;
      nodes.forEach(({ mesh, phase, base }) => {
        mesh.position.y = base.y + Math.sin(movement * 0.8 + phase) * 0.08;
        mesh.position.x = base.x + Math.cos(movement * 0.55 + phase) * 0.04;
      });
      signalGroup.rotation.y = movement * 0.055 + pointer.x * 0.12;
      signalGroup.rotation.x = pointer.y * 0.06;
      core.rotation.x = movement * 0.16;
      core.rotation.y = movement * 0.22;
      rings.forEach((ring, ringIndex) => {
        ring.rotation.z = movement * (0.08 + ringIndex * 0.03);
        const scale = 1 + Math.sin(movement * 1.2 + ringIndex) * 0.025;
        ring.scale.setScalar(scale);
      });
      hotspots.forEach((hotspot, hotspotIndex) => {
        const pulse = 1 + Math.sin(movement * 1.8 + hotspotIndex) * 0.18;
        hotspot.scale.setScalar(pulse);
        const material = hotspot.material as THREE.MeshBasicMaterial;
        material.opacity = 0.62 + Math.sin(movement * 1.8 + hotspotIndex) * 0.2;
      });
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas.parentElement || canvas);
    canvas.addEventListener('pointermove', handlePointerMove);
    resize();
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      canvas.removeEventListener('pointermove', handlePointerMove);
      signalGeometry.dispose();
      signalLines.material.dispose();
      core.geometry.dispose();
      core.material.dispose();
      rings.forEach((ring) => {
        ring.geometry.dispose();
        if (Array.isArray(ring.material)) {
          ring.material.forEach((m) => m.dispose());
        } else {
          ring.material.dispose();
        }
      });
      hotspots.forEach((hotspot) => {
        hotspot.material.dispose();
      });
      hotspotGeometry.dispose();
      hotspotMaterial.dispose();
      nodeMaterial.dispose();
      ringMaterial.dispose();
      nodes.forEach((node) => {
        node.mesh.geometry.dispose();
        if (Array.isArray(node.mesh.material)) {
          node.mesh.material.forEach((m) => m.dispose());
        } else {
          node.mesh.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="civic-signal-scene" aria-hidden="true" />;
};
