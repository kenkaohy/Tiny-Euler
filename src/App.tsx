import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";
import { Student, MathTask, GradingResult } from "./types";
import { getStudent, createStudent, recordSession } from "./services/studentService";
import { generateMathTask, gradeExplanation } from "./services/geminiService";
import Dashboard from "./components/Dashboard";
import PerformanceTask from "./components/PerformanceTask";
import Login from "./components/Login";
import { LogOut, Calculator } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [currentTask, setCurrentTask] = useState<MathTask | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const studentData = await getStudent(firebaseUser.uid);
        setStudent(studentData);
      } else {
        setStudent(null);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (uid: string, displayName: string, gradeLevel: number) => {
    let studentData = await getStudent(uid);
    if (!studentData) {
      studentData = await createStudent(uid, displayName, gradeLevel);
    }
    setStudent(studentData);
  };

  const handleSelectTopic = async (topic: string) => {
    if (!student) return;
    setIsGenerating(true);
    setCurrentTopic(topic);
    try {
      const task = await generateMathTask(
        student.gradeLevel,
        student.topicLevels
      );
      setCurrentTask(task);
    } catch (error) {
      console.error("Error generating task:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitTask = async (
    answers: Record<string, string | number>,
    results: Record<string, GradingResult>
  ) => {
    if (!student || !currentTask || !currentTopic) return;
    setIsSubmitting(true);
    try {
      const topicScores: Record<string, { correct: number, total: number }> = {
        "fractions": { correct: 0, total: 0 },
        "multiplication": { correct: 0, total: 0 },
        "geometry": { correct: 0, total: 0 },
        "word problems": { correct: 0, total: 0 }
      };

      for (const q of currentTask.questions) {
        const topic = q.topic.toLowerCase();
        
        if (!topicScores[topic]) {
          topicScores[topic] = { correct: 0, total: 0 };
        }
        topicScores[topic].total++;
        if (results[q.id]?.isCorrect) {
          topicScores[topic].correct++;
        }
      }

      // Record session and update levels
      await recordSession(student.uid, topicScores);
      
      // Refresh student data
      const updatedStudent = await getStudent(student.uid);
      setStudent(updatedStudent);

      // Return to dashboard
      setCurrentTask(null);
      setCurrentTopic(null);

    } catch (error) {
      console.error("Error submitting task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentTask(null);
    setCurrentTopic(null);
  };

  if (!isAuthReady) {
    return (
      <div className="fixed inset-0 w-full h-full bg-black z-50">
        <video 
          src="/Cow_Cooking_Video_Generation.mp4" 
          autoPlay 
          loop 
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <p className="text-white font-bangers text-6xl tracking-wider drop-shadow-[4px_4px_0px_#000]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !student) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#F4EBD0]">
      {/* Header */}
      <header className="bg-white border-b-4 border-black sticky top-0 z-10 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#E52521] border-4 border-black rounded-xl flex items-center justify-center text-white transform -rotate-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <Calculator className="w-7 h-7" strokeWidth={2.5} />
            </div>
            <span className="font-bangers text-black text-4xl tracking-wider drop-shadow-[1px_1px_0px_#fff]">Tiny Euler</span>
          </div>
          <button
            onClick={() => auth.signOut()}
            className="flex items-center text-black font-bold hover:text-[#E52521] transition-colors bg-gray-100 border-2 border-black px-4 py-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none"
          >
            <LogOut className="w-5 h-5 mr-2" strokeWidth={3} />
            Sign Out
          </button>
        </div>
      </header>

      {isGenerating ? (
        <div className="fixed inset-0 w-full h-full bg-black z-50">
          <video 
            src="/Cow_Cooking_Video_Generation.mp4" 
            autoPlay 
            loop 
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <p className="text-white font-bangers text-6xl tracking-wider drop-shadow-[4px_4px_0px_#000]">Cooking up a mission...</p>
          </div>
        </div>
      ) : currentTask ? (
        <PerformanceTask
          task={currentTask}
          onBack={handleBack}
          onSubmit={handleSubmitTask}
          isSubmitting={isSubmitting}
          studentGradeLevel={student.gradeLevel}
        />
      ) : (
        <Dashboard student={student} onSelectTopic={handleSelectTopic} />
      )}
    </div>
  );
}
