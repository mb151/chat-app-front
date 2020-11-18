import React, {useEffect, useState, useRef} from 'react';
import {withRouter} from 'react-router-dom';

 function ChatroomPage({match, socket}) {
    const chatroomId = match.params.id;
    const [messages, setMessage] = useState([]);
    const messageRef =  useRef();
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("CC_Token");
        if(token){
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserId(payload.id);
        }
        if(socket){
            socket.on("newMessage", (message) => {
                const newMessage = [...messages, message];
                setMessage(newMessage);
            })
        }
    }, [messages]);

    useEffect(() => {
        if(socket){
            socket.emit("joinRoom", {
            chatroomId,
        });
        }

        return () => {
            if(socket){
                    socket.emit("leaveRoom", {
                    chatroomId,
                }) 
            }
           
        }
    }, []);


    const sendMessage = () => {
        if(socket){
            socket.emit("chatroomMessage", {
                chatroomId,
                message: messageRef.current.value,
            });
            messageRef.current.value = "";
        }
    }
    return (
        <div className="chatroomPage">
            <div className="chatroomSection">
                <div className="cardHeader">Chatroom Name</div>
                <div className="chatroomContent">
                    {
                        messages.map((message, i) => (
                            <div key={i} className="message">
                                <span className={userId === message.userId ? "ownMessage" : "otherMessage"}>{message.name} : </span>{message.message}
                            </div>
                        ))
                    } 
                    <div className="chatroomActions">
                        <div>
                            <input type="text" name="message" placeholder="Say something!" ref={messageRef}/>
                        </div>
                        <div>
                            <button className="join" onClick={sendMessage}>
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(ChatroomPage);