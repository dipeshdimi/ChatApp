import { useContext, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { myDB, myStorage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const InputTab = () => {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const [placeholder, setPlaceholder] = useState("Type Something...");

    const { curUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const fileInputRef = useRef(null);

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevents adding newline to textarea
            handleSend();
        }
    };

    const handleSend = async () => {
        if (img) {
            const storageRef = ref(myStorage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, img);

            // uploadTask.on(
            //     (error) => {
            //         // Handle Error
            //     },
            //     async () => {
            // await sleep(500);
            // const reader = new FileReader;
            // reader.onloadend = () => {

            if (img.type.includes("image")) {
                uploadTask.then(async () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(myDB, "conversationMessages", data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: curUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL,
                                msgType: 'image'
                            }),
                        });
                    });
                });
            }
            else if (img.type.includes("video")) {
                uploadTask.then(async () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(myDB, "conversationMessages", data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: curUser.uid,
                                date: Timestamp.now(),
                                videoMsg: downloadURL,
                                msgType: 'video'
                            }),
                        });
                    });
                });
            }
            // }
            // }
            // );
        }
        else {
            if(text==="")
                return;
            
            await updateDoc(doc(myDB, "conversationMessages", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: curUser.uid,
                    date: Timestamp.now(),
                    msgType: 'text'
                }),
            });
        }

        await updateDoc(doc(myDB, "conversation", curUser.uid), {
            [data.chatId + ".lastMessage"]: {
                text
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(myDB, "conversation", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                text
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });

        setText("");
        setImg(null);
        setPlaceholder("Type Something...")
    };


    let device = navigator.mediaDevices.getUserMedia({ audio: true });
    let chunks = [];
    let recorder;
    device.then(stream => {
        recorder = new MediaRecorder(stream);

        recorder.ondataavailable = e => {
            chunks.push(e.data);

            if (recorder.state === 'inactive') {
                let blob = new Blob(chunks, { type: 'audio/webm' });

                var reader = new FileReader();

                reader.addEventListener("load", function () {
                    updateDoc(doc(myDB, "conversationMessages", data.chatId), {
                        messages: arrayUnion({
                            id: uuid(),
                            text,
                            senderId: curUser.uid,
                            date: Timestamp.now(),
                            msgType: 'audio',
                            voiceMsg: reader.result
                        }),
                    });
                }, false);

                reader.readAsDataURL(blob);

                updateDoc(doc(myDB, "conversation", curUser.uid), {
                    [data.chatId + ".lastMessage"]: {
                        text
                    },
                    [data.chatId + ".date"]: serverTimestamp(),
                });

                updateDoc(doc(myDB, "conversation", data.user.uid), {
                    [data.chatId + ".lastMessage"]: {
                        text
                    },
                    [data.chatId + ".date"]: serverTimestamp(),
                });
            }
        }
    });

    var timeout;
    const handleRecord = () => {
        chunks = [];
        recorder.start();
    }

    const handleStop = () => {
        recorder.stop();
        clearInterval(timeout);
    }



    return (
        <div className="input-container">
            <input
                type="text"
                className="text-input"
                placeholder={placeholder}
                onChange={(e) => { setText(e.target.value); }}
                onKeyDown={handleKeyDown}
                value={text}
            />
            <i className="material-icons attachment-icon" onClick={handleIconClick}>attachment</i>
            <input
                type="file"
                className="file-input"
                ref={fileInputRef}
                onChange={(e) => { setImg(e.target.files[0]); setPlaceholder("*Image Selected*");}}
                onKeyDown={handleKeyDown}
            />
            {text === "" && img===null ? (
                <i className="material-icons voice-icon" onMouseDown={handleRecord} onMouseUp={handleStop}>keyboard_voice</i>
            ) : (
                <i className="material-icons send-icon" onMouseUp={handleSend}>send</i>
            )}
        </div>
    );
};

export default InputTab;