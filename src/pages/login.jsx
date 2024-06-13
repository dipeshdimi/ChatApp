import { useState } from 'react';
import logo from '../pics/logo.png';
import { signInWithEmailAndPassword /*, signInWithPopup, signOut*/ } from "firebase/auth";   // From firebase SDK
import { myAuth, /*googleAuth*/ } from "../firebase";     // From the firebase.js file
import { useNavigate, Link } from "react-router-dom";

/* NOTE:    => createUserWithEmailAndPassword : To sign up and sign in the newly registered user
            => signInWithEmailAndPassword : To sign in when the user account is already there)
            => signInWithPopup : To sign up (and sign in the newly registered user) if it's a new user OR sign in if it's an already registered user, both handled by this single function */

// ##### 
    // https://stackoverflow.com/questions/36770523/onclick-event-doesnt-work-inside-form-tag
    // https://stackoverflow.com/questions/40726757/onclick-didnt-work-inside-form
    // https://stackoverflow.com/questions/31066693/what-is-the-purpose-of-the-html-form-tag

const Login = () => {
    
    const [err, setErr] = useState(false);
    const navigate = useNavigate();
    
    // console.log(myAuth?.currentUser.email);
    // console.log(myAuth?.currentUser);
    
    const loginEmail = async (loginEmailEvent) => {
        loginEmailEvent.preventDefault();   // ##### 
        const email = loginEmailEvent.target[0].value;
        const password = loginEmailEvent.target[1].value;
        try{
            await signInWithEmailAndPassword(myAuth, email, password);
            navigate("/");
        }catch(err){
            console.error(err);
            setErr(true);
        }
    };

    // const loginGoogle = async () => {
    //     try{
    //         await signInWithPopup(myAuth, googleAuth);
    //     }catch(err){
    //         console.error(err);
    //     }
    // };

    // const logout = async () => {
    //     try{
    //         await signOut(myAuth);
    //     }catch(err){
    //         console.error(err);
    //     }
    // };

    return (
        <div className="formPage">
            <div className="formBox">
                {/* can't use local file inside image tag in jsx */}
                <img id='logo' src={logo} alt=""/>
                <span id="regText">Login</span>

                <form onSubmit={loginEmail}>
                    <input
                        id="loginMail"
                        required type="email"
                        placeholder='email'
                        // onChange = {(emailChangeEvent) => setEmail(emailChangeEvent.target.value)}
                    />
                    <input
                        id="loginPass"
                        required type="password"
                        placeholder='password'
                        // onChange = {(passwordChangeEvent) => setPassword(passwordChangeEvent.target.value)}
                    />
                    
                    <button>Login</button>
                    {err && <span style={{color:'red', margin:'auto'}}>Something went wrong</span>}
                    
                    {/* New user would get registered and logged in (if a user is already logged in at the time this button is clicked, that user would be logged out and this newly registered user logged in) */}
                    {/* <button type="button" onClick={loginEmail}>Login</button> */}
                    {/* <button type="button" onClick={loginGoogle}>Login with Google</button> */}

                    {/* <button type="button" onClick={logout}>Logout</button> */}

                    {/* ##### type='button' */}
                </form>

                <span id='loginText'>Don't have an account? <Link to="/register">Register</Link> </span>
            </div>
        </div>
    );
}

export default Login;
