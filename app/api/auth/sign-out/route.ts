import { signOut } from "@/lib/actions/auth.action";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await signOut();
  return NextResponse.redirect(new URL("/", request.url));
}

export async function POST() {
  await signOut();
  return NextResponse.json({ success: true });
}
