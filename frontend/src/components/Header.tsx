import { useEffect, useState } from "react";
import { getUser } from "../lib/user";
import { Link } from "react-router-dom";
//import ProjectSearch from "./ProjectSearch"

interface HeaderProps {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
}

export default function Header({
  setIsSidebarOpen,
  isSidebarOpen,
}: HeaderProps) {
  const [username, setUsername] = useState();

  useEffect(() => {
    async function fetchUsername() {
      const user = await getUser();
      setUsername(user ? user.login : null);
    }

    fetchUsername();
  }, [[]]);
  return (
    <div className="flex items-center justify-between bg-[#010409] border-b border-[#3d444d] px-8 py-4">
      <div className="flex items-center">
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="z-50 bg-[#0d1117] text-white border border-[#3d444d] rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <span style={{ fontSize: "20px" }}>☰</span>
            Menu
          </button>
        )}
        <div className="text-2xl font-bold px-6">Hobby Dev Hub</div>
        {username && (
          <Link
            to="/projects/new"
            className="bg-blue-600 hover:bg-blue-700 rounded-md ml-4 py-1 px-4"
          >
            Post a Project
          </Link>
        )}
      </div>

      {/*<ProjectSearch/>*/}
      <div>
        {username ? (
          <div className="flex items-center">
            Welcome, {username}
            <a
              href={`${import.meta.env.VITE_EXPRESS_URL}/logout`}
              className="border hover:bg-red-100 border-red-600 text-red-600 py-1 px-4 rounded-md ml-4 cursor-pointer"
            >
              Logout
            </a>
          </div>
        ) : (
          <a
            href={`https://github.com/login/oauth/authorize?client_id=${
              import.meta.env.VITE_GITHUB_APP_CLIENT_ID
            }`}
            className="bg-green-600 hover:bg-green-700 rounded-md py-2 px-4"
          >
            Login with Github
          </a>
        )}
      </div>
    </div>
  );
}
