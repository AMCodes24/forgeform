"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import type { GeneratedModelData } from "@/types";
import { ModelScene } from "./ModelScene";
import { RotateCcw, ZoomIn } from "lucide-react";

export function ModelViewer({ model }: { model: GeneratedModelData | null }) {
  if (!model) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-500">
        <div className="rounded-2xl border border-dashed border-border p-8">
          <RotateCcw className="h-12 w-12 opacity-40" />
        </div>
        <p className="text-sm">Generate a model to preview</p>
        <p className="text-xs text-zinc-600">Rotate · Pan · Zoom after generation</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-4 top-4 z-10 flex gap-2">
        <span className="rounded-lg bg-black/50 px-2 py-1 text-xs text-zinc-400 backdrop-blur">
          Drag to rotate
        </span>
        <span className="hidden rounded-lg bg-black/50 px-2 py-1 text-xs text-zinc-400 backdrop-blur sm:inline">
          Scroll to zoom
        </span>
      </div>
      <div className="absolute bottom-4 right-4 z-10 rounded-lg bg-black/50 p-2 backdrop-blur">
        <ZoomIn className="h-4 w-4 text-zinc-400" />
      </div>
      <Canvas
        shadows
        camera={{ position: [3, 2, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="!bg-transparent"
      >
        <color attach="background" args={["#0a0a0b"]} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-3, 4, -2]} intensity={0.4} />
        <pointLight position={[0, 3, 0]} intensity={0.3} color="#f97316" />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ModelScene model={model} />
          <ContactShadows
            position={[0, -0.8, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={2}
          />
        </Suspense>
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={1.5}
          maxDistance={12}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
