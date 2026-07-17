import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";

export const metadata: Metadata = {
  title: "Gemini",
  description: "Google Gemini AI assistant",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[#000000] text-white antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
