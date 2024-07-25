import { ChatContext } from "../context/ChatContext";
import { useContext } from "react";

const ChatsTop = ({ onBack }) => {
    const { data } = useContext(ChatContext);

    return (
        <div className="chat">
            <div className="chatInfo">
                <span>
                    <i className="fa fa-arrow-left" style={{ fontSize: "200%", color: "rgb(220,220,220)", display: 'none' }} onClick={onBack}></i>
                    <img src={data.user?.photoURL} alt="Profile Pic" />
                    <span>{data.user?.username}</span>
                </span>
            </div>
        </div>
    );
}

export default ChatsTop;
