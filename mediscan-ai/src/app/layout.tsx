import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediScan AI — Smart Medical Report Screening",
  description: "Upload reports and receive AI-powered biomarker analysis demo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090E] text-[#FAFAFA] antialiased selection:bg-primary/20 selection:text-primary overflow-x-hidden">
        {children}
        <Toaster theme="dark" position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
