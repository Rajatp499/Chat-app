import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/login.jsx";
import Home from "./Pages/Home.jsx";
import Chat from "./Pages/chat.jsx";
import { useSelector } from "react-redux";

function AppRoutes() {


    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/chat"  element={<Chat />} />

            </Routes>
        </Router>
    );
}

export default AppRoutes;