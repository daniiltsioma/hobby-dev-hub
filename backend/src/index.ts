import express from "express";
import "dotenv/config";
import Auth from "./auth";

const port = process.env.PORT || 8000;

const app = express();

app.get("/api/login/", async (req, res) => {
    const auth = new Auth();
    const githubCode = req.query.code as string;

    if (!githubCode) {
        res.status(401).send("No Github App code provided.");
    }

    const tokenData = await auth.generateGithubTokens(githubCode);

    res.send(tokenData);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
