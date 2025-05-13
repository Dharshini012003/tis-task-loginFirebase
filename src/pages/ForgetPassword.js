import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from '../services/api';
// import { auth } from "../firebase";
// import { sendPasswordResetEmail } from "firebase/auth";

const ForgetPassword = () => {
    const [errors, setErrors] = useState({ email: { required: false, message: '' } })
    const [inputs, setInputs] = useState({
        email: ""
    })
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleEmailSubmit = (e) => {
        e.preventDefault()
        sendPasswordResetEmail(inputs)


            .then((response) => {
                setMessage("Check your Gmail for the reset link.");
                console.log(response)
                setTimeout(() => { navigate("/login"); }, 8000);

            })



            .catch(err => {
                const errorMessage = err.response?.data?.error?.message;

                if (errorMessage === "EMAIL_NOT_FOUND") {
                    alert("Email not found. Please check and try again.");
                } else if (errorMessage === "INVALID_EMAIL") {
                    alert("Invalid email format.");
                } else {
                    alert("Something went wrong: " + errorMessage);
                }


            });


    }

    return (
        <div className="container">
            <div className="login-container ">
                <h4 className="mb-4 text-center text-uppercase">Reset Your Password</h4>
                <p className="text-center">We will send you an email to reset your password</p>

                <form id="loginForm" onSubmit={handleEmailSubmit} action="" >
                    <div className="mb-3">
                        <div className="form-group">

                            <label htmlFor="email" className="form-label h6 " >Email</label>
                            <div className="input-group">
                                <span className="input-group-text" id="basic-addon1"><i className="fa fa-envelope" aria-hidden="true"></i></span>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Enter email"
                                    aria-describedby="basic-addon1"
                                    onChange={e => setInputs(pre => ({ ...pre, email: e.target.value }))}
                                // onBlur={e => { validateEmail(e.target.value) }}
                                />
                            </div>
                            {
                                errors.email.required ? (
                                    <span className="text-danger">
                                        {/* {errors.email.message || 'Email is required.'} */}
                                        Email is required.
                                    </span>
                                ) : null
                            }

                        </div>
                    </div>



                    <span className="text-danger" >
                        {errors.custom_error ?
                            (<p>{errors.custom_error}</p>)
                            : null
                        }
                    </span>

                    <button type="submit" className="btn btn-primary w-100 mb-3 mt-2" >Send Link to Email</button>





                </form>

                {message && (
                    <div className="alert alert-success" role="alert">
                        {message}
                    </div>
                )}
            </div>
        </div>

    )


}

export default ForgetPassword
