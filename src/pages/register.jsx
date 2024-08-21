import { useState } from 'react';
import logo from '../pics/logo.png';
import avatar from '../pics/avatar.png';

import { myAuth, /*googleAuth,*/ myStorage, myDB } from "../firebase";     // From the firebase.js file

import { createUserWithEmailAndPassword, /*signInWithPopup, signOut,*/ updateProfile } from "firebase/auth";   // From firebase SDK
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

import emailjs from '@emailjs/browser';


// NOTE:    => createUserWithEmailAndPassword : To sign up and sign in the newly registered user
//          => signInWithEmailAndPassword : To sign in when the user account is already there)
//          => signInWithPopup : To sign up (and sign in the newly registered user) if it's a new user OR sign in if it's an already registered user, both handled by this single function

// ##### 
    // https://stackoverflow.com/questions/36770523/onclick-event-doesnt-work-inside-form-tag
    // https://stackoverflow.com/questions/40726757/onclick-didnt-work-inside-form
    // https://stackoverflow.com/questions/31066693/what-is-the-purpose-of-the-html-form-tag

const Register = () => {

    const [err, setErr] = useState(false);
    const myNavigate = useNavigate();       // React Hooks must be called in a React function component or a custom React Hook function (cannot be called inside a callback)
    
    // const [username, setUsername] = useState("");
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    // const [avatar, setAvatar] = useState("");   // Image can't be uploaded using useState hook

    // console.log(myAuth?.currentUser.email);
    // console.log(myAuth?.currentUser);

    const regEmail = async (regEmailEvent) => {
        
        regEmailEvent.preventDefault();
            // #####
            // Also, we need this, otherwise the page would be refreshed before the user is even added to the database & directed to the home page
        const username = regEmailEvent.target[0].value;
        const email = regEmailEvent.target[1].value;
        const password = regEmailEvent.target[2].value;
        const avatar = regEmailEvent.target[3].files[0];

        // const verified = ;
        
        if(sendOTP(username,email))
        {
            try{
                const res = await createUserWithEmailAndPassword(myAuth, email, password);

                // const date = new Date().getTime();
                const storageRef = ref(myStorage, username);
                
                const uploadTask = uploadBytesResumable(storageRef, avatar);
                
                uploadTask.then( async()=> {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        try {
                            //Update profile
                            await updateProfile(res.user, {
                                username,
                                photoURL: downloadURL,
                            });

                            // Create a collection of all registered users
                            await setDoc(doc(myDB, "users", res.user.uid), {
                                uid: res.user.uid,
                                username,
                                email,
                                photoURL: downloadURL,
                                // Not storing password here as users will use this "users" collection to search for a particular user
                            });

                            // Create a collection for the conversations shown in the sidebar
                            await setDoc(doc(myDB, "conversation", res.user.uid), {});
                            myNavigate("/");
                        
                        } catch (err) {
                            console.log(err);
                            setErr(true);
                        }
                    });
                });
                } catch(err){
                    console.log(err);
                    setErr(true);
                }
        }
        else {
            alert("Wrong OTP");
        }
    };

    // const regGoogle = async () => {
    //     try{
    //         const res = await signInWithPopup(myAuth, googleAuth);
    //     }catch(err){
    //         setErr(true);
    //     }
    // };

    // const logout = async () => {
    //     try{
    //         const res = await signOut(myAuth);
    //     }catch(err){
    //         setErr(true);
    //     }
    // };

    async function sendOTP(receiverName, receiverEmailId) {

        const otp = Math.floor(Math.random() * (999999-100001)) + 100001;
        
        const params = {
            // receiverName: document.getElementByClassName('receiverName').value,
            // receiverEmail: document.getElementByClassName('receiverEmailId').value,
            receiverName: receiverName,
            receiverEmail: receiverEmailId,
            sentOtp: otp
        };

        let success = false;
        await emailjs.send('service_4qsy64s', 'template_y5guxi8', params, 'Cyn4EyOMCbtgDKNPc').then((result) => {
            let otpAsk = prompt("Enter  the OTP sent to your Email");
            if(otp === otpAsk)
                success = true;
        }, (error) => {
            console.log(error.text);
        });
        return success;
    }

    return (
        <div className="formPage">
            <div className="formBox">
                {/* can't use local file inside image tag in jsx */}
                <img className='logo' src={logo} alt=""/>
                <span className="regText">Register</span>

                <form onSubmit={regEmail}>
                    <input
                        required type="text" 
                        placeholder='username'
                        // onChange = {(usernameChangeEvent) => setUsername(usernameChangeEvent.target.value)}
                        className='receiverName'
                    />
                    <input
                        required type="email"
                        placeholder='email'
                        // onChange = {(emailChangeEvent) => setEmail(emailChangeEvent.target.value)}
                        className='receiverEmail'
                    />
                    <input
                        required type="password"
                        placeholder='password'
                        // onChange = {(passwordChangeEvent) => setPassword(passwordChangeEvent.target.value)}
                        className="pass"
                    />
                    <input className="DP"
                        required type='file'
                        // onChange = {(avatarChangeEvent) => setAvatar(avatarChangeEvent.target.value)}
                    />
                    <label htmlFor='DP'>
                        <img src={avatar} alt=""/>
                        <span>Add an Avatar</span>
                    </label>

                    <button>Send OTP</button>
                    {/* <button>Sign Up</button> */}
                    {/* In HTML5, a button inside a form has the default behaviour of submit. */}

                    {/* New user would get registered and logged in (if a user is already logged in at the time this button is clicked, that user would be logged out and this newly registered user logged in) */}
                    {/* <button type="button" onClick={regEmail}>Register</button> */}
                    {/* <button type="button" onClick={regGoogle}>Register with Google</button>

                    <button type="button" onClick={logout}>Logout</button> */}
                    {err && <span style={{color:'red', margin:'auto'}}>Something went wrong</span>}

                    {/* ##### type='button' */}
                </form>

                {/* <form onSubmit={sendOTP}>
                    <input type="text" className="receiverName" />
                    <input type="email" className="receiverEmailId" />
                    
                </form> */}

                <span className='loginText'>Already a user? <Link to="/login">Login</Link> </span>
            </div>
        </div>
    );
}

export default Register;
