"use client";

import { Center } from "@react-three/drei";
import type { GeneratedModelData } from "@/types";
import { ModelPrimitiveMesh } from "./ModelPrimitiveMesh";

export function ModelScene({ model }: { model: GeneratedModelData }) {
  return (
    <Center>
      <group>
        {model.primitives.map((primitive, i) => (
          <ModelPrimitiveMesh key={i} primitive={primitive} />
        ))}
      </group>
    </Center>
  );
}
