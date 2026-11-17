import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import LandingPage from "@/components/LandingPage";

export default async function Home() {
  // If user is logged in, send to dashboard
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return <LandingPage />;
}
