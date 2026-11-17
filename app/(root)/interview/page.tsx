import { redirect } from "next/navigation";

import InterviewForm from "@/components/InterviewForm";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="flex items-center justify-center w-full py-4 sm:py-8 min-h-[calc(100vh-160px)]">
      <InterviewForm userId={user.id} />
    </div>
  );
};

export default Page;
