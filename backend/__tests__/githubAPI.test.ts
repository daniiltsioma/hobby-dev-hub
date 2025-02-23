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
                sayHello: async () => {
                    return "hello";
                },
                request: (prompt: string) => {
                    if (prompt === "GET /user") {
                        return {
                            data: {
                                id: 123,
                                username: "johndoe",
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
        expect(await githubAPI.sayHello()).toEqual("hello");
        expect(await githubAPI.getUser()).toEqual({
            id: 123,
            username: "johndoe",
        });
        githubAPI.logout();
    });
});
