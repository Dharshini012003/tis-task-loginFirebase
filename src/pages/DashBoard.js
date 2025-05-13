import React, { useState, useEffect } from 'react';
import { changeEmail, changePassword, UserDetailsApi } from '../services/api';
import { logout } from '../services/Auth';
import { useNavigate } from 'react-router-dom';

const DashBoard = () => {
    const [user, setUser] = useState({ name: "", email: "", localId: "" });
    const [inputs, setInputs] = useState({ email: "", password: "" });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleInput = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleError = (errorMessage) => {
        if (errorMessage === "EMAIL_NOT_FOUND") {
            alert("Email not found. Please check and try again.");
        } else if (errorMessage === "INVALID_EMAIL") {
            alert("Invalid email format.");
        } else {
            alert("Something went wrong: " + errorMessage);
        }
    };

    const handleUpdate = (type) => {
        if (type === "email") {
            if (!inputs.email) return alert("Please enter a new email.");
            changeEmail(inputs)
                .then((response) => {
                    console.log(response);
                    setMessage("Email update request sent. Check your inbox.");
                })
                .catch(err => {
                    const errorMessage = err.response?.data?.error?.message;
                    handleError(errorMessage);
                });
        }

        if (type === "password") {
            if (!inputs.password) return alert("Please enter a new password.");
            changePassword(inputs)
                .then((response) => {
                    console.log(response);
                    setMessage("Password updated successfully.");
                })
                .catch(err => {
                    const errorMessage = err.response?.data?.error?.message;
                    handleError(errorMessage);
                });
        }
    };

    const logoutUser = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        UserDetailsApi()
            .then((response) => {
                setUser({
                    name: response.data.users[0].displayName,
                    email: response.data.users[0].email,
                    localId: response.data.users[0].localId,
                });
            })
            .catch((error) => {
                console.error("Error fetching user details:", error);
            });
    }, []);

    return (
        <div style={{ padding: "0", margin: "0" }}>
            <div className="bg-dark p-3 d-flex align-items-center justify-content-between">
                <h3 className="text-white">Dashboard</h3>
                <p className="text-white h5" onClick={logoutUser} style={{ cursor: "pointer" }}>
                    Logout &nbsp; <i className="fa fa-sign-out" aria-hidden="true"></i>
                </p>
            </div>

            {user.name && user.email && user.localId ? (
                <div>
                    <h1 className="fw-bold text-center mt-2">Welcome {user.name}</h1>
                    <p className="fw-bold text-center text-muted h5">
                        Here's your Firebase ID and Email you logged in with...
                    </p>

                    <table className="table table-hover" style={{ width: "50%", margin: "20px auto" }}>
                        <thead>
                            <tr>
                                <th>Firebase ID</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{user.localId}</td>
                                <td>{user.email}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Update Email and Password */}
                    <div className="container mt-5">
                        <h2 className="text-center mb-4">Update Email and Password</h2>
                        <div className="row justify-content-center">
                            <div className="col-md-6">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control mb-3"
                                    placeholder="New Email"
                                    onChange={handleInput}
                                />
                                <button
                                    className="btn btn-warning w-100 mb-3"
                                    onClick={() => handleUpdate("email")}
                                >
                                    Update Email
                                </button>

                                <input
                                    type="password"
                                    name="password"
                                    className="form-control mb-3"
                                    placeholder="New Password"
                                    onChange={handleInput}
                                />
                                <button
                                    className="btn btn-success w-100 mb-3"
                                    onClick={() => handleUpdate("password")}
                                >
                                    Update Password
                                </button>

                                {message && <div className="alert alert-info">{message}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-center mt-4">Loading user details...</p>
            )}
        </div>
    );
};

export default DashBoard;
