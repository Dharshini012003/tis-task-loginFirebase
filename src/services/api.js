// src/services/api.js
import axios from "axios";
import { getUserData } from "./Storage";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, updateEmail, updatePassword ,updateProfile} from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // your initialized auth

axios.defaults.baseURL = "https://identitytoolkit.googleapis.com/v1";
const API_KEY = "AIzaSyDnVQC3CCsc75NL2JL-R6DlVBQxIqKN8Fs";

const REGISTER_URL = `/accounts:signUp?key=${API_KEY}`;
//const LOGIN_URL = `/accounts:signInWithPassword?key=${API_KEY}`;
const USER_DETAILS = `/accounts:lookup?key=${API_KEY}`;
const PS_RESET_MAIL = `/accounts:sendOobCode?key=${API_KEY}`;
const DELETE_ACC =`/accounts:delete?key=${API_KEY}`;

// Register user
export const RegisterApi = async (inputs) => {
  try {
    const data = {
      displayName: inputs.name,
      email: inputs.email,
      password: inputs.password
    };

    const response = await axios.post(REGISTER_URL, data);
    const { localId, email } = response.data;

    await setDoc(doc(db, "users", localId), {
      uid: localId,
      email: email,
      name: inputs.name,
      createdAt: new Date(),
      // photo:""
    });

    return response;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

// Login user
// export const LoginApi = (inputs) => {
//   const data = { email: inputs.email, password: inputs.password };
//   return axios.post(LOGIN_URL, data);
// };



//log in firebase sdk
export const LoginApi = (inputs) => {
  return signInWithEmailAndPassword(auth, inputs.email, inputs.password);
};

// Get single user details using idToken
export const UserDetailsApi = () => {
  const data = { idToken: getUserData() };
  return axios.post(USER_DETAILS, data);
};


// Send password reset email
export const sendPasswordResetEmail = (inputs) => {
  const data = { requestType: "PASSWORD_RESET", email: inputs.email };
  return axios.post(PS_RESET_MAIL, data);
};

// Update/change password using Firebase SDK
export const changePassword = async (inputs) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("No user logged in");

  await updatePassword(user, inputs.password);

  console.log("Password updated successfully in Firebase Auth");
}

//update name
export const changeName = async (inputs) => {
const auth = getAuth();
const user = auth.currentUser;

if (!user) throw new Error("No user logged in");

await updateProfile(user, { displayName: inputs.name });

console.log("Name updated successfully in Firebase Auth");
};

//delete account
export const deleteAccount =()=>{
     const data = { idToken: getUserData() };
  return axios.post(DELETE_ACC, data);
}


// Update email using Firebase SDK
export const changeEmail = async (inputs) => {
  const auth = getAuth();
  const user = auth.currentUser;


  if (!user) throw new Error("No user logged in");

  await updateEmail(user, inputs.email);
  await updateDoc(doc(db, "users", user.uid), { email: inputs.email });

  console.log("Email updated successfully in both Firebase Auth and Firestore");
};









// export const sendPasswordResetEmail=(inputs)=>{
//    let data={requestType: 'PASSWORD_RESET',email:inputs.email}
//    return axios.post(PS_RESET_MAIL,data)
// }

// export const changeEmail=(inputs)=>{
//    let data={idToken:getUserData(),email:inputs.email}
//    return axios.post(CHANGE_EMAIL,data)
// }

// export const changePassword=(inputs)=>{
//    let data={idToken:getUserData(),password:inputs.password}
//    return axios.post(CHANGE_PSWD,data)
// }

// Change email: Update email in both Firebase Auth and Firestore
// export const changeEmail = async (inputs) => {
//   try {
//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (!user) {
//       throw new Error("No user logged in");
//     }

//     // 1. Update email in Firebase Authentication
//     await updateEmail(user, inputs.email);

//     // 2. Update email in Firestore
//     await updateDoc(doc(db, "users", user.uid), { email: inputs.email });

//     console.log("Email updated successfully in both Firebase Auth and Firestore");
//   } catch (error) {
//     console.error("Error updating email:", error);
//     throw error;
//   }
// };

// Change password: Update password in Firebase Auth
// export const changePassword = async (inputs) => {
//   try {
//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (!user) {
//       throw new Error("No user logged in");
//     }

    // 1. Update password in Firebase Authentication
//     await updatePassword(user, inputs.password);

//     console.log("Password updated successfully in Firebase Auth");
//   } catch (error) {
//     console.error("Error updating password:", error);
//     throw error;
//   }
// };
