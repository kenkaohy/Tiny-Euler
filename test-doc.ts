import { initializeApp } from "firebase/app";
import { getFirestore, doc } from "firebase/firestore";

const app = initializeApp({ projectId: "test" });
const db = getFirestore(app);

try {
  doc(db, "students", undefined as any);
} catch (e) {
  console.log("Error 1:", e.message);
}

try {
  doc(undefined as any, "students", "123");
} catch (e) {
  console.log("Error 2:", e.message);
}
