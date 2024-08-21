import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { myDB } from "../firebase";
import { doc, onSnapshot, updateDoc, deleteField } from "firebase/firestore";

const Contacts = ({ onSelectChat }) => {
    const { data } = useContext(ChatContext);
    const [chats, setChats] = useState([]);
    const { curUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);
    
    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(myDB, "conversation", curUser.uid), (doc) => {
                setChats(doc.data());
            });

            return () => {
                unsub();
            };
        };
        
        curUser.uid && getChats();
    }, [curUser.uid]);
    
    const handleSelect = (clickedChatUserInfo) => {
        dispatch({ type: "CHANGE_USER", payload: clickedChatUserInfo });
        Array.from(document.getElementsByClassName('sidebar')).forEach(el => el.classList.remove('show'));
        Array.from(document.getElementsByClassName('chats')).forEach(el => el.classList.add('show'));
        onSelectChat();
    };

    const handleDelete = async () => {
        var CHAT_ID = data.chatId;
        const chatRef = doc(myDB, "conversation", curUser.uid);
        try {
            await updateDoc(chatRef, {
                [CHAT_ID]: deleteField()
            });
            console.log("Field deleted successfully");
        } catch (error) {
            console.error("Error deleting field: ", error);
        }
    }
    
    return (
        <div className='contactList'>
            {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
                <div
                    className='contacts'
                    key={chat[0]}
                    onClick={() => handleSelect(chat[1].userInfo)}
                >
                    <div className="imageUnread">
                        <img src={chat[1].userInfo.photoURL} alt="" />
                    </div>
                    <div className='contactsData'>
                        <p className="title">{chat[1].userInfo.username}</p>
                        <p>{chat[1].lastMessage?.text}</p>
                    </div>

                    <i className="material-icons" onClick={handleDelete}>delete</i>
                </div>
            ))}
        </div>
    );
}

export default Contacts;
