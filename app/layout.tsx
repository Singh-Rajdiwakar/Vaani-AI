import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VaaniAI — AI Interview Practice",
  description: "An AI-powered voice interview platform for real-time mock interviews with smart feedback",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}

        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "#0F0F1A",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#F1F5F9",
            },
          }}
        />
      </body>
    </html>
  );
}
