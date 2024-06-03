import React, { useRef, useState } from 'react';
import '../assets/css/chatRoom.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';
import { getAuth, signInAnonymously } from "firebase/auth";

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyCCQshz1xLk2m25XHisUc2wWECDs4b0eBg",
    authDomain: "pms-chat-93ca4.firebaseapp.com",
    projectId: "pms-chat-93ca4",
    storageBucket: "pms-chat-93ca4.appspot.com",
    messagingSenderId: "1035071960639",
    appId: "1:1035071960639:web:047c86a99b3a1cb0c5aa8a",
    measurementId: "G-8YN3E77FF6"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function ChatApp() {

    const [user] = useAuthState(auth);

    return (
        <div className="container h-100 d-flex flex-column w-auto">
            <div className="w-auto d-flex container align-content-center justify-content-center">
                {user ?  '' :<h3 className='text-center w-auto'>SignIn to the chat room!</h3>}
                <SignOut />
            </div>

            <section>
                {user ? <ChatRoom /> : <SignIn />}
            </section>
        </div>
    );
}

function SignIn() {
    const signInAnonymously = async () => {
        try {
            await auth.signInAnonymously();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="text-center">
            <button className="btn btn-primary w-auto z-100 mt-2" onClick={signInAnonymously}>Click Here To Start The Chat</button>
        </div>
    );
}

function SignOut() {

    const handleSignOut = () => {
        auth.signOut();
        window.close();
    };

    return auth.currentUser && (
        <button className="btn btn-danger w-auto z-100 mt-2" onClick={handleSignOut}>Click Here To End The Chat</button>
    );
}

function ChatRoom() {
    const dummy = useRef();
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(query, { idField: 'id' });

    const [formValue, setFormValue] = useState('');

    const sendMessage = async (e) => {
        e.preventDefault();

        const { uid, photoURL } = auth.currentUser;

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL
        });

        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <main>
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                <span ref={dummy}></span>
            </main>
            <form className="d-flex h-20 w-100 position-fixed start-50 translate-middle-x" onSubmit={sendMessage} style={{bottom: 5, backgroundColor: 'rgb(24, 23, 23)', maxWidth: '728px',fontSize: '1.5rem'}}>
                <input className="form-control me-2" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
                <button className="btn btn-primary w-auto" type="submit" disabled={!formValue}>🚀</button>
            </form>
        </>
    );
}

function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
        <div className={`message ${messageClass} my-3 p-3 border rounded-3 bg-secondary`}>
            <img src={photoURL || 'https://cdn-icons-png.flaticon.com/512/4794/4794936.png'} className="me-3" alt="user" />
            <p className="m-0">{text}</p>
        </div>
    );
}

export default ChatApp;