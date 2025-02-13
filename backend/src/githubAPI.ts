import { Octokit } from "@octokit/core";
import { Endpoints } from "@octokit/types";

export default class GithubAPI {
    private clientId: string;
    private clientSecret: string;
    private octokit: any;

    public constructor() {
        if (
            !process.env.GITHUB_APP_CLIENT_ID ||
            !process.env.GITHUB_APP_CLIENT_SECRET
        ) {
            throw new Error("No GitHub credentials provided.");
        }

        this.clientId = process.env.GITHUB_APP_CLIENT_ID;
        this.clientSecret = process.env.GITHUB_APP_CLIENT_SECRET;
    }

    public authenticate(accessToken: string): void {
        this.octokit = new Octokit({
            auth: accessToken,
        });
    }

    public logout() {
        this.octokit = null;
    }

    public async getUser(): Promise<Endpoints["GET /user"]["response"]> {
        if (!this.octokit) {
            throw new Error("Not authenticated");
        }
        const response = await this.octokit.request("GET /user");
        const user = response.data;

        return user;
    }
}
