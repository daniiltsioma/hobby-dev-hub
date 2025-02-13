import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { generateGitHubTokensFromCode, setAuthCookie } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const githubCode = searchParams.get("code");

    if (!githubCode) {
        return new Response(`Error: no github code provided.`, {
            status: 400,
        });
    }

    const tokenData = await generateGitHubTokensFromCode(githubCode);

    const cookieStore = await cookies();

    setAuthCookie(cookieStore, {
        name: "accessToken",
        value: tokenData.access_token,
        expiresIn: Number(tokenData.expires_in),
    });

    setAuthCookie(cookieStore, {
        name: "refreshToken",
        value: tokenData.refresh_token,
        expiresIn: Number(tokenData.refresh_token_expires_in),
    });

    redirect("/", RedirectType.push);
}
