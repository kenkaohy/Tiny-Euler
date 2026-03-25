import React, { useState, useEffect } from "react";
import { MathTask, GradingResult } from "../types";
import { ArrowLeft, Send, CheckCircle2, XCircle, ArrowRight, Flag } from "lucide-react";
import { gradeExplanation } from "../services/geminiService";
import { motion, AnimatePresence } from "motion/react";

interface PerformanceTaskProps {
  task: MathTask;
  onBack: () => void;
  onSubmit: (answers: Record<string, string | number>, results: Record<string, GradingResult>) => Promise<void>;
  isSubmitting: boolean;
  studentGradeLevel: number;
}

export default function PerformanceTask({ task, onBack, onSubmit, isSubmitting, studentGradeLevel }: PerformanceTaskProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [results, setResults] = useState<Record<string, GradingResult>>({});
  const [isGrading, setIsGrading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem("performanceTask_state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.results) setResults(parsed.results);
        if (parsed.currentQuestionIndex !== undefined) setCurrentQuestionIndex(parsed.currentQuestionIndex);
      } catch (e) {
        console.error("Error parsing saved state:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("performanceTask_state", JSON.stringify({
        answers,
        results,
        currentQuestionIndex
      }));
    }
  }, [answers, results, currentQuestionIndex, isLoaded]);

  const q = task.questions[currentQuestionIndex];
  const hasAnsweredCurrent = answers[q.id] !== undefined && answers[q.id] !== "";
  const currentResult = results[q.id];

  const handleAnswerChange = (value: string | number) => {
    if (currentResult) return; // Prevent changing answer after submission
    setAnswers(prev => ({ ...prev, [q.id]: value }));
  };

  const handleSingleSubmit = async () => {
    if (!hasAnsweredCurrent || currentResult || isGrading) return;

    setIsGrading(true);
    try {
      let result: GradingResult;
      if (q.type === "explanation") {
        result = await gradeExplanation(q.text, String(answers[q.id]), studentGradeLevel);
      } else {
        const isCorrect = String(answers[q.id]) === String(q.correctAnswer);
        result = {
          isCorrect,
          coachFeedback: isCorrect ? "Bingo! You nailed it!" : "Hmm, let's try a different trick next time."
        };
      }
      setResults(prev => ({ ...prev, [q.id]: result }));
    } catch (error) {
      console.error("Error grading:", error);
    } finally {
      setIsGrading(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < task.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      localStorage.removeItem("performanceTask_state");
      onSubmit(answers, results);
    }
  };

  const progressPercentage = Math.round(((currentQuestionIndex) / task.questions.length) * 100);

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-[#F4EBD0] overflow-y-auto p-4 md:p-8">
      {(isGrading || isSubmitting) && (
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
            <p className="text-white font-bangers text-6xl tracking-wider drop-shadow-[4px_4px_0px_#000]">
              {isGrading ? "Checking answer..." : "Submitting task..."}
            </p>
          </div>
        </div>
      )}
      <div className="w-full max-w-3xl mx-auto flex flex-col">
        {/* Header / Back Button */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-black font-bold hover:-translate-x-1 transition-transform bg-white border-2 border-black px-4 py-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={3} />
            Back to Map
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 w-full">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bangers text-xl text-black tracking-wider">
              Mission Progress
            </span>
            <span className="font-bold text-black">
              {currentQuestionIndex + 1} / {task.questions.length} ({progressPercentage}%)
            </span>
          </div>
          <div className="h-4 border-2 border-black bg-white rounded-full overflow-hidden shadow-[inset_0px_2px_0px_rgba(0,0,0,0.1)]">
            <motion.div 
              className="h-full bg-[#0496FF] border-r-2 border-black"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        <div className="flex-1 w-full relative pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
              className="retro-box p-8 relative bg-white"
            >
              <div className="absolute -top-6 -left-6 w-14 h-14 bg-[#E52521] border-4 border-black rounded-full flex items-center justify-center text-white font-bangers text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-6">
                {currentQuestionIndex + 1}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 mt-2 gap-4">
                <h3 className="text-2xl font-bold text-black flex-1">{q.text}</h3>
                <span className="px-3 py-1 bg-[#FFD166] border-2 border-black rounded-lg text-sm font-bold capitalize shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap self-start">
                  {q.topic}
                </span>
              </div>

              {q.type === "calculation" && q.options && (
                <div className="space-y-4">
                  {q.options.map((opt) => (
                    <motion.label
                      whileHover={!currentResult ? { scale: 1.02 } : {}}
                      whileTap={!currentResult ? { scale: 0.98 } : {}}
                      key={opt}
                      className={`flex items-center p-4 rounded-xl border-4 cursor-pointer transition-colors ${
                        answers[q.id] === opt
                          ? "border-black bg-[#FFD166] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                          : "border-black bg-white hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      } ${currentResult ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        disabled={!!currentResult}
                        className="w-6 h-6 text-[#E52521] border-4 border-black focus:ring-black"
                      />
                      <span className="ml-4 font-bold text-xl text-black">{opt}</span>
                    </motion.label>
                  ))}
                </div>
              )}

              {q.type === "multi-step" && (
                <div className="mt-6">
                  <input
                    type="number"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    disabled={!!currentResult}
                    placeholder="Type your number..."
                    className="w-full p-4 retro-input font-bold text-xl disabled:opacity-70 focus:outline-none focus:ring-4 focus:ring-[#0496FF]/50"
                  />
                </div>
              )}

              {q.type === "explanation" && (
                <div className="mt-6">
                  <textarea
                    value={answers[q.id] || ""}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    disabled={!!currentResult}
                    placeholder="Tell me how you solved it..."
                    rows={4}
                    className="w-full p-4 retro-input font-bold text-lg resize-none disabled:opacity-70 focus:outline-none focus:ring-4 focus:ring-[#0496FF]/50"
                  />
                </div>
              )}

              <AnimatePresence>
                {currentResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`mt-8 p-6 border-4 border-black rounded-2xl flex items-start space-x-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                      currentResult.isCorrect ? "bg-[#06D6A0]" : "bg-[#FFD166]"
                    }`}
                  >
                    {currentResult.isCorrect ? (
                      <CheckCircle2 className="w-8 h-8 text-black flex-shrink-0" strokeWidth={3} />
                    ) : (
                      <XCircle className="w-8 h-8 text-black flex-shrink-0" strokeWidth={3} />
                    )}
                    <div>
                      <p className="font-bangers text-2xl tracking-wider text-black mb-1">Coach says:</p>
                      <p className="font-bold text-black/80 text-lg">{currentResult.coachFeedback}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          <motion.div 
            className="mt-8"
            layout
          >
            {!currentResult ? (
              <motion.button
                whileHover={hasAnsweredCurrent && !isGrading ? { scale: 1.02 } : {}}
                whileTap={hasAnsweredCurrent && !isGrading ? { scale: 0.98 } : {}}
                onClick={handleSingleSubmit}
                disabled={!hasAnsweredCurrent || isGrading}
                className="w-full py-6 bg-[#0496FF] text-white font-bangers text-4xl tracking-wider retro-btn flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGrading ? (
                  "Checking..."
                ) : (
                  <>
                    <Send className="w-8 h-8 mr-4" strokeWidth={3} />
                    Submit Answer
                  </>
                )}
              </motion.button>
            ) : (
              <motion.button
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                onClick={handleNext}
                disabled={isSubmitting}
                className="w-full py-6 bg-[#06D6A0] text-black font-bangers text-4xl tracking-wider retro-btn flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Finishing..."
                ) : currentQuestionIndex < task.questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="w-8 h-8 ml-4" strokeWidth={3} />
                  </>
                ) : (
                  <>
                    <Flag className="w-8 h-8 mr-4" strokeWidth={3} />
                    Finish Task!
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

