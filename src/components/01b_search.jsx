import { useContext, useState } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    setDoc,
    doc,
    updateDoc,
    serverTimestamp,
    getDoc,
} from "firebase/firestore";
import { myDB } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {

    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);

    // In the AuthContext.js file, we are allowing access to the curUser state (defined within that only), thus, whenever we wish to use the current user, we must use, curUser i.e., the same as the name in AuthContext.js file.
    const { curUser } = useContext(AuthContext);
    
    const handleSearch = async () => {
        const q = query(
            collection(myDB, "users"),
            where("username", "==", username)
        );

        try {
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
        } catch (err) {
            setErr(true);
            console.log(err)
        }
    };


    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
    };
    
    
    const handleSelect = async () => {
        // Check whether the group(chats in firestore) exists, if not create

        const combinedId = curUser.uid > user.uid ? curUser.uid + user.uid : user.uid + curUser.uid;
        // The two uids are combined together in accordance with the alphabetical order. This is to ensure that both the users would have the same combinedId in the conversation collection.
        // We use combinedId to identify a conversation with a contact.
        
        try {
            const res = await getDoc(doc(myDB, "conversationMessages", combinedId));

            const fieldExists = (await getDoc(doc(myDB, 'conversation', curUser.uid))).data.hasOwnProperty(combinedId);

            // If the conversationMessages collection has not already been created...
            if ( (!res.exists() || !fieldExists) && curUser.uid !== user.uid) {

                // Creating a conversationMessages collection (this collection is for the array of messages b/w two people)
                await setDoc(doc(myDB, "conversationMessages", combinedId), { messages: [] });

                // Fill the conversation collection created at the time of first user registration (this collection is for the conversations in the sidebar). In the conversation collection, we will have an array, with its each element corresponding to a conversation b/w the signed in user and another user (thus, combinedId). First array element would be the combinedId and the second array element would be the date and the object userInfo.
                await updateDoc(doc(myDB, "conversation", curUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        username: user.username,
                        photoURL: user.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });


                let currentusername;
                const q = query(
                    collection(myDB, "users"),
                    where("uid", "==", curUser.uid)
                    );
                
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    currentusername = doc.data().username;
                });
                
                await updateDoc(doc(myDB, "conversation", user.uid), {
                    [combinedId + ".userInfo"]: {
                    uid: curUser.uid,
                    username: currentusername,
                    photoURL: curUser.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
            }
        } catch (err) {
            setErr(true);
            console.log(err)
        }

        setUser(null);      // To have the searched conversation disappear from the sidebar once clicked on.
        setUsername("");    // To empty the input bar once a conversation is clicked on. (I)
    };


    return (
        <div>
            <input 
                className='search' 
                type='text' 
                placeholder='Search Here...'
                onKeyDown={handleKey}
                onChange={(e) => setUsername(e.target.value)}
                value={username}    // To empty the input bar once a conversation is clicked on. (II)
            />
            
            {err && <span>User not found!</span>}

            {user && (
                <div className='contactList' onClick={handleSelect}>
                    <div className='contacts'>
                        <img src={user.photoURL} alt=""/>
                        <div className='contactsData'>
                            <p className="title">{user.username}</p>
                        </div>
                    </div>
                    <hr/>
                </div>
            )}
        </div>
    );
}

export default Search;