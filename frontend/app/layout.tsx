import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UserHeader from "./components/header/userHeader";
import { getUser } from "./lib/dal";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div>
          <div className="flex items-center justify-between bg-[#010409] border-b border-[#3d444d] px-8 py-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold">Hobby Dev Hub</div>
              {user && (
                <Link
                  href="/projects/new"
                  className="bg-blue-600 hover:bg-blue-700 rounded-md ml-4 py-1 px-4"
                >
                  Post a Project
                </Link>
              )}
            </div>
            <div>
              {user ? (
                <UserHeader username={user.data.login} />
              ) : (
                <a
                  href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_APP_CLIENT_ID}`}
                  className="bg-green-600 hover:bg-green-700 rounded-md py-2 px-4"
                >
                  Login with Github
                </a>
              )}
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
