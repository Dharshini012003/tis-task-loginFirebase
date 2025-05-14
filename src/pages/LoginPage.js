import React, { useState } from 'react'
import './LoginPage.css';
import { LoginApi, SendPasswordResetEmail } from '../services/api';
import { storeUserData } from '../services/Storage';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/Auth';
import { toast } from 'react-toastify';

const LoginPage = () => {
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
        custom_error: null
    }

    const [errors, setErrors] = useState(initialStateErrors)
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    })

    const handleInput = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
        console.log(inputs)
    }


const handleSubmit = (e) => {
  e.preventDefault();

  let errors = initialStateErrors;
  let hasError = false;

  if (inputs.email === "") {
    errors.email.required = true;
    hasError = true;
  }

  if (inputs.password === "") {
    errors.password.required = true;
    hasError = true;
  }

  if (!hasError) {
    LoginApi(inputs)
      .then((userCredential) => {
        const idToken = userCredential.user.accessToken;
        storeUserData(idToken);
        toast.success("You are Logged In...!");
        setTimeout(() => navigate('/dashboard'), 1000);
      })
      .catch((err) => {
        console.log(err);
        setErrors({
          ...errors,
          custom_error: "Invalid email or password"
        });
      });
  }

  setErrors({ ...errors });
};


    // const handleSubmit = (e) => {
    //     console.log(inputs)

    //     e.preventDefault();
    //     let errors = initialStateErrors;
    //     let hasError = false;

    //     if (inputs.email == "") {
    //         errors.email.required = true;
    //         hasError = true;
    //     }

    //     if (inputs.password == "") {
    //         errors.password.required = true;
    //         hasError = true;
    //     }

    //     if (!hasError) {

    //         //sending login api request
    //         LoginApi(inputs)
    //             .then((response) => {
    //                 storeUserData(response.data.idToken);
    //                 console.log(response)
    //                 toast.success("You are Logged In...!")
    //                 //  navigate('/dashboard')
    //                 setTimeout(navigate, 6000, '/dashboard')
    //             })
    //             .catch((err) => {
    //                 if (err.code == "ERR_BAD_REQUEST") {
    //                     setErrors({ ...errors, custom_error: "Invalid Credentials" })
    //                     console.log(errors)
    //                 }
    //                 console.log(err)
    //             })
    //         //   .finally(()=>{
    //         //       setLoading(false)
    //         //   })
    //     }
    //     setErrors({ ...errors })
    //     console.log(errors)

    // }


    //email validation on blur
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

    const handleForgetPassword = ()=>{
                     navigate('/forgotPassword')
                    // setTimeout(navigate, 6000, '/dashboard')
    }


    //  if(isAuthenticated()){
    //     //redierct user to dashboard
    //      return <Navigate to="/dashboard"/>
    //  }


    return (
        <div className="container">
            <div className="login-container ">
                <h4 className="mb-4 text-center text-uppercase">Login</h4>

                <form id="loginForm" onSubmit={handleSubmit} action="" >
                    <div className="mb-3">
                        <div className="form-group ">

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
                            <div className="w-100 text-end mt-1">
                                <Link to="/forgotPassword" className="small" onClick={handleForgetPassword}>Forgot Password?</Link>
                            </div>
                          
                        </div>

                    </div>

                    <span className="text-danger" >
                        {errors.custom_error ?
                            (<p>{errors.custom_error}</p>)
                            : null
                        }
                    </span>


                    <input type="submit" className="btn btn-primary w-100 mb-3 mt-2"  value="Login" />



                    <div className="form-group text-center">
                        Create new account ? Please <Link to="/">Register</Link>
                    </div>

                </form>
            </div>
        </div>

    )
}


export default LoginPage
