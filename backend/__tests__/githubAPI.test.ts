import GithubAPI from "../src/githubAPI";
import { Octokit as MockOctokit } from "@octokit/core";

const githubAPI = new GithubAPI();

jest.mock("@octokit/core", () => {
    return {
        Octokit: jest.fn().mockImplementation(({ auth }) => {
            if (auth === "invalidToken") {
                throw new Error("Failed to authorize");
            }
            return {
                request: (route: string, parameters: any) => {
                    if (route === "GET /user") {
                        // get authenticated user
                        return {
                            status: 200,
                            data: {
                                id: 123,
                                login: "johndoe",
                            },
                        };
                    }
                    if (route === "POST /user/posts") {
                        // create a repository
                        if (parameters.name === "Existing repo") {
                            return {
                                status: 400,
                            };
                        }
                        return {
                            status: 201,
                            data: {
                                id: 123456,
                                name: parameters.name,
                            },
                        };
                    }
                    if (
                        route ===
                        "PUT /repos/johndoe/validRepoName/collaborators/validCollaborator"
                    ) {
                        return {
                            status: 201,
                            data: {
                                repository: "validRepoName",
                                invitee: {
                                    login: "validCollaborator",
                                },
                            },
                        };
                    }
                    if (route === "POST /repos/johndoe/validRepoName/issues") {
                        return {
                            status: 201,
                            data: {
                                repoName: "validRepoName",
                                id: 15,
                                title: "New issue",
                                body: "Description of the new issue",
                            },
                        };
                    }
                },
            };
        }),
    };
});

describe("GitHub API client", () => {
    test("should return false when trying to authenticate with invalid token", () => {
        expect(githubAPI.authenticate("invalidToken", MockOctokit)).toBe(false);
        expect(githubAPI.isAuthenticated()).toBe(false);
    });
    test("should return null when trying to get user while not authenticated", async () => {
        expect(await githubAPI.getUser()).toBe(null);
    });
    test("should return true when trying to authorize with valid token", () => {
        expect(githubAPI.authenticate("validToken", MockOctokit)).toBe(true);
        expect(githubAPI.isAuthenticated()).toBe(true);
        githubAPI.logout();
    });
    test("should return user data when trying to get user while authenticated", async () => {
        githubAPI.authenticate("validToken", MockOctokit);
        expect(githubAPI.isAuthenticated()).toBe(true);
        expect(await githubAPI.getUser()).toEqual({
            id: 123,
            login: "johndoe",
        });
        githubAPI.logout();
    });
    test("should return repo name and id when created successfully", async () => {
        githubAPI.authenticate("validToken", MockOctokit);
        expect(githubAPI.isAuthenticated()).toBe(true);
        expect(await githubAPI.createRepo({ name: "New repo" })).toEqual({
            id: 123456,
            name: "New repo",
        });
        githubAPI.logout();
    });
    test("should return null when the repository already created", async () => {
        githubAPI.authenticate("validToken", MockOctokit);
        expect(githubAPI.isAuthenticated()).toBe(true);
        expect(await githubAPI.createRepo({ name: "Existing repo" })).toEqual(
            null
        );
        githubAPI.logout();
    });
    test("should return repository name and collaborator username when successfully added collaborator", async () => {
        githubAPI.authenticate("validToken", MockOctokit);
        expect(githubAPI.isAuthenticated()).toBe(true);
        expect(
            await githubAPI.addCollaborator(
                "validRepoName",
                "validCollaborator"
            )
        ).toEqual({
            repository: "validRepoName",
            invitee: {
                login: "validCollaborator",
            },
        });
        githubAPI.logout();
    });
    // create issue
    test("should return repo name, issue id, name and description when successfully created an issue", async () => {
        githubAPI.authenticate("validToken", MockOctokit);
        expect(githubAPI.isAuthenticated()).toBe(true);
        expect(
            await githubAPI.createIssue({
                repoName: "validRepoName",
                title: "New issue",
                body: "Description of the new issue",
            })
        ).toEqual({
            repoName: "validRepoName",
            id: 15,
            title: "New issue",
            body: "Description of the new issue",
        });
        githubAPI.logout();
    });
});
