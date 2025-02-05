"use server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";

const GITHUB_APP_CLIENT_ID = process.env.GITHUB_APP_CLIENT_ID || "";
const GITHUB_APP_CLIENT_SECRET = process.env.GITHUB_APP_CLIENT_SECRET || "";

export async function logout() {
    const cookieStore = await cookies();

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
}

export async function generateGitHubTokensFromCode(githubCode: string) {
    const githubAPIUrl = "https://github.com/login/oauth/access_token";

    if (!GITHUB_APP_CLIENT_ID || !GITHUB_APP_CLIENT_SECRET) {
        throw new Error("Github authentication credentials not set.");
    }

    const githubTokenQueryParams = new URLSearchParams({
        client_id: GITHUB_APP_CLIENT_ID,
        client_secret: GITHUB_APP_CLIENT_SECRET,
        code: githubCode,
    });

    const response = await fetch(
        `${githubAPIUrl}?${githubTokenQueryParams.toString()}`
    );

    const responseText = await response.text();

    const tokenData: any = {};

    responseText.split("&").map((str) => {
        const [key, value] = str.split("=");
        tokenData[key] = value;
    });

    return tokenData;
}

interface AuthCookieProps {
    name: string;
    value: string;
    expiresIn: number;
}

export async function setAuthCookie(
    cookieStore: ReadonlyRequestCookies,
    { name, value, expiresIn }: AuthCookieProps
) {
    cookieStore.set({
        name,
        value,
        expires: new Date(Date.now() + expiresIn),
        httpOnly: true,
        path: "/",
    });
}
