import React from 'react';
import { auth } from '../firebaseConfig';

function Message({ message }) {
  const { text, uid, photoURL, displayName } = message;

  // Check if the message is from the currently signed-in user
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
  // Dynamic classes for styling
  const containerClass = messageClass === 'sent' 
    ? 'flex flex-row-reverse' 
    : 'flex';
  
  const bubbleClass = messageClass === 'sent' 
    ? 'bg-blue-600 text-white rounded-l-lg rounded-br-lg' 
    : 'bg-gray-700 text-white rounded-r-lg rounded-bl-lg';

  const avatarMargin = messageClass === 'sent' ? 'ml-2' : 'mr-2';

  return (
    <div className={`p-2 ${containerClass}`}>
      <img
        className={`w-8 h-8 rounded-full object-cover ${avatarMargin}`}
        src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'}
        alt="User Avatar"
      />
      
      <div className={`flex flex-col max-w-xs ${messageClass === 'sent' ? 'items-end' : 'items-start'}`}>
        
        {/* Only show name on *received* messages */}
        {messageClass === 'received' && (
          <p className="text-xs text-gray-400 mb-1 px-1">
            {displayName || 'Anonymous User'}
          </p>
        )}

        {/* Text Bubble */}
        <div className={`p-2 px-4 ${bubbleClass} shadow`}>
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
}

export default Message;