import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/login.jsx";
import Home from "./Pages/Home.jsx";
import Chat from "./Pages/chat.jsx";
import { useSelector } from "react-redux";
import { Children, useEffect, useState, } from "react";
import { SpinnerLoading } from "./components/loading.jsx"
import axiosInstance from "./lib/axiosInstance.js";
import { toast } from "react-toastify";

function AppRoutes() {

    const ProtectedRoutes = ({ children }) => {
        const navigate = useNavigate()
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const [loading, setLoading] = useState(false)
        useEffect(() => {
            const checkAuth = async () => {
                try {
                    setLoading(true)
                    const res = await axiosInstance.get("/auth/checkAuth");
                    // console.log('res', res)
                    if (res.status == 200) {
                        setLoading(false)
                        setIsAuthenticated(true)
                    }
                    else {
                        throw Error('Error sending request..')
                    }
                } catch (error) {
                    setLoading(false)
                    setIsAuthenticated(false)
                    toast.error('Error validating token')
                    navigate('/')
                }
            };
            checkAuth();
        }, [])

        // console.log(loading, isAuthenticated)
        if (isAuthenticated)
            return <>{children}</>
        else
            if (loading) return <div className=" h-screen"><SpinnerLoading /></div>
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/chat" element={
                    <ProtectedRoutes><Chat /></ProtectedRoutes>} />

            </Routes>
        </Router>
    );
}

export default AppRoutes;