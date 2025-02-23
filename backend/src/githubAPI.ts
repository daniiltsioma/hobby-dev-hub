import { Octokit } from "@octokit/core";
import { Endpoints } from "@octokit/types";

export default class GithubAPI {
    private octokit: any = null;

    public authenticate(accessToken: string, OctokitClient = Octokit): boolean {
        try {
            this.octokit = new OctokitClient({
                auth: accessToken,
            });
        } catch {
            return false;
        }
        return true;
    }

    public isAuthenticated(): boolean {
        return this.octokit !== null;
    }

    public logout() {
        this.octokit = null;
    }

    public async getUser(): Promise<
        Endpoints["GET /user"]["response"]["data"] | null
    > {
        if (!this.octokit) {
            return null;
        }
        const response = await this.octokit.request("GET /user");
        const user = response.data;

        return user;
    }
}
