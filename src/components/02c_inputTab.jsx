import { useContext, useState, useEffect } from "react";
import clip from "../pics/clip.png";
import voice from "../pics/voice.jpg";
import send from "../pics/send.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { myDB, myStorage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const InputTab = () => {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);

    const { curUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    useEffect(()=>{
        if(text==="")
        {
            document.getElementById('sendImage').style.display = 'none';
            document.getElementById('voice').style.display = 'inline';
        }
        else
        {
            document.getElementById('sendImage').style.display = 'inline';
            document.getElementById('voice').style.display = 'none';
        }
        if(img!==null)
        {
            document.getElementById('sendImage').style.display = 'inline';
            document.getElementById('textBox').placeholder = '*Image Selected*';
            document.getElementById('textBox').style.fontWeight = "700";
            document.getElementById('voice').style.display = 'none';
        }
        else
            document.getElementById('textBox').placeholder = 'Type something...';
            
    });

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
            
                    if(img.type.includes("image"))
                    {
                        uploadTask.then( async()=> {
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
                    else if(img.type.includes("video"))
                    {
                        uploadTask.then( async()=> {
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
    <div id='inputSend'>
        <div id='inputComponent'>
            <div className="input">
                <input
                    id="textBox"
                    type="text"
                    placeholder="Type something..."
                    onChange={(e) => {
                        setText(e.target.value);
                        document.getElementById('sendImage').style.display = 'inline';
                        document.getElementById('voice').style.display = 'none';
                    }}
                    onKeyDown={handleKeyDown}
                    value={text}
                />
            </div>
        </div>
        <div className="send">
            <input
                type="file"
                style={{ display: "none" }}
                id="file"
                onChange={(e) => {
                    setImg(e.target.files[0])
                    document.getElementById('sendImage').style.display = 'inline';
                    document.getElementById('voice').style.display = 'none';
                }}
            />
            <label htmlFor="file">
                <img src={clip} alt="" />
            </label>
            

            <img id='voice' src={voice} alt="" onMouseDown={handleRecord} onMouseUp={handleStop}/>

            <img id='sendImage' src={send} alt="" onMouseUp={handleSend}/>
        </div>
    </div>
    );
};

export default InputTab;