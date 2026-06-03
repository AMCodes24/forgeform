import * as THREE from "three";
import type { GeneratedModelData, ModelPrimitive } from "@/types";

function geometryForType(type: ModelPrimitive["type"]): THREE.BufferGeometry {
  switch (type) {
    case "sphere":
      return new THREE.SphereGeometry(0.5, 32, 32);
    case "cylinder":
      return new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    case "cone":
      return new THREE.ConeGeometry(0.5, 1, 32);
    case "torus":
      return new THREE.TorusGeometry(0.5, 0.2, 16, 48);
    default:
      return new THREE.BoxGeometry(1, 1, 1);
  }
}

function meshFromPrimitive(primitive: ModelPrimitive): THREE.Mesh {
  const geometry = geometryForType(primitive.type);
  const material = new THREE.MeshStandardMaterial({
    color: primitive.color,
    metalness: primitive.metalness ?? 0.25,
    roughness: primitive.roughness ?? 0.55,
  });

  const mesh = new THREE.Mesh(geometry, material);
  const [px, py, pz] = primitive.position;
  const [rx, ry, rz] = primitive.rotation;
  const [sx, sy, sz] = primitive.scale;

  mesh.position.set(px, py, pz);
  mesh.rotation.set(rx, ry, rz);
  mesh.scale.set(sx, sy, sz);
  mesh.updateMatrix();

  return mesh;
}

export function buildGroupFromModel(model: GeneratedModelData): THREE.Group {
  const group = new THREE.Group();
  group.name = model.name;

  for (const primitive of model.primitives) {
    group.add(meshFromPrimitive(primitive));
  }

  return group;
}
