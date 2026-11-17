import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/actions/auth.action";
import Navbar from "@/components/Navbar";

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen flex flex-col bg-[#09090F]">
      <Navbar user={user} />

      <main className="root-layout flex-1 w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
