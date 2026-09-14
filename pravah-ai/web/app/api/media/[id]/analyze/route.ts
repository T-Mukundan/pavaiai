import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { AIClient } from '@/lib/ai-client';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const mediaId = params.id;
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
      include: { grievance: true },
    });

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    const visionResult = await AIClient.analyzeVisual(
      media.fileUrl,
      media.grievance?.category || ''
    );

    const analysis = await prisma.mediaAnalysis.upsert({
      where: { mediaId: media.id },
      update: {
        detectedObjects: JSON.stringify(visionResult.detected_objects),
        severity: visionResult.severity,
        description: visionResult.description,
        confidence: visionResult.confidence,
        model: visionResult.model,
      },
      create: {
        mediaId: media.id,
        detectedObjects: JSON.stringify(visionResult.detected_objects),
        severity: visionResult.severity,
        description: visionResult.description,
        confidence: visionResult.confidence,
        model: visionResult.model,
      },
    });

    return NextResponse.json({
      success: true,
      analysis,
      assessment: visionResult,
    });
  } catch (error: any) {
    console.error('Error analyzing media:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
