import React, { useState } from 'react';
import { auth, provider } from '../firebaseConfig';
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

function SignIn() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .catch((err) => setError(err.message));
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(''); 

    if (isRegistering) {
      // --- Register ---
      if (!displayName) {
        setError('Please enter a display name.');
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: displayName });
      } catch (err) {
        setError(err.message);
      }
    } else {
      // --- Sign In ---
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto p-4">
      <div className="w-full bg-gray-800 rounded-lg shadow-xl p-8">
        {/* --- Tabs --- */}
        <div className="flex border-b border-gray-600 mb-6">
          <button 
            onClick={() => setIsRegistering(false)}
            className={`flex-1 py-2 text-center font-semibold ${!isRegistering ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          >
            Sign In
          </button>
          <button 
            onClick={() => setIsRegistering(true)}
            className={`flex-1 py-2 text-center font-semibold ${isRegistering ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          >
            Register
          </button>
        </div>

        {/* --- Email/Pass Form --- */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isRegistering && (
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display Name"
              required
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition duration-300"
          >
            {isRegistering ? 'Register' : 'Sign In'}
          </button>
        </form>

        {/* --- Divider --- */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="px-4 text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* --- Google Sign-In --- */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-lg transition duration-300 flex items-center justify-center hover:bg-gray-200"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="w-5 h-5 mr-3" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default SignIn;