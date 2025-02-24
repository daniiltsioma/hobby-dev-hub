import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./routes/Home";
import Project from "./routes/Project";
import NewProject from "./routes/NewProject";
import ActiveProjects from "./routes/ActiveProjects";
import Sidebar from "./components/sidebar/sidebar";

function App() {
  return (
    <div className="flex relative min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/new" element={<NewProject />} />
          <Route path="/projects/:id" element={<Project />} />
          <Route path="/projects/active" element={<ActiveProjects />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
