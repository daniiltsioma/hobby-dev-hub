import express from "express";
import "dotenv/config";
import Auth from "./auth";
import GithubAPI from "./githubAPI";

const port = process.env.PORT || 8000;
const frontendUrl = process.env.FRONTEND_HOST_URL || "/";

const app = express();

const github = new GithubAPI();
const auth = new Auth();

app.get("/api/login/", async (req, res) => {
    const githubCode = req.query.code as string;

    if (!githubCode) {
        res.status(401).send("No Github App code provided.");
    }

    const tokenData: any = await auth.generateGithubTokensAndData(githubCode);

    github.authenticate(tokenData.access_token);

    res.cookie("accessToken", tokenData.access_token, {
        expires: new Date(Date.now() + Number(tokenData.expires_in)),
        httpOnly: true,
    });

    res.cookie("refreshToken", tokenData.refresh_token, {
        expires: new Date(
            Date.now() + Number(tokenData.refresh_token_expires_in)
        ),
        httpOnly: true,
    });

    res.redirect(frontendUrl);
});

app.get("/user", async (req, res) => {
    const user = await github.getUser();
    res.send(user);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
