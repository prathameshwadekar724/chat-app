import React from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';

function SignOut({ onSignOut }) { // <-- Accept onSignOut prop
  const handleSignOut = async () => {
    try {
      const uid = auth.currentUser.uid;
      await auth.signOut();
      
      const presenceRef = doc(db, 'presence', uid);
      await deleteDoc(presenceRef);
      
      onSignOut(); // <-- Call the function to clear selectedUser

    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow transition duration-300"
    >
      Sign Out
    </button>
  );
}

export default SignOut;