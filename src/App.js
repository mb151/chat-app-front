import React, {useState, useEffect} from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import IndexPage from './pages/IndexPage';
import ChatroomPage from './pages/ChatroomPage';
import makeToast from './Toaster';
import io from "socket.io-client";


function App() {
  const [socket, setSocket] = useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem("CC_Token");
    if(token && !socket){
       const newSocket = io("http://localhost:8000", {
        query: {
            token: localStorage.getItem("CC_Token")
        }
    });

    newSocket.on("disconnect", () => {
      setSocket(null);
      setTimeout(setupSocket, 3000);
      makeToast("error", "Socket Disconnected!");
    });

    newSocket.on("connect", () => {
      makeToast("success", "Socket connected!")
    });

    setSocket(newSocket);
    }
  };

  useEffect(() => {
    setupSocket();
  }, [])

  return (
    <BrowserRouter>
        <Switch>
          <Route path="/" component={IndexPage} exact/> 
          <Route path="/chatroom/:id" 
            render={() => <ChatroomPage socket={socket} />}  
            exact/> 
          <Route path="/login" 
            render={() => <LoginPage setupSocket={setupSocket} />} 
            exact/>
          <Route path="/register" component={RegisterPage} exact/>
          <Route path="/dashboard" 
            render={() => <DashboardPage socket={socket} />} 
            exact/>
        </Switch>
    </BrowserRouter>
  );
}

export default App;
