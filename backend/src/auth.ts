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

    public async generateGithubTokensAndData(
        githubCode: string
    ): Promise<object> {
        const queryParams = new URLSearchParams({
            code: githubCode,
            client_id: this.GITHUB_APP_CLIENT_ID,
            client_secret: this.GITHUB_APP_CLIENT_SECRET,
        });

        const tokenDataString = await fetch(
            `${this.GITHUB_LOGIN_API_URL}?${queryParams.toString()}`
        ).then((res) => res.text());

        const tokenData: any = {};

        tokenDataString.split("&").map((pair) => {
            const [key, value] = pair.split("=");
            tokenData[key] = value;
        });

        return tokenData;
    }
}
