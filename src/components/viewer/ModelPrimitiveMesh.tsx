"use client";

import type { ModelPrimitive } from "@/types";

export function ModelPrimitiveMesh({ primitive }: { primitive: ModelPrimitive }) {
  const [sx, sy, sz] = primitive.scale;
  const [px, py, pz] = primitive.position;
  const [rx, ry, rz] = primitive.rotation;

  const materialProps = {
    color: primitive.color,
    metalness: primitive.metalness ?? 0.25,
    roughness: primitive.roughness ?? 0.55,
  };

  const meshProps = {
    position: [px, py, pz] as [number, number, number],
    rotation: [rx, ry, rz] as [number, number, number],
    castShadow: true,
    receiveShadow: true,
  };

  switch (primitive.type) {
    case "sphere":
      return (
        <mesh {...meshProps} scale={[sx, sy, sz]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      );
    case "cylinder":
      return (
        <mesh {...meshProps} scale={[sx, sy, sz]}>
          <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      );
    case "cone":
      return (
        <mesh {...meshProps} scale={[sx, sy, sz]}>
          <coneGeometry args={[0.5, 1, 32]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      );
    case "torus":
      return (
        <mesh {...meshProps} scale={[sx, sy, sz]}>
          <torusGeometry args={[0.5, 0.2, 16, 48]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      );
    default:
      return (
        <mesh {...meshProps} scale={[sx, sy, sz]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      );
  }
}
