import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./routes/Home";
import Project from "./routes/Project";
import NewProject from "./routes/NewProject";
import MyProjects from "./routes/MyProjects";

function App() {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects/new" element={<NewProject />} />
                <Route path="/projects/:id" element={<Project />} />
                <Route path="/my-projects" element={<MyProjects />} />
            </Routes>
        </div>
    );
}

export default App;
