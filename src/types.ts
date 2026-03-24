export type CAASPPLevel = "Challenger" | "Duelist" | "Elite" | "Gladiator";

export interface Student {
  uid: string;
  displayName: string;
  gradeLevel: number;
  overallCAASPPLevel: CAASPPLevel;
  topicLevels: Record<string, CAASPPLevel>;
}

export interface PracticeSession {
  timestamp: string;
  topic: string;
  sessionScore: number;
  levelAdjustment: "Promoted" | "Demoted" | "Maintained";
}

export interface MathQuestion {
  id: string;
  topic: string; // e.g., "fractions", "multiplication", "geometry", "word problems"
  type: "calculation" | "multi-step" | "explanation";
  text: string;
  options?: string[]; // For radio buttons
  correctAnswer?: string | number;
}

export interface MathTask {
  scenario: string;
  questions: MathQuestion[];
}

export interface GradingResult {
  isCorrect: boolean;
  coachFeedback: string;
}
