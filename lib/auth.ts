import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyf8KOi8BPk7EcotF2_YZL44pKmZcrWn0",
  authDomain: "medinutri-ai.firebaseapp.com",
  projectId: "medinutri-ai",
  storageBucket: "medinutri-ai.firebasestorage.app",
  messagingSenderId: "131617888133",
  appId: "1:131617888133:web:b089a0e44d59e2dc4a16ec"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);