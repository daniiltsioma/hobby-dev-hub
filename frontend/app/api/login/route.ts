import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const githubCode = searchParams.get("code");

    if (githubCode) {
        return new Response(
            `Successfully authenticated with code ${githubCode}`,
            {
                status: 200,
            }
        );
    } else {
        return new Response(`Error: no github code provided.`, {
            status: 400,
        });
    }
}
