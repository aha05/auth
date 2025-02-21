import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ width: '20rem' }}>
                <h1 className="text-center mb-4">Welcome, {user?.name}</h1>
                <button className="btn btn-danger w-100" onClick={logout}>
                    Logout
                </button>
            </div>
        </div>
    );

};

export default Dashboard;
