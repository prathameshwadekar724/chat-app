import React, { useState, useEffect } from 'react'; 
import { auth, db } from './firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, deleteDoc } from 'firebase/firestore'; 

import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import ChatRoom from './components/ChatRoom';
import OnlineUsers from './components/OnlineUsers';

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [selectedUser, setSelectedUser] = useState(null); 

  useEffect(() => {
    if (user) {
      const presenceRef = doc(db, 'presence', user.uid);
      setDoc(presenceRef, {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }).catch(console.error);

      const handleBeforeUnload = (e) => {
        deleteDoc(presenceRef).catch(console.error);
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [user]);

  // 2. New handler to set the selected user
  // We'll pass this function to OnlineUsers
  const handleUserSelect = (userData) => {
    setSelectedUser(userData);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <header className="flex justify-between items-center p-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-blue-400">Realtime Chat</h1>
        {/* Pass user to SignOut to clear selectedUser on logout */}
        {user && <SignOut onSignOut={() => setSelectedUser(null)} />} 
      </header>

      <div className="flex-grow flex flex-row overflow-hidden">
        {/* ... loading and sign-in logic is the same */}
        
        {!user && !loading && (
          <main className="flex-grow">
            <SignIn />
          </main>
        )}

        {user && (
          <>
            {/* 3. Pass user AND the handler to the OnlineUsers sidebar */}
            <aside className="w-64 bg-gray-800 p-4 border-l border-gray-700 overflow-y-auto shrink-0">
              <OnlineUsers 
                currentUser={user} 
                onUserSelect={handleUserSelect}
                selectedUserId={selectedUser?.uid}
              />
            </aside>

            {/* 4. Pass the logged-in user and the selectedUser to the ChatRoom */}
            <main className="flex-grow flex flex-col">
              <ChatRoom 
                currentUser={user} 
                recipientUser={selectedUser} 
              />
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export default App;