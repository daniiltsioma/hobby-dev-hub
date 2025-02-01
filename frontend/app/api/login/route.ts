import { NextRequest } from "next/server";

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

    return new Response(
        `Successfully authenticated with code ${githubCode}. Github response ${responseText}`,
        {
            status: 200,
        }
    );
}
