import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({ projectId: "test" });
const db = getFirestore(app, "ai-studio-d90bfbd8-7261-4a25-888e-02d22e531a41");
console.log("db is:", typeof db, db ? "defined" : "undefined");
