import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./routes/Home";
import Project from "./routes/Project";
import NewProject from "./routes/NewProject";
import MyProjects from "./routes/MyProjects";
import Sidebar from "./components/sidebar/sidebar";
import { useState } from "react";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex relative min-h-screen">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-60" : "ml-0"
        }`}
      >
        <Header
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/new" element={<NewProject />} />
          <Route path="/projects/:id" element={<Project />} />
          <Route path="/my-projects" element={<MyProjects />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
