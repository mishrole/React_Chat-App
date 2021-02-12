import React, { useState, useRef } from 'react';
import firebase from 'firebase/app';

import 'firebase/firestore';
import 'firebase/auth';
import './App.css';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const config = {
  apiKey: "AIzaSyCHcH4ApmSs_V4yYO68htOetcJePJFYK7w",
  authDomain: "mishrole-demo2.firebaseapp.com",
  projectId: "mishrole-demo2",
  storageBucket: "mishrole-demo2.appspot.com",
  messagingSenderId: "137693382039",
  appId: "1:137693382039:web:0bcd3b7dceb902d5c230d2",
  measurementId: "G-6GTX2NGD75"
}

if(!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        { SignOut() }
      </header>

      <section>
        { user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign In with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {

  const dummy = useRef()

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth'});
  }

  return (
    <>
      <main>
        <div>
          {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
        </div>
        <div ref={dummy}></div>
      </main>

      <form>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL}/>
      <p>{text}</p>
    </div>
  )
}

export default App;
