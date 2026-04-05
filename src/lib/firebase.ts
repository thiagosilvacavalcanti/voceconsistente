import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Note: In a real app, these would be in environment variables
// For this demo, we'll use placeholders or the user's config if available
const firebaseConfig = {
  apiKey: "AIzaSyDummyKey",
  authDomain: "voce-consistente.firebaseapp.com",
  projectId: "voce-consistente",
  storageBucket: "voce-consistente.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
