export const dynamic = 'force-dynamic'
export const revalidate = 0

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
  title: "BDOPonyang",
  description: "BDOPonyang",
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
          <main className="min-h-screen pb-24">
            {children}
          </main>
          <footer className="bg-zinc-900 border-t border-zinc-800 py-3 px-4 text-center text-xs text-zinc-400">
            <div className="flex flex-col items-center gap-1">
              <div className="flex flex-wrap justify-center gap-2 text-[13px] text-zinc-300">
                <a href="/site-info" className="hover:underline">사이트 소개</a>
                <span>|</span>
                <a href="/agreement" className="hover:underline">사이트 이용약관</a>
                <span>|</span>
                <a href="/privacy" className="hover:underline">개인정보처리방침</a>
                <span>|</span>
                <a href="#" className="hover:underline">오류/건의</a>
                <span>|</span>
                <a href="/support" className="hover:underline">광고/후원문의</a>
              </div>
              <div className="text-[12px] mt-1">© 2025. BDOPonyang All rights reserved.</div>
              <div className="text-[12px] text-zinc-500">This site is not associated with Pearl Abyss.</div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
