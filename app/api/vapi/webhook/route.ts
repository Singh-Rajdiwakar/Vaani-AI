import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

import { getFirebaseAdmin } from "@/firebase/admin";

export const dynamic = "force-dynamic";

const appointmentSchema = z.object({
  name: z.string().nullable(),
  birthDate: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  appointmentDate: z.string().nullable(),
});

function getTranscript(body: unknown): string {
  if (!body || typeof body !== "object") return "";

  const payload = body as {
    message?: {
      artifact?: { transcript?: unknown };
      transcript?: unknown;
    };
    artifact?: { transcript?: unknown };
  };
  const transcript =
    payload.message?.artifact?.transcript ??
    payload.message?.transcript ??
    payload.artifact?.transcript;

  if (typeof transcript === "string") return transcript;
  if (!Array.isArray(transcript)) return "";

  return transcript
    .map((entry) => {
      if (!entry || typeof entry !== "object") return "";
      const item = entry as { role?: unknown; content?: unknown; transcript?: unknown };
      const content = item.content ?? item.transcript;
      return typeof content === "string"
        ? `${typeof item.role === "string" ? item.role : "unknown"}: ${content}`
        : "";
    })
    .filter(Boolean)
    .join("\n");
}

export async function POST(request: Request) {
  const expectedSecret = process.env.VAPI_WEBHOOK_SECRET;
  const receivedSecret = request.headers.get("x-vapi-secret");

  if (expectedSecret && receivedSecret !== expectedSecret) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: unknown = await request.json();
    const message = body && typeof body === "object" ? (body as { message?: { type?: string } }).message : undefined;

    if (message?.type !== "end-of-call-report") {
      return Response.json({ success: true, ignored: true });
    }

    const transcript = getTranscript(body);
    if (!transcript) {
      return Response.json({ success: false, error: "Call transcript is missing" }, { status: 400 });
    }

    const { object: appointment } = await generateObject({
      model: google("gemini-2.0-flash-001", { structuredOutputs: false }),
      schema: appointmentSchema,
      prompt: `Extract appointment details from this call transcript.
Return null for any detail that was not provided. Preserve dates and phone numbers as spoken.

Transcript:
${transcript}`,
    });

    const call = body && typeof body === "object"
      ? (body as { message?: { call?: { id?: string; metadata?: Record<string, unknown> } } }).message?.call
      : undefined;
    const metadata = call?.metadata ?? {};
    const { db } = await getFirebaseAdmin();

    const appointmentRecord = {
      ...appointment,
      callId: call?.id ?? null,
      userId: typeof metadata.userId === "string" ? metadata.userId : null,
      interviewId: typeof metadata.interviewId === "string" ? metadata.interviewId : null,
      createdAt: new Date().toISOString(),
    };

    const reference = await db.collection("appointments").add(appointmentRecord);
    return Response.json({ success: true, appointmentId: reference.id });
  } catch (error) {
    console.error("Error saving Vapi appointment:", error);
    return Response.json(
      { success: false, error: "Unable to save appointment details" },
      { status: 500 }
    );
  }
}
