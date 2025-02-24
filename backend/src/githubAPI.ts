import { Octokit } from "@octokit/core";
import { Endpoints } from "@octokit/types";
import { permission } from "process";

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

    public async createRepo(options: {
        name: string;
        makePrivate?: boolean;
        description?: string;
    }) {
        if (!this.isAuthenticated()) {
            return null;
        }
        const response = await this.octokit.request(
            "POST /user/posts",
            options
        );
        if (response.status === 201) {
            const repoData = response.data;

            return repoData;
        } else {
            return null;
        }
    }

    public async addCollaborator(repoName: string, collaborator: string) {
        const userResponse = await this.getUser();
        if (!userResponse) {
            return null;
        }
        const username = userResponse.login;
        console.log(
            `PUT /repos/${username}/${repoName}/collaborators/${collaborator}`
        );
        const response = await this.octokit.request(
            `PUT /repos/${username}/${repoName}/collaborators/${collaborator}`,
            {
                owner: username,
                repo: repoName,
                username: collaborator,
                permission: "triage",
            }
        );
        console.log(response);
        return response.data;
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
