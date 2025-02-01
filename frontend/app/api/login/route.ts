import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const GITHUB_APP_CLIENT_ID = process.env.GITHUB_APP_CLIENT_ID || "";
const GITHUB_APP_CLIENT_SECRET = process.env.GITHUB_APP_CLIENT_SECRET || "";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const githubCode = searchParams.get("code");

    const githubAPIUrl = "https://github.com/login/oauth/access_token";

    if (!githubCode) {
        return new Response(`Error: no github code provided.`, {
            status: 400,
        });
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

    const cookieStore = await cookies();

    cookieStore.set({
        name: "accessToken",
        value: tokenData.access_token,
        expires: new Date(new Date() + tokenData.expires_in),
        httpOnly: true,
        path: "/",
    });

    cookieStore.set({
        name: "refreshToken",
        value: tokenData.refresh_token,
        expires: new Date(new Date() + tokenData.refresh_token_expires_in),
        httpOnly: true,
        path: "/",
    });

    return Response.json(
        {
            accessToken: cookieStore.get("accessToken"),
            refreshToken: cookieStore.get("refreshToken"),
        },
        {
            status: 200,
        }
    );
}
