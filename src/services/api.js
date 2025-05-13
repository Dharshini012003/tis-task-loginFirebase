import axios from "axios";
import { getUserData } from "./Storage";
import { doc, setDoc, updateDoc } from "firebase/firestore";  
import { db } from "../firebase"; // path depends on your project structure
import { getAuth, updateEmail, updatePassword } from "firebase/auth"; // Firebase Auth SDK



axios.defaults.baseURL = "https://identitytoolkit.googleapis.com/v1"
const API_KEY = "AIzaSyDnVQC3CCsc75NL2JL-R6DlVBQxIqKN8Fs"
const REGISTER_URL =`/accounts:signUp?key=${API_KEY}`
const LOGIN_URL=`/accounts:signInWithPassword?key=${API_KEY}`
const USER_DETAILS=`/accounts:lookup?key=${API_KEY}`
const PS_RESET_MAIL=`/accounts:sendOobCode?key=${API_KEY}`
const CHANGE_EMAIL =`/accounts:update?key=${API_KEY}`
const CHANGE_PSWD =`/accounts:update?key=${API_KEY}`

// export const RegisterApi = (inputs)=>{
//     let data = {displayName:inputs.name,email:inputs.email,password:inputs.password}
//     return axios.post(REGISTER_URL,data)
// }

export const RegisterApi = async (inputs) => {
  try {
    let data = {
      displayName: inputs.name,
      email: inputs.email,
      password: inputs.password
    };

    // Register the user using Firebase Auth REST API
    const response = await axios.post(REGISTER_URL, data);

    const { localId, email } = response.data;

    // Store user data in Firestore using Firestore SDK
    await setDoc(doc(db, "users", localId), {
      uid: localId,
      email: email,
      name: inputs.name,
      createdAt: new Date(),
    });

    console.log("User registered and saved to Firestore");

    return response; // return API response if needed elsewhere
  } catch (error) {
    console.error("Error during registration:", error);
    throw error; // re-throw so calling function can handle it
  }
};


export const LoginApi = (inputs)=>{
    let data = {email:inputs.email,password:inputs.password}
    return axios.post(LOGIN_URL,data)
}

export const UserDetailsApi=()=>{
   let data={idToken:getUserData()}
   return axios.post(USER_DETAILS,data)
}

export const sendPasswordResetEmail=(inputs)=>{
   let data={requestType: 'PASSWORD_RESET',email:inputs.email}
   return axios.post(PS_RESET_MAIL,data)
}

// export const changeEmail=(inputs)=>{
//    let data={idToken:getUserData(),email:inputs.email}
//    return axios.post(CHANGE_EMAIL,data)
// }

// export const changePassword=(inputs)=>{
//    let data={idToken:getUserData(),password:inputs.password}
//    return axios.post(CHANGE_PSWD,data)
// }

// Change email: Update email in both Firebase Auth and Firestore
export const changeEmail = async (inputs) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No user logged in");
    }

    // 1. Update email in Firebase Authentication
    await updateEmail(user, inputs.email);

    // 2. Update email in Firestore
    await updateDoc(doc(db, "users", user.uid), { email: inputs.email });

    console.log("Email updated successfully in both Firebase Auth and Firestore");
  } catch (error) {
    console.error("Error updating email:", error);
    throw error;
  }
};

// Change password: Update password in Firebase Auth
export const changePassword = async (inputs) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No user logged in");
    }

    // 1. Update password in Firebase Authentication
    await updatePassword(user, inputs.password);

    console.log("Password updated successfully in Firebase Auth");
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};
