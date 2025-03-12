import express from "express";
import "dotenv/config";
import Auth from "./auth";
import cors from "cors";
import GithubAPI from "./githubAPI";
import connectToDatabase from "./mongo/dbConnection";
import projects from "./mongo/projects";
import User from "./mongo/models/Users";
import ownerProjectRouter from "./routes/getProjectsForOwner";
import userRouter from "./routes/postNewUser";
import bodyParser from "body-parser";
import projectRouter from "./routes/postNewProject";
import applyingRouter from "./routes/apply";
import githubAPIRouter from "./routes/github";
import getProjByUserRoleRouter from "./routes/getProjByUserRole";
import getAllProjectsRouter from "./routes/getAllProjects";
import getOneProjectRouter from "./routes/getAProject";
import newCollaboratorRouter from "./routes/postNewCollaborator";
import removeCollaboratorRouter from "./routes/deleteACollaborator";
import newApplicantRouter from "./routes/postApplicant";
import removeApplicantRouter from "./routes/deleteAnApplicant";
import archiveProjectRouter from "./routes/archiveProject";
import unarchiveProjectRouter from "./routes/unarchiveProject";
import searchProjectRouter from "./routes/searchProjects";
import updateProjectRouter from "./routes/updateProject";
import deleteProjectRouter from "./routes/deleteProject";

const port = process.env.PORT || 8000;
const frontendUrl = process.env.FRONTEND_HOST_URL || "/";

const app = express();

app.use(cors());
app.use(express.json());

// const jsonParser = bodyParser.json();

const github = new GithubAPI();
const auth = new Auth();

app.get("/", (req, res) => {
  res.send("Server is running!");
});

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

app.get("/dummy-db-search", (req, res) => {
  let filteredProjects = projects;

  const search =
    typeof req.query.search === "string" ? req.query.search.toLowerCase() : "";
  const tags =
    typeof req.query.tags === "string" ? req.query.tags.split(",") : [];

  if (search) {
    filteredProjects = filteredProjects.filter((project) =>
      project.title.toLowerCase().includes(search)
    );
  }

  if (tags.length > 0) {
    filteredProjects = filteredProjects.filter((project) =>
      tags.some((tag) => project.technologies.includes(tag))
    );
  }

  res.json(filteredProjects);
});

app.post("/dummy-db", (req, res) => {
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
// Route to get all of the projects from the database
app.use(getAllProjectsRouter);

// Route to get all of the projects for a particular user
app.use(ownerProjectRouter);

// Route to get one specific project
app.use(getOneProjectRouter);

// Route to Get projects by user role
app.use(getProjByUserRoleRouter);

// Route to Post a new collaborator
app.use(newCollaboratorRouter);

// Route to remove a collaborator from a project
app.use(removeCollaboratorRouter);

// Route to post a new user into the database
app.use(userRouter);

// Route to post a new project into the database
app.use(projectRouter);

// This is the old one
//Route to post a new applicant into the database
app.use(applyingRouter);

//TODO: Keep this
//Route to post a new applicant into the database
app.use(newApplicantRouter);

// Route to delete and applicant
app.use(removeApplicantRouter);

// Route to archive a project
app.use(archiveProjectRouter);

// Route to unarchive a project
app.use(unarchiveProjectRouter);

// Route to search for projects with given parameters
app.use(searchProjectRouter);

// Route to update a project
app.use(updateProjectRouter);

// Route to delete a project
app.use(deleteProjectRouter);

app.use(githubAPIRouter);

app.get("/projects/:id", (req, res) => {
  const id = Number(req.params.id);
  const project = projects.find((proj) => proj.id === id);

  res.send(project);
});

/*app.post("/projects/:id", async (req, res) => {
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

  if (!applicant || !applicant.login) {
    res.status(401).send("User not authenticated");
    return;
  }

  if (project.applicants.includes(applicant.login)) {
    res.status(400).send("Already applied");
    return;
  }

  if (!project.applicants.includes(applicant.login)) {
    project.applicants.push(applicant.login);
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
});*/

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
