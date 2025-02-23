import { Octokit } from "@octokit/core";
import { Endpoints } from "@octokit/types";

export default class GithubAPI {
    private octokit: any;

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

    public logout() {
        this.octokit = null;
    }

    public async getUser(): Promise<
        Endpoints["GET /user"]["response"]["data"]
    > {
        if (!this.octokit) {
            throw new Error("Not authenticated");
        }
        const response = await this.octokit.request("GET /user");
        const user = response.data;

        return user;
    }
}
