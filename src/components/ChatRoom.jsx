import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc // <-- Import doc
} from 'firebase/firestore';

import Message from './Message';
import SendMessage from './SendMessage';
import ChatHeader from './ChatHeader';

// 1. Accept new props: currentUser and recipientUser
function ChatRoom({ currentUser, recipientUser }) {
  const [messages, setMessages] = useState([]);
  const scrollDummy = useRef(); 
  const [chatRoomId, setChatRoomId] = useState(null);

  // 2. Create a unique chat room ID whenever the recipient changes
  useEffect(() => {
    if (currentUser && recipientUser) {
      // Create a consistent ID by sorting the UIDs
      const id = currentUser.uid > recipientUser.uid
        ? `${currentUser.uid}_${recipientUser.uid}`
        : `${recipientUser.uid}_${currentUser.uid}`;
      setChatRoomId(id);
    }
  }, [currentUser, recipientUser]);

  // 3. Listen for messages *only* when we have a chatRoomId
  useEffect(() => {
    if (chatRoomId) {
      // Create a reference to the sub-collection
      const messagesRef = collection(doc(db, 'chatRooms', chatRoomId), 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'asc'), limit(50)); 

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs = [];
        querySnapshot.forEach((doc) => {
          msgs.push({ ...doc.data(), id: doc.id });
        });
        setMessages(msgs);
      });

      return () => unsubscribe();
    }
  }, [chatRoomId]); // Re-run when the chatRoomId changes

  // Scroll to bottom
  useEffect(() => {
    scrollDummy.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 4. Show an intro screen if no user is selected
  if (!recipientUser) {
    return (
      <div className="flex flex-col h-full">
        <ChatHeader recipientUser={null} />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-400">
            Select a user from the list to start chatting.
          </p>
        </div>
      </div>
    );
  }

  // 5. Render the chat for the selected user
  return (
    <div className="flex flex-col h-full">
      <ChatHeader recipientUser={recipientUser} />

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        <div ref={scrollDummy}></div>
      </div>

      {/* 6. Pass the chatRoomId to the SendMessage component */}
      <SendMessage chatRoomId={chatRoomId} />
    </div>
  );
}

export default ChatRoom;