import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // For loading state

    useEffect(() => {
        // Fetch session on page load to check if the user is logged in
        axios
            .get("/auth/session", { withCredentials: true })
            .then((res) => setUser(res.data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false)); // Stop loading once done
    }, []);

    const login = async (credentials) => {
        try {
            await axios.post("/auth/login", credentials, { withCredentials: true });
            const userData = await axios.get("/auth/session", { withCredentials: true });
            setUser(userData.data.user);
        } catch (error) {
            alert("Login failed. Please check your credentials.");
        }
    };

    const register = async (userData) => {
        try {
            await axios.post("/auth/register", userData, { withCredentials: true });
            alert("Registration successful!");
        } catch (error) {
            alert("Registration failed. Please try again.");
        }
    };

    const logout = async () => {
        try {
            await axios.post("/auth/logout", {}, { withCredentials: true });
            setUser(null);
        } catch (error) {
            alert("Logout failed.");
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
