import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { getFirebaseAdmin } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();
  console.log("generate: start", { type, role, level, techstack, amount, userid });

  try {
    const { db } = await getFirebaseAdmin();
    console.log("generate: firebase ready");

    const { text } = await generateText({
   model: google("gemini-2.5-flash"),
      abortSignal: AbortSignal.timeout(30000),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
    `,
    });
    console.log("generate: gemini done", text);

    // markdown fence hata ke sirf JSON array nikal
    const cleaned = text.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(cleaned);

    const interview = {
      role,
      type,
      level,
      techstack: String(techstack)
        .split(",")
        .map((t: string) => t.trim()),
      questions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);
    console.log("generate: saved");

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("generate error:", error);
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}