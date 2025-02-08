"use client";

import { logout } from "@/app/lib/auth";
import { redirect } from "next/navigation";

interface Props {
    username: string;
}

async function logoutHandler() {
    await logout();
    redirect("/");
}

export default function UserHeader({ username }: Props) {
    return (
        <div className="flex items-center">
            Welcome, {username}
            <button
                className="border hover:bg-red-100 border-red-600 text-red-600 py-1 px-4 rounded-md ml-4"
                onClick={logoutHandler}
            >
                Logout
            </button>
        </div>
    );
}
