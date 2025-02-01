import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getUser } from "./lib/dal";

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
                    <div className="flex items-center justify-between px-8 py-4">
                        <div className="text-2xl font-bold">Hobby Dev Hub</div>
                        <div>
                            {user ? (
                                <div className="flex items-center">
                                    Welcome, {user.data.login}
                                    <a
                                        href="/api/logout"
                                        className="border hover:bg-red-100 border-red-600 text-red-600 py-1 px-4 rounded-md ml-4"
                                    >
                                        Logout
                                    </a>
                                </div>
                            ) : (
                                <a
                                    href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_APP_CLIENT_ID}`}
                                    className="bg-green-600 hover:bg-green-700  text-white py-2 px-4 rounded-md"
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
