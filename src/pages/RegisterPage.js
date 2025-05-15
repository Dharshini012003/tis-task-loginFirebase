import React, { useState } from 'react'
import './RegisterPage.css';
import { RegisterApi } from '../services/api';
import { storeUserData } from '../services/Storage';
import { Link, useNavigate } from 'react-router-dom';
// import { isAuthenticated } from '../services/Auth'
import { toast } from 'react-toastify';
// import { validateEmail } from '../validations/FieldValidation';

const RegisterPage = () => {
    const navigate = useNavigate()

    const [type, setType] = useState("password");
    const [icon, setIcon] = useState("fa-solid fa-eye-slash");

    const show = () => {
        type === "password" ? setType("text") : setType("password");
        icon === "fa-solid fa-eye"
            ? setIcon("fa-solid fa-eye-slash")
            : setIcon("fa-solid fa-eye");
    };

    const initialStateErrors = {
        email: { required: false, message: '' },
        password: { required: false },
        name: { required: false },
        custom_error: null
    }

    const [errors, setErrors] = useState(initialStateErrors)
    // const[loading,setLoading] =useState(false)
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: ""
    })

    const handleInput = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
        // if (e.target.name == "email") {

        //     let RemoveExtraSpaceEmail = e.target.value.trim().replace(/\s+/g, '');
        //     var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
        //     if (!emailRegex.test(RemoveExtraSpaceEmail)) {
        //         setErrors({
        //             ...errors,
        //             email: { required: true, message: 'Please enter a valid Email ID' }
        //         });

        //     }
        //     else {
        //         setErrors({
        //             ...errors,
        //             email: { required: false, message: '' }
        //         });
        //     }

        // }

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
                    toast.success("User added succesfully!")
                    // navigate('/dashboard')
                    setTimeout(navigate, 8000, '/dashboard')
                })
                .catch((err) => {
                    if (err.response.data.error.message == "EMAIL_EXISTS") {
                        setErrors({ ...errors, custom_error: "Already this email has been registered" })
                    }
                    else if (String(err.response.data.error.message).includes('WEAK_PASSWORD')) {
                        setErrors({ ...errors, custom_error: "Password should be atleast 6 charecters" })
                    }
                    else if (String(err.response.data.error.message).includes('INVALID_EMAIL')) {
                        setErrors({ ...errors, custom_error: "Please enter a valid Email ID" })
                    }

                    console.log(err)
                })
            // .finally(()=>{
            //     setLoading(false)
            // })
        }
        setErrors({ ...errors })
        console.log(errors)



    }

    //email validation on blur
    const validateEmail = (email) => {
        let RemoveExtraSpaceEmail = email.trim().replace(/\s+/g, '');
        var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
        if (RemoveExtraSpaceEmail == '') {
            setErrors({
                ...errors,
                email: { required: true, message: 'Email is required.' }
            });

        }
        else if (!emailRegex.test(RemoveExtraSpaceEmail)) {
            setErrors({
                ...errors,
                email: { required: true, message: 'Please enter a valid Email ID' }
            });

        }
        else {
            setErrors({
                ...errors,
                email: { required: false, message: '' }
            });
        }
    };



    // if (isAuthenticated()) {
    //     //redierct user to dashboard
    //     return <Navigate to="/dashboard" />
    // }


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

                    <div className="mb-3">
                        <div className="form-group">
                            <label htmlFor="password" className="form-label h6">Password</label>
                            <div className="input-group d-flex flex-nowrap">
                                <span className="input-group-text  d-inline-block  ">
                                    <i className="fas fa-lock" aria-hidden="true"></i>
                                </span>

                                <div className="password-box d-flex  align-items-center border rounded w-100">


                                    <input
                                        type={type}
                                        name="password"
                                        className="form-control border-0"
                                        id="password"
                                        placeholder="Enter password"
                                        onChange={handleInput}
                                    />

                                    <i onClick={show} className={`${icon} px-2`} style={{ cursor: 'pointer' }}></i>
                                </div>

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

                    <input type="submit" className="btn btn-primary w-100 mb-3 mt-2" value="Register" />

                    <div className="form-group text-center">
                        Already have account ? Please <Link to="/login">Login</Link>
                    </div>

                </form>
            </div>
        </div>

    )
}

export default RegisterPage
