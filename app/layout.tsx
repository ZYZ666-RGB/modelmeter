import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ModelMeter — AI API Cost Calculator",
  description: "Estimate and compare monthly text-generation API costs across OpenAI, Anthropic, and Google models.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
