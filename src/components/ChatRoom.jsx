import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc 
} from 'firebase/firestore';

import Message from './Message';
import SendMessage from './SendMessage';
import ChatHeader from './ChatHeader';

function ChatRoom({ currentUser, recipientUser }) {
  const [messages, setMessages] = useState([]);
  const scrollDummy = useRef(); 
  const [chatRoomId, setChatRoomId] = useState(null);

  useEffect(() => {
    if (currentUser && recipientUser) {
      const id = currentUser.uid > recipientUser.uid
        ? `${currentUser.uid}_${recipientUser.uid}`
        : `${recipientUser.uid}_${currentUser.uid}`;
      setChatRoomId(id);
    }
  }, [currentUser, recipientUser]);

  useEffect(() => {
    if (chatRoomId) {
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
  }, [chatRoomId]); 

  useEffect(() => {
    scrollDummy.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  return (
    <div className="flex flex-col h-full">
      <ChatHeader recipientUser={recipientUser} />

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        <div ref={scrollDummy}></div>
      </div>

      <SendMessage chatRoomId={chatRoomId} />
    </div>
  );
}

export default ChatRoom;