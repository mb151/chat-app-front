import React, {useState, useEffect, createRef} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import makeToast from "../Toaster";

const  DashboardPage = (props) => {
    const [chatrooms, setChatrooms] = useState([]);
    const nameRef = createRef();

    const getChatrooms = () => {
        axios.get("http://localhost:8000/chatroom", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("CC_Token"),
            },
        })
        .then((response) => {
            setChatrooms(response.data);
        })
        .catch(err => {
            setTimeout(getChatrooms, 3000);
        })
       // nameRef.current.value = "";
    };

    useEffect(() => {
       getChatrooms();
       const interval = setInterval(() => getChatrooms(), 1000)
       return () => {
         clearInterval(interval);
       }
    }, [])

    const createChatroom = () => {
        const token = localStorage.getItem("CC_Token");
        const name = nameRef.current.value;
        axios.post("http://localhost:8000/chatroom", {
            name,
        },{
            headers: {
                'Authorization' : 'Bearer ' + token
            }
        }).then(response => {
            makeToast("success", response.data.message);
        }).catch((err) => {
            if(
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
            )
            makeToast("error", err.response.data.message)
        })
    }

    return (
        <div className="card">
        <div className="cardHeader">Chatrooms</div>
        <div className="cardBody">
             <div className="inputGroup">
                 <label htmlFor="chatroomName">Chatroom Name</label>
                 <input type="text" name="chatroomName" id="chatroomName" placeholder="Your Chatroom Name" ref={nameRef}/>
             </div>
             <button onClick={createChatroom}>Create Chatroom</button>
             <div className="chatrooms">
                 {chatrooms.map((chatroom) => (
                    <div key={chatroom._id} className="chatroom">
                        <div>{chatroom.name}</div>
                        <Link to={"/chatroom/" + chatroom._id} >
                            <div className="join">Join</div> 
                        </Link>
                       
                    </div> 
                ))}
             </div>
        </div>
    </div>
    )
}

export default  DashboardPage;