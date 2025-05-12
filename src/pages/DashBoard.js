import React, { useState, useEffect } from 'react'
import { UserDetailsApi } from '../services/api'
import { logout } from '../services/Auth'
import { Navigate ,useNavigate } from 'react-router-dom';


const DashBoard = () => {
    const [user, setUser] = useState({ name: "", email: "", localId: "" })
  const navigate =useNavigate();
    useEffect(() => {
        UserDetailsApi()
            .then((response) => {
                setUser({
                    name: response.data.users[0].displayName,
                    email: response.data.users[0].email,
                    localId: response.data.users[0].localId,
                })
                // console.log(response);
            })
            .catch((error) => {
                console.error("Error fetching user details:", error);
            });


    }, [])

    const logoutUser =()=>{
        logout()
      navigate('/login')
}
    
    return (
        <div style={{ padding: "0", margin: "0" }}>
            <div  className="bg-dark p-3 d-flex align-items-center justify-content-between">
            <h3 className="  text-white ">Dashboard</h3>
            <p className="text-white h5" onClick={logoutUser} style={{cursor:"pointer"}}>Logout &nbsp; <i className="fa fa-sign-out" aria-hidden="true"></i></p>
            </div>
        
            {user.name && user.email && user.localId ?
                (
                    <div>
                        <h1 className="fw-bold text-center" >Welcome {user.name}</h1>
                        <p  className="fw-bold text-center text-muted h5" >Here's your Firebase ID and Email you Logged In... </p>
                        <table className="table table-hover " style={{ width: "50%", padding: "20px", margin: "20px auto" }}>
                            <thead>
                                <tr>
                                    <th scope="col">Firebase ID</th>
                                    {/* <th scope="col">Name</th> */}
                                    <th scope="col">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{user.localId}</td>
                                    {/* <td>{user.name}</td> */}
                                    <td>{user.email}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                )
                : <p>Loading...</p>
            }

        </div>

    )
}

export default DashBoard