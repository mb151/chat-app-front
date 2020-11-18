import React from 'react';
import axios from "axios";
import makeToast from "../Toaster";
import { Link } from 'react-router-dom';

export default function RegisterPage(props) {
    const nameRef = React.createRef();
    const emailRef = React.createRef();
    const passwordRef = React.createRef();

    const registerUser = () => {
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        axios.post("http://localhost:8000/user/register", {
            name,
            email,
            password
        }).then(response => {
            makeToast("success", response.data.message);
            props.history.push("/login");
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
           <div className="cardHeader">Registration</div>
           <div className="cardBody">
                <div className="inputGroup">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" placeholder="Your Name" ref={nameRef}/>
                </div>
                <div className="inputGroup">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" placeholder="abcd@example.com" ref={emailRef} />
                </div>
                <div className="inputGroup">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="Your Password" ref={passwordRef} />
                </div>
                <button onClick={registerUser}>Register</button>
           </div>
           <p>Already have an account ? <Link to="/login">Login</Link></p>
       </div>
    )
}
