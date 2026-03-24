import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { Loader2, Calculator } from "lucide-react";

interface LoginProps {
  onLogin: (uid: string, displayName: string, gradeLevel: number) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [gradeLevel, setGradeLevel] = useState<number>(3);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        onLogin(result.user.uid, result.user.displayName || "Student", gradeLevel);
      }
    } catch (error) {
      console.error("Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F4EBD0] relative overflow-hidden">
      <div className="retro-box p-8 max-w-md w-full bg-[#FFF9E6] relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-32 h-32 bg-[#E52521] border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mb-6 transform -rotate-3 overflow-hidden">
            <Calculator className="w-16 h-16" strokeWidth={2.5} />
          </div>
          <h1 className="text-5xl font-bangers text-black mb-2 tracking-wide drop-shadow-[2px_2px_0px_#fff]">Tiny Euler</h1>
          <p className="text-black font-bold text-lg">Step right up for some math fun!</p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-xl font-bangers text-black mb-3 tracking-wider text-center">Select Your Grade</label>
            <div className="grid grid-cols-3 gap-4">
              {[3, 4, 5].map((grade) => (
                <button
                  key={grade}
                  onClick={() => setGradeLevel(grade)}
                  className={`py-3 font-bangers text-2xl tracking-wider retro-btn ${
                    gradeLevel === grade
                      ? "bg-[#0496FF] text-white"
                      : "bg-white text-black"
                  }`}
                >
                  Grade {grade}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-4 bg-[#FFD166] text-black font-bangers text-2xl tracking-wider retro-btn flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin" strokeWidth={3} />
            ) : (
              "Sign in with Google!"
            )}
          </button>
        </div>

        <p className="mt-8 text-center text-sm font-bold text-black/70">
          Securely sign in to track your progress and earn badges!
        </p>
      </div>
    </div>
  );
}
