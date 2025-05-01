import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// app/layout.tsx에서 아래처럼 고쳐줘
import Navbar from "@/components/Navbar"
import { createIndexes } from '@/lib/db'
import { Providers } from './providers'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "포냥이",
  description: "검은사막 전적 검색 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 앱 시작 시 인덱스 생성
  if (typeof window === 'undefined') {
    createIndexes().catch(console.error)
  }

  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
