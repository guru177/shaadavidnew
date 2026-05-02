"use client";

import React, { useRef, useEffect, useState, Component, ErrorInfo, ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";

// WebGL Error Boundary to catch context creation errors
class WebGLErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("WebGL is not supported or failed to initialize:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <>{this.props.fallback}</>;
    }
    return <>{this.props.children}</>;
  }
}

// Simple check for WebGL support
const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
};

const Model = () => {
  const { scene } = useGLTF("/drago.glb");
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} scale={1.5} />
      </Center>
    </group>
  );
};

export default function Globe3D() {
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setMounted(true);
    setWebglSupported(isWebGLAvailable());
  }, []);

  if (!mounted) return null;

  // Fallback UI if WebGL is not supported or fails
  const fallback = (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      {/* 
        This tries to load an animated GIF fallback first. 
        It will look like the real 3D model with baked-in rotation.
      */}
      <img
        src="/book.webp"
        alt="Interactive 3D Book Fallback"
        className="w-[80%] h-[80%] object-contain"
        style={{ animation: 'float 4s ease-in-out infinite' }}
        onError={(e) => {
          // If the book-fallback.gif doesn't exist yet, hide the image and show the dashed border UI
          e.currentTarget.style.display = 'none';
          if (e.currentTarget.nextElementSibling) {
            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
          }
        }}
      />

      {/* Hidden by default, shows up if book-fallback.gif is missing */}
      <div className="hidden w-full h-full flex-col items-center justify-center bg-transparent border border-dashed border-[#395c80]/30 rounded-full text-[#395c80]">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 mb-3">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
        <span className="text-sm font-medium opacity-60">Interactive 3D Book</span>
        <span className="text-[10px] opacity-40 mt-1 max-w-[80%] text-center leading-tight">Add "book-fallback.gif" to public folder</span>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );

  if (!webglSupported) {
    return fallback;
  }

  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <WebGLErrorBoundary fallback={fallback}>
        <Canvas
          camera={{ position: [0, 1, 5], fov: 45 }}
          // Limit dpr to 1-2 to prevent performance issues and crashes on high-res mobile devices
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
            failIfMajorPerformanceCaveat: false
          }}
        >
          {/* Soft studio lighting for the 3D model */}
          <ambientLight intensity={1} />
          <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
          <directionalLight position={[-5, 5, -5]} intensity={1.5} color="#cbe3f7" />

          {/* Environment map provides beautiful reflections on glossy parts of the book */}
          <Environment preset="city" />

          <Bounds fit observe margin={1.2}>
            <Model />
          </Bounds>

          <OrbitControls
            makeDefault
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.8}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            // Make rotation responsive to touch on all devices
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN
            }}
          />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}

// Preload the model to avoid pop-in
useGLTF.preload("/drago.glb");
