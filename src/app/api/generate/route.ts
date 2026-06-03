import { NextResponse } from "next/server";
import { z } from "zod";
import { generateWithPipeline } from "@/lib/generation";

const schema = z.object({
  prompt: z.string().min(3).max(500),
  width: z.number().min(5).max(500).optional(),
  height: z.number().min(5).max(500).optional(),
  depth: z.number().min(5).max(500).optional(),
  style: z.string().optional(),
  material: z.string().optional(),
  detailLevel: z.enum(["low", "medium", "high"]).optional(),
  intendedUse: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const params = schema.parse(body);

    const result = await generateWithPipeline(params);

    return NextResponse.json({
      model: result.model,
      printability: result.printability,
      meshAnalysis: result.meshAnalysis,
      repairs: result.repairs,
      pipeline: result.pipeline,
      stlExportAllowed: result.printability.stlExportAllowed,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid generation parameters", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Model generation failed" },
      { status: 500 }
    );
  }
}
