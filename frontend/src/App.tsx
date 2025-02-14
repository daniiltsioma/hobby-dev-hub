import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./routes/Home";

function App() {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </div>
    );
}

export default App;
