import { getUser } from "../lib/user";
import { useEffect, useState } from "react";

export default function ActiveProjects() {
  const [username, setUsername] = useState();
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsername() {
      const user = await getUser();

      if (!user || !user.login || user === null) {
        console.error("Error: Username not found.");
        setError("User not found");
        return;
      }
      setUsername(user.login);
      fetchProjects(user.login);
    }

    fetchUsername();
  }, []);

  async function fetchProjects(githubId: string) {
    try {
      const response = await fetch(
        //`${import.meta.env.VITE_EXPRESS_URL}/myProjects?githubId=${githubId}`

        // TODO: JUST FOR TESTING PURPOSES
        // USE THE IMPORT.META FOR PRODUCTION
        "http://localhost:8000/myProjects?githubId=" + githubId
      );
      if (!response.ok) {
        throw new Error("Error fetching projects.");
      }
      const data = await response.json();
      setActiveProjects(data.activeProjects);
    } catch (error) {
      console.error(error);
      setError("Error: could not load projects.");
    }
  }

  if (error) {
    return (
      <div className="flex justify-center items-start h-screen pt-20">
        <div className="text-xl font-bold text-center">{error}</div>
      </div>
    );
  }

  if (!username) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="mt-4 text-3xl font-semibold text-center">
        {username}'s Active Projects
      </h1>
      <ul>
        {activeProjects.length > 0 ? (
          activeProjects.map((project, index) => (
            <li key={index} className="border p-2 mt-2">
              {project.name}
            </li>
          ))
        ) : (
          <p className="text-2xl font-semibold text-center mt-20">
            No active projects found...
          </p>
        )}
      </ul>
    </div>
  );
}
