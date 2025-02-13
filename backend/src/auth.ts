interface GithubTokensPayload {
    accessToken: string;
    accessTokenExpires: Date;
    refreshToken: string;
    refreshTokenExpires: Date;
}

export default class Auth {
    private GITHUB_LOGIN_API_URL: string;
    private GITHUB_APP_CLIENT_ID: string;
    private GITHUB_APP_CLIENT_SECRET: string;

    public constructor() {
        this.GITHUB_LOGIN_API_URL =
            "https://github.com/login/oauth/access_token";

        if (
            !process.env.GITHUB_APP_CLIENT_ID ||
            !process.env.GITHUB_APP_CLIENT_SECRET
        ) {
            throw new Error("No GitHub credentials provided.");
        }

        this.GITHUB_APP_CLIENT_ID = process.env.GITHUB_APP_CLIENT_ID;
        this.GITHUB_APP_CLIENT_SECRET = process.env.GITHUB_APP_CLIENT_SECRET;
    }

    public async generateGithubTokens(githubCode: string): Promise<string> {
        const queryParams = new URLSearchParams({
            code: githubCode,
            client_id: this.GITHUB_APP_CLIENT_ID,
            client_secret: this.GITHUB_APP_CLIENT_SECRET,
        });

        const tokenData = await fetch(
            `${this.GITHUB_LOGIN_API_URL}?${queryParams.toString()}`
        ).then((res) => res.text());

        return tokenData;
    }
}
