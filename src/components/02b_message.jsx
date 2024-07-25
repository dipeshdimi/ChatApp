import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
    const { curUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    // To prevent blank messages
    const [blank, setBlank] = useState("none");

    useEffect(() => {
        if (message.text === "") {
            setBlank("none");
        } else {
            setBlank("block");
        }
    }, [message.text]);

    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [message]);

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    };

    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const formattedDate = formatDate(message.date.toDate());
    const formattedTime = formatTime(message.date.toDate());

    return (
        <div
            ref={ref}
            className={`message ${message.senderId === curUser.uid ? "owner" : ""}`}
        >
            <div className="messageInfo">
                <img
                    src={message.senderId === curUser.uid ? curUser.photoURL : data.user.photoURL} alt=""
                />
                <span>{formattedDate}</span>
                <span>{formattedTime}</span>
            </div>
            <div className="messageContent">
                {message.text && <p style={{ display: blank }}>{message.text}</p>}
                {message.img && <img src={message.img} alt="" />}
                {message.voiceMsg && (
                    <audio id="audio" controls>
                        <source src={message.voiceMsg} type="audio/webm" />
                    </audio>
                )}
                {message.videoMsg && (
                    <video id="video" controls>
                        <source src={message.videoMsg} type="video/webm" />
                    </video>
                )}
            </div>
        </div>
    );
};

export default Message;
