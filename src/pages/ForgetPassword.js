
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from '../services/api';
import { db } from '../firebase';

const ForgetPassword = () => {
    const [errors, setErrors] = useState({ email: { required: false, message: '' } });
    const [inputs, setInputs] = useState({ email: "" });
    const [message, setMessage] = useState("");
    const [alertClass, setAlertClass] = useState("alert alert-success");

    const navigate = useNavigate();

    const messageShow = () => {
       message == "Check your Gmail for the reset link." ? 
            setAlertClass("alert alert-success"):
            setAlertClass("alert alert-danger");
        
    };

    useEffect(() => {
        if (message) {
            messageShow(); 
        }
    }, [message]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        // Email Validation (if empty)
        if (inputs.email.trim() === "") {
            setErrors({
                ...errors,
                email: { required: true, message: 'Email is required.' }
            });
            return; 
        }

        // setErrors({
        //     ...errors,
        //     email: { required: false, message: '' } // Reset error message
        // });

        try {
            const emailToCheck = inputs.email.trim();

            // Step 1: Check Firestore for the email
            const Ref = collection(db, "users");
            const q = query(Ref, where("email", "==", emailToCheck));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setMessage("This email is not registered. Please enter a registered email and try again.");
                setTimeout(() => {
                    setMessage("");  
                    setInputs({ email: "" });  
                }, 7000);
                return;
            }

            // Step 2: Send password reset email
            await sendPasswordResetEmail(inputs);

            setMessage("Check your Gmail for the reset link.");
            console.log("Password reset email sent.");
            setTimeout(() => {
                navigate("/login");  // Navigate to login after 8 seconds
            }, 8000);

        } catch (err) {
            const errorMessage = err.response?.data?.error?.message;

            if (errorMessage === "INVALID_EMAIL") {
                alert("Invalid email format.");
            } else {
                alert("Something went wrong: " + errorMessage);
            }

            console.error("Password reset error:", err);
        }
    };

    // Email validation on blur
    const validateEmail = (email) => {
        const trimmedEmail = email.trim().replace(/\s+/g, '');
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
        if (trimmedEmail === '') {
            setErrors({
                ...errors,
                email: { required: true, message: 'Email is required.' }
            });
        } else if (!emailRegex.test(trimmedEmail)) {
            setErrors({
                ...errors,
                email: { required: true, message: 'Please enter a valid Email ID' }
            });
        } else {
            setErrors({
                ...errors,
                email: { required: false, message: '' }
            });
        }
    };

    return (
        <div className="container">
            <div className="login-container">
                <h4 className="mb-4 text-center text-uppercase">Reset Your Password</h4>
                <p className="text-center">We will send you an email to reset your password</p>

                <form id="loginForm" onSubmit={handleEmailSubmit} action="">
                    <div className="mb-3">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label h6">Email</label>
                            <div className="input-group">
                                <span className="input-group-text" id="basic-addon1"><i className="fa fa-envelope" aria-hidden="true"></i></span>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Enter email"
                                    aria-describedby="basic-addon1"
                                    value={inputs.email}
                                    onChange={e => setInputs(pre => ({ ...pre, email: e.target.value }))}
                                    onBlur={e => { validateEmail(e.target.value) }}
                                />
                            </div>
                            {
                                errors.email.required ? (
                                    <span className="text-danger">
                                        {errors.email.message || 'Email is required.'}
                                    </span>
                                ) : null
                            }
                        </div>
                    </div>

                    <span className="text-danger">
                        {errors.custom_error ? (<p>{errors.custom_error}</p>) : null}
                    </span>

                    <button type="submit" className="btn btn-primary w-100 mb-3 mt-2">Send Link to Email</button>
                </form>

                {message && (
                    <div className={alertClass} role="alert">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgetPassword;

