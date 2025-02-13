import { cookies } from "next/headers";
import { Octokit } from "octokit";

export async function getUser() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");
    if (!accessToken) {
        return null;
    }

    try {
        const octokit = new Octokit({
            auth: accessToken.value,
        });

        const user = await octokit.request("GET /user", {
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });
        return user;
    } catch {
        return null;
    }
}
