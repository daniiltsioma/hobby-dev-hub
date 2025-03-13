import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Project } from "../components/projects/ProjectCard";
import { getUser } from "../lib/user";

export default function MyProjects() {
  const [username, setUsername] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "owned",
    "applied",
    "collaborating",
    "archived",
  ]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const user = await getUser();
        setUsername(user ? user.login : null);

        const response = await fetch(
          //`${import.meta.env.VITE_EXPRESS_URL}/dummy-db`
          `${import.meta.env.VITE_EXPRESS_URL}/projects`
        );
        const data = await response.json();
        setProjects(data.projects);
      } catch (err) {
        console.error(err);
        setError("Error fetching projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filterProjects = (
    status: "owned" | "applied" | "collaborating" | "archived"
  ) => {
    if (!username) return [];

    switch (status) {
      case "owned":
        return projects.filter(
          (project) => project.owner === username && !project.isArchived
        );
      case "collaborating":
        return projects.filter(
          (project) =>
            !project.isArchived &&
            project.collaborators?.includes(username) && // Check if the user is a collaborator
            project.owner !== username // Exclude if the user is the owner
        );
      case "applied":
        return projects.filter(
          (project) =>
            !project.isArchived &&
            project.applicants?.includes(username) && // Check if the user is an applicant
            !project.collaborators?.includes(username) && // Exclude if they are a collaborator
            project.owner !== username // Exclude if the user is the owner
        );
      case "archived":
        return projects.filter(
          (project) =>
            project.isArchived &&
            (project.owner === username ||
              project.applicants?.includes(username) ||
              project.collaborators?.includes(username))
        );
      default:
        return [];
    }
  };

  const toggleExpand = (category: string) => {
    setExpandedSections(
      (prev) =>
        prev.includes(category)
          ? prev.filter((item) => item !== category) // If it's already expanded, close it
          : [...prev, category] // Otherwise, open it
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!username) {
    return (
      <div className="flex justify-center pt-20">
        <p className="text-xl font-bold">
          You must be logged in to access your projects.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">My Projects</h1>

      <div className="border border-[#3d444d] rounded-lg">
        {/* Owned */}
        <div>
          <button
            onClick={() => toggleExpand("owned")}
            className="text-xl font-bold w-full text-left bg-[#18222c] hover:bg-[#1e2b37] border-b border-[#3d444d] rounded-t-lg p-4"
          >
            Owned
          </button>
          {expandedSections.includes("owned") && (
            <div className="">
              {filterProjects("owned").length === 0 ? (
                <p className="text-[#9198a1] border-b border-[#3d444d] p-4">
                  You don't own any projects yet.
                </p>
              ) : (
                filterProjects("owned").map((project) => (
                  <div
                    key={project._id}
                    className="border-b border-[#3d444d] p-4 flex"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold hover:opacity-80 mb-1">
                        <Link to={`/projects/${project._id}`}>
                          {project.title}
                        </Link>
                      </h3>
                      <p className="text-[#9198a1]">{project.description}</p>
                    </div>

                    <div className="ml-4">
                      {/* Status Pill */}
                      <span className="text-xs bg-[#2f3742] rounded-full py-1 px-2">
                        Owner
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Applied */}
        <div>
          <button
            onClick={() => toggleExpand("applied")}
            className="text-xl font-bold w-full text-left bg-[#18222c] hover:bg-[#1e2b37] border-b border-[#3d444d] p-4"
          >
            Applied
          </button>
          {expandedSections.includes("applied") && (
            <div className="">
              {filterProjects("applied").length === 0 ? (
                <p className="text-[#9198a1] border-b border-[#3d444d] p-4">
                  You haven't applied to any projects yet.
                </p>
              ) : (
                filterProjects("applied").map((project) => (
                  <div
                    key={project._id}
                    className="border-b border-[#3d444d] p-4 flex"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold hover:opacity-80 mb-1">
                        <Link to={`/projects/${project._id}`}>
                          {project.title}
                        </Link>
                      </h3>
                      <p className="text-[#9198a1]">{project.description}</p>
                    </div>

                    <div className="ml-4">
                      {/* Status Pill */}
                      <span className="text-xs bg-[#2f3742] rounded-full py-1 px-2">
                        Applicant
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Collaborating */}
        <div>
          <button
            onClick={() => toggleExpand("collaborating")}
            className={`text-xl font-bold w-full text-left bg-[#18222c] hover:bg-[#1e2b37] border-b border-[#3d444d] p-4`}
          >
            Collaborating
          </button>
          {expandedSections.includes("collaborating") && (
            <div className="">
              {filterProjects("collaborating").length === 0 ? (
                <p className="text-[#9198a1] border-b border-[#3d444d] p-4">
                  You're not collaborating on any projects yet.
                </p>
              ) : (
                filterProjects("collaborating").map((project) => (
                  <div
                    key={project._id}
                    className="border-b border-[#3d444d] p-4 flex"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold hover:opacity-80 mb-1">
                        <Link to={`/projects/${project._id}`}>
                          {project.title}
                        </Link>
                      </h3>
                      <p className="text-[#9198a1]">{project.description}</p>
                    </div>

                    <div className="ml-4">
                      {/* Status Pill */}
                      <span className="text-xs bg-[#2f3742] rounded-full py-1 px-2">
                        Collaborator
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Archived */}
        <div>
          <button
            onClick={() => toggleExpand("archived")}
            className={`text-xl font-bold w-full text-left bg-[#18222c] hover:bg-[#1e2b37] p-4 ${
              expandedSections.includes("archived")
                ? "rounded-none" // Not rounded when expanded
                : "rounded-b-lg" // Otherwise, apply rounded bottom
            }`}
          >
            Archived
          </button>
          {expandedSections.includes("archived") && (
            <div className="">
              {filterProjects("archived").length === 0 ? (
                <p className="text-[#9198a1] border-t border-[#3d444d] p-4">
                  You don't have any archived projects yet.
                </p>
              ) : (
                filterProjects("archived").map((project) => (
                  <div
                    key={project._id}
                    className="border-t border-[#3d444d] p-4 flex"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold hover:opacity-80 mb-1">
                        <Link to={`/projects/${project._id}`}>
                          {project.title}
                        </Link>
                      </h3>
                      <p className="text-[#9198a1]">{project.description}</p>
                    </div>

                    <div className="ml-4">
                      {/* Status Pill */}
                      <span className="text-xs bg-[#2f3742] rounded-full py-1 px-2">
                        {project.owner === username
                          ? "Owner"
                          : project.collaborators?.includes(username)
                          ? "Collaborator"
                          : project.applicants?.includes(username)
                          ? "Applicant"
                          : ""}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
