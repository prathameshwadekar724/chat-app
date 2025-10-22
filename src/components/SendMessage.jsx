import React, { useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp, doc } from 'firebase/firestore'; // <-- Import doc

function SendMessage({ chatRoomId }) {
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const { uid, displayName, photoURL } = auth.currentUser;
    
    const messagesRef = collection(doc(db, 'chatRooms', chatRoomId), 'messages');

    await addDoc(messagesRef, {
      text: input,
      createdAt: serverTimestamp(),
      uid,
      displayName,
      photoURL,
    });

    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex p-4 bg-gray-800">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type="text"
        placeholder="Type a message..."
        className="flex-grow px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none"
        disabled={!chatRoomId} 
      />
      <button
        type="submit"
        className="px-6 py-2 ml-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
        disabled={!chatRoomId || input.trim() === ''} 
      >
        Send
      </button>
    </form>
  );
}

export default SendMessage;