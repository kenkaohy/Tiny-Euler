import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { Student, CAASPPLevel, PracticeSession } from "../types";

console.log("db in studentService:", db);

const LEVELS: CAASPPLevel[] = [
  "Challenger",
  "Duelist",
  "Elite",
  "Gladiator"
];

export async function getStudent(uid: string): Promise<Student | null> {
  const docRef = doc(db, "students", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { uid, ...docSnap.data() } as Student;
  }
  return null;
}

export async function createStudent(uid: string, displayName: string, gradeLevel: number): Promise<Student> {
  const student: Omit<Student, 'uid'> = {
    displayName,
    gradeLevel,
    overallCAASPPLevel: "Challenger",
    topicLevels: {
      "fractions": "Challenger",
      "multiplication": "Challenger",
      "geometry": "Challenger",
      "word problems": "Challenger"
    }
  };
  await setDoc(doc(db, "students", uid), student);
  return { uid, ...student };
}

export async function recordSession(
  uid: string, 
  topicScores: Record<string, { correct: number, total: number }>
): Promise<void> {
  const student = await getStudent(uid);
  if (!student) throw new Error("Student not found");

  const sessionsRef = collection(db, "students", uid, "practice_sessions");
  const newTopicLevels = { ...student.topicLevels };
  let levelChanged = false;

  for (const [topic, scoreData] of Object.entries(topicScores)) {
    // Get last session for this topic
    const q = query(
      sessionsRef, 
      orderBy("timestamp", "desc"), 
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    const lastSessions = querySnapshot.docs
      .map(d => d.data() as PracticeSession)
      .filter(s => s.topic === topic);

    let adjustment: "Promoted" | "Demoted" | "Maintained" = "Maintained";
    const currentLevel = student.topicLevels[topic] || "Challenger";
    const levelIndex = LEVELS.indexOf(currentLevel);
    
    const percentage = scoreData.correct / scoreData.total;

    // Promotion logic: > 80% twice
    if (percentage >= 0.8 && lastSessions.length > 0 && (lastSessions[0].sessionScore / 8) >= 0.8) {
      if (levelIndex < LEVELS.length - 1) {
        adjustment = "Promoted";
        levelChanged = true;
      }
    } 
    // Demotion logic: < 40% twice
    else if (percentage <= 0.4 && lastSessions.length > 0 && (lastSessions[0].sessionScore / 8) <= 0.4) {
      if (levelIndex > 0) {
        adjustment = "Demoted";
        levelChanged = true;
      }
    }

    // Update Firestore for this topic session
    await addDoc(sessionsRef, {
      timestamp: Timestamp.now(),
      topic,
      sessionScore: scoreData.correct,
      totalQuestions: scoreData.total,
      levelAdjustment: adjustment
    });

    if (adjustment !== "Maintained") {
      newTopicLevels[topic] = adjustment === "Promoted" ? LEVELS[levelIndex + 1] : LEVELS[levelIndex - 1];
    }
  }

  if (levelChanged) {
    const totalIndex = Object.values(newTopicLevels).reduce((acc, lvl) => acc + LEVELS.indexOf(lvl), 0);
    const avgIndex = Math.round(totalIndex / Object.keys(newTopicLevels).length);
    const newOverallLevel = LEVELS[avgIndex];

    await updateDoc(doc(db, "students", uid), {
      topicLevels: newTopicLevels,
      overallCAASPPLevel: newOverallLevel
    });
  }
}
