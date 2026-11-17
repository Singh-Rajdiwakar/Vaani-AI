import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";

const InterviewDetails = async ({ params }: RouteParams) => {
  // Logic, API calls, and Auth untouched
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  return (
    <div className="w-full flex flex-col justify-center py-2 sm:py-4">
      <Agent
        userName={user.name}
        userId={user.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        feedbackId={feedback?.id}
        role={interview.role}
        level={interview.level}
        interviewType={interview.type}
        techstack={interview.techstack}
      />
    </div>
  );
};

export default InterviewDetails;
