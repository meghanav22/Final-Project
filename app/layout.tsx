"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { FaHome, FaStickyNote, FaCalendarAlt, FaBook, FaRegClock } from "react-icons/fa";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Helper to check if a link is active
  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/" && pathname.startsWith(href));

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow flex items-center gap-8 px-8 py-3">
          <Link
            href="/"
            className={`flex items-center gap-2 font-bold hover:underline ${
              isActive("/") ? "text-[#a97c50] underline" : "text-[#a97c50]"
            }`}
          >
            <FaHome className="text-xl" />
            Home
          </Link>
          <Link
            href="/notes"
            className={`flex items-center gap-2 font-bold hover:underline ${
              isActive("/notes") ? "text-[#a97c50] underline" : "text-[#a97c50]"
            }`}
          >
            <FaStickyNote className="text-xl" />
            Notes
          </Link>
          <Link
            href="/calendar"
            className={`flex items-center gap-2 font-bold hover:underline ${
              isActive("/calendar") ? "text-[#a97c50] underline" : "text-[#a97c50]"
            }`}
          >
            <FaCalendarAlt className="text-xl" />
            Calendar
          </Link>
          <Link
            href="/books-journal"
            className={`flex items-center gap-2 font-bold hover:underline ${
              isActive("/books-journal") ? "text-[#a97c50] underline" : "text-[#a97c50]"
            }`}
          >
            <FaBook className="text-xl" />
            Books/Journal
          </Link>
          <Link
            href="/schedule"
            className={`flex items-center gap-2 font-bold hover:underline ${
              isActive("/schedule") ? "text-[#a97c50] underline" : "text-[#a97c50]"
            }`}
          >
            <FaRegClock className="text-xl" />
            Schedule
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
