"use client";

import React, {
  useRef,
  useEffect,
  useState,
  Component,
  ErrorInfo,
  ReactNode,
  Suspense,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";

class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("WebGL failed to initialize:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) return <>{this.props.fallback}</>;
    return <>{this.props.children}</>;
  }
}

function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

const Model = () => {
  const { scene } = useGLTF("/drago.glb");
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
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

function BookFallback() {
  const [src, setSrc] = useState("/book.webp");

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Shaa David book"
        className="w-[85%] h-[85%] object-contain"
        style={{ animation: "bookFallbackFloat 4s ease-in-out infinite" }}
        onError={() => {
          if (src !== "/product.webp") setSrc("/product.webp");
        }}
      />
      <style>{`
        @keyframes bookFallbackFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

type Globe3DProps = {
  className?: string;
};

export default function Globe3D({ className = "" }: Globe3DProps) {
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setMounted(true);
    setWebglSupported(isWebGLAvailable());
  }, []);

  if (!mounted) {
    return <div className={`w-full h-full min-h-[200px] ${className}`} />;
  }

  if (!webglSupported) {
    return (
      <div className={`w-full h-full min-h-[200px] ${className}`}>
        <BookFallback />
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full min-h-[200px] cursor-grab active:cursor-grabbing ${className}`}
      style={{ touchAction: "none" }}
    >
      <WebGLErrorBoundary fallback={<BookFallback />}>
        <Canvas
          camera={{ position: [0, 1, 5], fov: 45 }}
          dpr={[1, 1.75]}
          style={{ width: "100%", height: "100%", display: "block" }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
            failIfMajorPerformanceCaveat: false,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
          <directionalLight position={[-5, 5, -5]} intensity={1.5} color="#cbe3f7" />
          <Environment preset="city" />
          <Suspense fallback={null}>
            <Bounds fit observe margin={1.15}>
              <Model />
            </Bounds>
          </Suspense>
          <OrbitControls
            makeDefault
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.8}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }}
          />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}

useGLTF.preload("/drago.glb");
