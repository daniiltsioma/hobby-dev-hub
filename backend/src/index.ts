import express from "express";
import "dotenv/config";
import Auth from "./auth";
import cors from "cors";
import GithubAPI from "./githubAPI";
import connectToDatabase from "./mongo/dbConnection";

const port = process.env.PORT || 8000;
const frontendUrl = process.env.FRONTEND_HOST_URL || "/";

const app = express();

app.use(cors());

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
        maxAge: Number(tokenData.expires_in) * 1000,
        httpOnly: true,
    });

    res.cookie("refreshToken", tokenData.refresh_token, {
        maxAge: Number(tokenData.refresh_token_expires_in) * 1000,
        httpOnly: true,
    });

    res.redirect(frontendUrl);
});

app.get("/user", async (req, res) => {
    try {
        const user = await github.getUser();
        res.send(user);
    } catch (err) {
        res.send("Not authorized");
    }
});

app.get("/logout", (req, res) => {
    res.clearCookie("accessToken", { path: "/", httpOnly: true });
    res.clearCookie("refreshToken", { path: "/" });
    github.logout();
    res.redirect(frontendUrl);
});

app.get("/test-db", async (req, res) => {
    try {
        await connectToDatabase();
        res.status(200).send("Connected to MongoDB!");
    } catch (err) {
        res.status(400).send("Error connecting to MongoDB");
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
