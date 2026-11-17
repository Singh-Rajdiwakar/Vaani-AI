import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth.action";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/dashboard");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#09090F] p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* ── Ambient background glows ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        {/* Top-left indigo glow */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[140px]" />
        {/* Bottom-right violet glow */}
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[140px]" />
        {/* Center subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-indigo-600/5 blur-[160px]" />
        {/* Subtle dot grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(99,102,241,0.12) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="w-full max-w-5xl mx-auto z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
