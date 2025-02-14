import express from "express";
import "dotenv/config";
import Auth from "./auth";
import cors from "cors";
import GithubAPI from "./githubAPI";
import connectToDatabase from "./mongo/dbConnection";
import projects from "./mongo/projects";
import User from "./mongo/models/Users";
import bodyParser from "body-parser";

const port = process.env.PORT || 8000;
const frontendUrl = process.env.FRONTEND_HOST_URL || "/";

const app = express();

app.use(cors());

const jsonParser = bodyParser.json();

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

app.get("/dummy-db", (req, res) => {
    res.json(projects);
});

app.post("/dummy-db", jsonParser, (req, res) => {
    const data = req.body;

    const project = {
        id: projects.length + 1,
        ...data,
    };

    projects.push(project);

    res.json(project);
});

app.get("/dummy-db/:id", async (req, res) => {
    const id = Number(req.params.id);
    const project = projects.find((proj) => proj.id === id);
    res.json(project);
});

app.get("/projects", async (req, res) => {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            res.status(400).send("User ID is required");
        }

        const user = await User.findOne({ userId })
            .populate("activeProjects")
            .populate("archivedProjects");

        if (!user) {
            res.status(404).send("User not found");
        } else {
            res.json({
                activeProjects: user.activeProjects,
                archivedProjects: user.archivedProjects,
            });
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
});

app.get("/projects/:id", (req, res) => {
    const id = Number(req.params.id);
    const project = projects.find((proj) => proj.id === id);

    res.send(project);
});

app.post("/projects/:id", async (req, res) => {
    const projectId = Number(req.params.id);
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
        res.status(404).send("Project not found");
        return;
    }

    // not sure about this block of code

    // const { cookie } = await request.json();
    // const cookieStore = await cookies();
    // cookieStore.set({
    //     name: "accessToken",
    //     value: cookie.value,
    //     expires: new Date(Date.now() + Number(cookie.expires_in)),
    //     httpOnly: true,
    //     path: "/",
    // });

    const applicant = await github.getUser();

    if (!applicant || !applicant.data.login) {
        res.status(401).send("User not authenticated");
    }

    if (project.applicants.includes(applicant.data.login)) {
        res.status(400).send("Already applied");
    }

    if (!project.applicants.includes(applicant.data.login)) {
        project.applicants.push(applicant.data.login);
    }
    res.status(200).json(project);
});

app.get("/user/:id/projects", async (req, res) => {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            res.status(400).send("User ID is required");
        }

        const user = await User.findOne({ userId })
            .populate("activeProjects")
            .populate("archivedProjects");

        if (!user) {
            res.status(404).send("User not found");
        } else {
            res.json({
                activeProjects: user.activeProjects,
                archivedProjects: user.archivedProjects,
            });
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
