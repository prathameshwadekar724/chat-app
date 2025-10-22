import React from 'react';

function ChatHeader({ recipientUser }) {
  
  if (!recipientUser) {
    return (
      <div className="flex items-center p-4 bg-gray-800 border-b border-gray-700 shadow-md h-16 shrink-0">
        <h2 className="text-lg font-semibold text-white">Select a user to chat</h2>
      </div>
    );
  }

  return (
    <div className="flex items-center p-4 bg-gray-800 border-b border-gray-700 shadow-md h-16 shrink-0">
      <img
        className="w-10 h-10 bg-blue-500 rounded-full object-cover mr-3 shrink-0"
        src={recipientUser.photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'}
        alt="Recipient avatar"
      />
      <div>
        <h2 className="text-lg font-semibold text-white">
          {recipientUser.displayName}
        </h2>
        <p className="text-sm text-gray-400">
          Online
        </p>
      </div>
    </div>
  );
}

export default ChatHeader;