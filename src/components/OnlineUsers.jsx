import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query } from 'firebase/firestore';

function OnlineUsers({ currentUser, onUserSelect, selectedUserId }) {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const presenceRef = collection(db, 'presence');
    const q = query(presenceRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().uid !== currentUser.uid) {
          users.push(doc.data());
        }
      });
      setOnlineUsers(users);
    });

    return () => unsubscribe();
  }, [currentUser.uid]); 

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-gray-200 border-b border-gray-600 pb-2">
        Online ({onlineUsers.length})
      </h2>
      <ul className="space-y-1">
        {onlineUsers.map((user) => (
          <li 
            key={user.uid} 
            onClick={() => onUserSelect(user)}
            className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
              selectedUserId === user.uid 
                ? 'bg-blue-600' 
                : 'hover:bg-gray-700'
            }`}
          >
            <img
              className="w-8 h-8 rounded-full object-cover mr-3"
              src={user.photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'}
              alt={user.displayName}
            />
            <span className="text-gray-300 truncate">{user.displayName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OnlineUsers;