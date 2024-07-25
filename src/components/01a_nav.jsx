import { useContext } from 'react'
import { myAuth} from "../firebase";     // From the firebase.js file
import { signOut } from "firebase/auth";
import { AuthContext } from '../context/AuthContext';
import { Link } from "react-router-dom";
import logout from "../pics/logout.png";

const Nav = () => {

    const {curUser} = useContext(AuthContext);

    return (
        <div id='nav'>
            <span>
                <img src={curUser.photoURL} alt=""/>
                <span>{curUser.username}</span>
            </span>
            <button onClick = {() => signOut(myAuth)}> 
                <Link id='logoutLink' to="/login">Logout</Link> 
                <img src={logout} alt=""/>
            </button>
        </div>
    );
}

export default Nav;