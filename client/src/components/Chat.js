import React, { useEffect, useState } from 'react';
import styles from './../styles/chat.module.css'
import { socket } from '../socket/socket';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [room, setRoom] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        setMessages([...messages, messageInput]);
        setMessageInput("");
        socket.emit("send-message", messageInput, room);
    };
    const handleJoinRoom = () => {
        // we cannot join a room from the client
        // we need to tell the server we are gonna join a room 
        socket.emit("join-room", room, message => { // we are gonna call this function in the server and it will be executed here. interesting!
            setMessages([...messages, message]);


            // ###############
            // one additional thing that you can do with socket.on() and socket.emit() is that (shown above)
            // you can pass them a callback function. 
            // this callback function is going to get called 
            // from the server back down to the client
            // the callback function must be the last thing you pass to .emit()
            // 1. one great use-case is that if you want to do something and tell the user the thing was successful, for example, joining a room.
            // 2. another use-case is that if you want to have a messaging system where you would tell the user once the message was sent. the callback could be used to verify that the message was sent
        });
        // setRoom(""); // do not set it to "" (empty string). won't work.



    };

    useEffect(() => {
        socket.on('connect', () => {
            setMessages([...messages, `You are connected with id ${socket.id}`]);
        });
        socket.on("receive-message", message => {
            setMessages([...messages, message]);
        })
    }, [messages]);

    return (
        <div>
            {/* Messages */}
            <div className={styles.msgContainer}>
                <ol>
                    {messages.map && messages.map(msg => <li key={msg}>{msg}</li>)}
                </ol>
            </div>
            {/* Input boxes */}
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="message">Message</label>
                    <input type="text" id="message" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
                    <button type="submit">Send</button>
                    <br />
                    <label htmlFor="room">Room</label>
                    <input type="text" id="room" value={room} onChange={(e) => setRoom(e.target.value)} />
                    <button type="button" onClick={handleJoinRoom}>Join</button>
                </form>
            </div>
        </div>
    );
};

export default Chat;