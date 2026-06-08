import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { StoreProvider } from "../redux/StoreProvider";
import { AuthHydrator } from "../redux/AuthHydrator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Project & Task Collaboration System",
  description: "A premium, full-stack workflow system for projects, tasks, activities, and workload analytics.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <StoreProvider>
          <AuthHydrator>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </AuthHydrator>
        </StoreProvider>
      </body>
    </html>
  );
}
