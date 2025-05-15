
// src/pages/DashBoard.js
import React, { useState, useEffect } from 'react';
import { changeEmail, changePassword, UserDetailsApi, changeName,deleteAccount } from '../services/api';
import { logout } from '../services/Auth';
import { Link, useNavigate } from 'react-router-dom';
import UpdateModal from '../components/UpdateModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from 'react-toastify';

const DashBoard = () => {
  const [user, setUser] = useState({ name: "", email: "", localId: "" });
const [inputs, setInputs] = useState({ name: "", password: "" });

  // const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const [updateType, setUpdateType] = useState("password");

  const [type, setType] = useState("password");
  const [icon, setIcon] = useState("fa-solid fa-eye-slash");
  const navigate = useNavigate();

useEffect(() => {
  const auth = getAuth();

  const unsubscribe = onAuthStateChanged(auth, async(currentUser) => {
    if (currentUser) {
        await currentUser.reload();
      setUser({
        name: currentUser.displayName || "User",
        email: currentUser.email,
        localId: currentUser.uid,
      });
    } 
    else {
      navigate('/login');
    }
  });

  return () => unsubscribe();
}, []);


  // useEffect(() => {

  //   UserDetailsApi()
  //     .then((response) => {
  //       const data = response.data.users[0];
  //       setUser({ name: data.displayName, email: data.email, localId: data.localId });
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching user details:", error);
  //     });

  // }, []);

  const handleShow = (type) => {
    setUpdateType(type);
    setShow(true);
  };
  const handleClose = () => setShow(false);

  const showEye = () => {
    setType(type === "password" ? "text" : "password");
    setIcon(icon === "fa-solid fa-eye" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye");
  };

  const handleInput = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleError = (errorMessage) => {
    setInputs({ name: "", password: "" });
    toast.error("Error: " + errorMessage);
  };
  console.log("Current user at update:", getAuth().currentUser);

  const handleUpdate = async (type) => {
    try {
      if (type === "name") {
        if (!inputs.name) return alert("Please enter new name.");
        await changeName(inputs);
      setUser({...user, name:inputs.name})
        toast.success("Name updated successfully.");
         handleClose();
        // setTimeout(setMessage,5000,"Name updated successfully.")
      }


      if (type === "password") {
        if (!inputs.password) return alert("Please enter a new password.");
        await changePassword(inputs);
        toast.success("Password updated successfully.");
        handleClose();
      } 

       if (type === "delete") {
    await deleteAccount();
    toast.success("Account deleted successfully.");
    setTimeout(logoutUser, 8000);
    handleClose(); 
      } 

      setInputs({ name: "", password: "" });
    } catch (err) {
      handleError(err.code || err.message);
    }
  };


  const logoutUser = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: 0, margin: 0 }}>
      <div className="bg-dark p-3 d-flex align-items-center justify-content-between">
        <h3 className="text-white">Dashboard</h3>
        <p className="text-white h5" onClick={logoutUser} style={{ cursor: "pointer" }}>
          Logout &nbsp;<i className="fa fa-sign-out" aria-hidden="true"></i>
        </p>
      </div>

      {user.name && user.email && user.localId ? (
        <div>
          <h1 className="fw-bold text-center mt-2">Welcome {user.name}</h1>
          <p className="fw-bold text-center text-muted h5">
            Here's your Firebase ID and Email...
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

          <p className="fw-bold text-center text-muted h5 mt-5">
            Update your Name and Password with the below Links
          </p>
          <div className="d-flex align-items-center justify-content-center mt-4 gap-3">
            <Link onClick={() => handleShow("password")} className="text-decoration-none text-center">
              Update Password
            </Link>
            <Link onClick={() => handleShow("name")} className="text-decoration-none text-center">
              Update Name
            </Link>
            <Link  className="text-decoration-none text-center" onClick={() => handleShow("delete")}>
              Delete Account
            </Link>

          </div>

          {/* {message && (
            <div className="alert alert-success text-center mt-3" style={{ width: "60%", margin: "0 auto" }}>
              {message}
            </div>
          )} */}

          <UpdateModal
            show={show}
            handleClose={handleClose}
            updateType={updateType}
            handleInput={handleInput}
            handleUpdate={handleUpdate}
            type={type}
            icon={icon}
            showEye={showEye}
            errors={{}}
          />
        </div>
      ) : (
        <p className="text-center mt-4">Loading user details...</p>
      )}
    </div>
  );

};

export default DashBoard;
