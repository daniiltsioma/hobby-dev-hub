import GithubAPI from "../src/githubAPI";
import { Octokit as MockOctokit } from "@octokit/core";

const githubAPI = new GithubAPI();

jest.mock("@octokit/core", () => {
    return {
        Octokit: jest.fn().mockImplementation(({ auth }) => {
            if (auth === "invalidToken") {
                throw new Error("Failed to authorize");
            }
        }),
    };
});

describe("GitHub API client", () => {
    test("should return false when attemptimg to authenticate with invalid token", () => {
        expect(githubAPI.authenticate("invalidToken", MockOctokit)).toBe(false);
    });
    test("should return true when attempting to authorize with valid token", () => {
        expect(githubAPI.authenticate("validToken", MockOctokit)).toBe(true);
    });
});
