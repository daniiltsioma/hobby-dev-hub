import express from "express";

const testApp = express();

const mockProjects = [
  { id: 1, title: "Project 1", technologies: ["React", "Node.js"] },
  { id: 2, title: "Project 2", technologies: ["Vue", "Express"] },
  { id: 3, title: "Project 3", technologies: ["React", "MongoDB"] },
];

testApp.get("/dummy-db-search", (req, res) => {
  let filteredProjects = mockProjects;

  const search = typeof req.query.search === "string" ? req.query.search.toLowerCase() : "";
  const tags = typeof req.query.tags === "string" ? req.query.tags.split(",") : [];

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

export default testApp;