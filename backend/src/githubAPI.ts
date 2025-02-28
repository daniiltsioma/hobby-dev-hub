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

    public async createRepo(options: {
        name: string;
        makePrivate?: boolean;
        description?: string;
    }) {
        if (!this.isAuthenticated()) {
            return null;
        }
        const response = await this.octokit.request("POST /user/repos", {
            name: options.name,
            private: options.makePrivate,
            description: options.description,
        });
        if (response.status === 201) {
            const repoData = response.data;

            return repoData;
        } else {
            return null;
        }
    }

    public async inviteCollaborator(repoName: string, invitee: string) {
        const userResponse = await this.getUser();
        if (!userResponse) {
            return null;
        }
        const username = userResponse.login;
        const response = await this.octokit.request(
            `PUT /repos/${username}/${repoName}/collaborators/${invitee}`,
            {
                owner: username,
                repo: repoName,
                username: invitee,
            }
        );
        return response.data;
    }

    public async removeCollaborator(
        repoName: string,
        collaborator: string
    ): Promise<boolean> {
        const userResponse = await this.getUser();
        if (!userResponse) {
            return false;
        }
        const username = userResponse.login;
        const response = await this.octokit.request(
            `DELETE /repos/${username}/${repoName}/collaborators/${collaborator}`,
            {
                owner: username,
                repo: repoName,
                username: collaborator,
            }
        );
        return response.status === 204;
    }

    public async deleteInvitationtoCollaborate(
        repoName: string,
        invitee: string
    ): Promise<boolean> {
        const userResponse = await this.getUser();
        if (!userResponse) {
            return false;
        }
        const username = userResponse.login;
        const invitationsResponse = await this.octokit.request(
            `GET /repos/${username}/${repoName}/invitations/`,
            {
                owner: username,
                repo: repoName,
            }
        );
        const invitations = invitationsResponse.data;
        const invitationId = invitations.find(
            (invitation: any) => invitation.invitee.login === invitee
        ).id;
        const deletionResponse = await this.octokit.request(
            `DELETE /repos/${username}/${repoName}/invitations/${invitationId}`,
            {
                owner: username,
                repo: repoName,
                invitation_id: invitationId,
            }
        );

        return deletionResponse.status === 204;
    }

    public async createIssue(options: {
        repoName: string;
        title: string;
        body?: string;
    }) {
        const { repoName, title, body } = options;
        const userResponse = await this.getUser();
        if (!userResponse) {
            return null;
        }
        const username = userResponse.login;
        const response = await this.octokit.request(
            `POST /repos/${username}/${repoName}/issues`,
            {
                title,
                body,
            }
        );
        return response.data;
    }

    public async getRepoIssues(repoName: string) {
        const userResponse = await this.getUser();
        if (!userResponse) {
            return null;
        }
        const username = userResponse.login;
        const response = await this.octokit.request(
            `GET /repos/${username}/${repoName}/issues`
        );
        return response.data;
    }

    public async updateIssue(
        repoName: string,
        issueId: string,
        payload: object
    ) {
        const userResponse = await this.getUser();
        if (!userResponse) {
            return null;
        }
        const username = userResponse.login;
        const response = await this.octokit.request(
            `PATCH /repos/${username}/${repoName}/issues/${issueId}`,
            {
                owner: username,
                repo: repoName,
                issue_number: issueId,
                ...payload,
            }
        );
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
