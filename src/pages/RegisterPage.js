import React, { useState } from 'react'
import './RegisterPage.css';
import { RegisterApi } from '../services/api';
import { storeUserData } from '../services/Storage';
import { Link ,Navigate} from 'react-router-dom';
import { isAuthenticated } from '../services/Auth'
import {toast} from 'react-toastify';

const RegisterPage = () => {
    const initialStateErrors = {
        email: { required: false },
        password: { required: false },
        name: { required: false },
        custom_error: null
    }

    const [errors, setErrors] = useState(initialStateErrors)
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name:""
    })

    const handleInput = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
        console.log(inputs)
    }

    const handleSubmit = (e) => {
        console.log(inputs)

        e.preventDefault();
        let errors = initialStateErrors;
        let hasError = false;

        if (inputs.name == "") {
            errors.name.required = true;
            hasError = true;
        }

        if (inputs.email == "") {
            errors.email.required = true;
            hasError = true;
        }

        if (inputs.password == "") {
            errors.password.required = true;
            hasError = true;
        }

        if (!hasError) {

            //sending regiter api request
            RegisterApi(inputs)
                .then((response) => {
                    storeUserData(response.data.idToken);
                    console.log(response)
                })
                .catch((err) => {
                    if (err.response.data.error.message == "EMAIL_EXISTS") {
                        setErrors({ ...errors, custom_error: "Already this email has been registered" })
                    }
                    else if (String(err.response.data.error.message).includes('WEAK_PASSWORD')) {
                        setErrors({ ...errors, custom_error: "Password should be atleast 6 charecters" })
                    }
                    console.log(err)
                })
            // .finally(()=>{
            //     setLoading(false)
            // })
        }
        setErrors({ ...errors })
        console.log(errors)
        toast.success("User added succesfully!")
        

    }

     if(isAuthenticated()){
        //redierct user to dashboard

        return <Navigate to="/dashboard"/>
     }


    return (
        <div className="container">
            <div className="login-container ">
                <h4 className="mb-4 text-center text-uppercase">Register</h4>

                <form id="loginForm" onSubmit={handleSubmit} action="" >
                    <div className="mb-3">
                        <div className="form-group ">

                            <label htmlFor="name" className="form-label h6 ">Name</label>
                            <div className="input-group">
                                <span className="input-group-text" id="basic-addon1"><i className="fa fa-user" aria-hidden="true"></i></span>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    id="name"
                                    placeholder="Enter Name"
                                    aria-describedby="basic-addon1"
                                    onChange={handleInput}
                                />
                            </div>
                             {
                                errors.name.required ?
                                    (<span className="text-danger" >
                                        Name is required.
                                    </span>) : null
                            }
                        </div>

                        <div className="form-group ">

                            <label htmlFor="email" className="form-label h6 ">Email</label>
                            <div className="input-group">
                                <span className="input-group-text" id="basic-addon1"><i className="fa fa-envelope" aria-hidden="true"></i></span>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Enter email"
                                    aria-describedby="basic-addon1"
                                    onChange={handleInput}
                                />
                            </div>
                            {
                                errors.email.required ?
                                    (<span className="text-danger" >
                                        Email is required.
                                    </span>) : null
                            }
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="form-group">
                            <label htmlFor="password" className="form-label h6">Password</label>
                            <div className="input-group">
                                <span className="input-group-text" id="basic-addon1"><i className="fa fa-key" aria-hidden="true"></i></span>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="Enter password"
                                    onChange={handleInput}
                                />
                            </div>
                            {
                                errors.password.required ? (<span className="text-danger" >
                                    Password is required.
                                </span>) : null
                            }
                        </div>

                    </div>

                    <span className="text-danger" >
                        {errors.custom_error ?
                            (<p>{errors.custom_error}</p>)
                            : null
                        }
                    </span>

                    <input type="submit" className="btn btn-primary w-100 mb-3 mt-2"  value="Register"/>

                    <div className="form-group text-center">
                        Already have account ? Please <Link to="/login">Login</Link>
                    </div>

                </form>
            </div>
        </div>

    )
}

export default RegisterPage