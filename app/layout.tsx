import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { DynamicContextProvider } from "@/components/providers/dynamic-provider";

const roboto = Roboto({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rayls KYC Platform",
  description: "KYC verification platform using Reclaim Protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-sans`}>
        <DynamicContextProvider>{children}</DynamicContextProvider>
      </body>
    </html>
  );
}

