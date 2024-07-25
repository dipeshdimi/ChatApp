import { useContext } from "react";
import ChatsTop from './02a_chatsTop';
import MessageTab from './02b_messageTab';
import InputTab from './02c_inputTab';
import { ChatContext } from "../context/ChatContext";
import noChatImage from '../pics/chatBackk.png'; // Update this path as per your project structure

const Chats = ({ show, onBack }) => {
    const { data } = useContext(ChatContext);

    return (
        <div id='chats' className={show ? 'show' : ''}>
            {data.chatId !== 'null' ? (
                <>
                    <ChatsTop onBack={onBack} />
                    <MessageTab />
                    <InputTab />
                </>
            ) : (
                <img src={noChatImage} alt="No Chat Selected" className="noChatImage" />
            )}
        </div>
    );
}

export default Chats;
