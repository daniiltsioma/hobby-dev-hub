import express from "express";
import "dotenv/config";
import Auth from "./auth";

const port = process.env.PORT || 8000;
const frontendUrl = process.env.FRONTEND_HOST_URL || "/";

const app = express();

app.get("/api/login/", async (req, res) => {
    const auth = new Auth();
    const githubCode = req.query.code as string;

    if (!githubCode) {
        res.status(401).send("No Github App code provided.");
    }

    const tokenData: any = await auth.generateGithubTokensAndData(githubCode);

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

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
