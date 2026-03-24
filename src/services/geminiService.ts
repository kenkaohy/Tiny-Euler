import { GoogleGenAI, Type } from "@google/genai";
import { CAASPPLevel, MathTask, GradingResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateMathTask(
  gradeLevel: number,
  topicLevels: Record<string, CAASPPLevel>
): Promise<MathTask> {
  const topics = ["fractions", "multiplication", "geometry", "word problems"];
  
  // Generate 8 questions per topic in parallel
  const promises = topics.map(async (topic) => {
    const currentLevel = topicLevels[topic] || "Challenger";
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a grade ${gradeLevel} math performance task for the topic "${topic}". 
      The student's current skill level is "${currentLevel}" (where Challenger=Lowest, Duelist=Low-Medium, Elite=Medium-High, Gladiator=Highest). 
      Adjust the difficulty accordingly.
      
      The task should include:
      1. A short, fun scenario.
      2. Exactly 8 progressive questions:
         - A mix of calculation (multiple choice), multi-step (number input), and explanation (text input) questions.
      
      Return the result as a JSON object matching the MathTask interface.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenario: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  topic: { type: Type.STRING, enum: ["fractions", "multiplication", "geometry", "word problems"] },
                  type: { type: Type.STRING, enum: ["calculation", "multi-step", "explanation"] },
                  text: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING }
                },
                required: ["id", "topic", "type", "text"]
              }
            }
          },
          required: ["scenario", "questions"]
        }
      }
    });
    
    return JSON.parse(response.text) as MathTask;
  });

  const results = await Promise.all(promises);
  
  // Combine into one epic task
  const combinedTask: MathTask = {
    scenario: "Welcome to the Epic Math Adventure! You will face challenges across Fractions, Multiplication, Geometry, and Word Problems. " + results.map(r => r.scenario).join(" "),
    questions: results.flatMap((r, topicIndex) => 
      r.questions.map((q, qIndex) => ({
        ...q,
        id: `${topics[topicIndex]}-${q.id}-${qIndex}`
      }))
    )
  };
  
  return combinedTask;
}

export async function gradeExplanation(
  question: string,
  studentAnswer: string,
  gradeLevel: number
): Promise<GradingResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Grade this 3rd-5th grade math explanation.
    Grade Level: ${gradeLevel}
    Question: ${question}
    Student Answer: ${studentAnswer}
    
    Rules:
    - isCorrect: boolean
    - coachFeedback: A short guiding question to help the student improve or think deeper. NEVER give the direct answer.
    
    Return as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isCorrect: { type: Type.BOOLEAN },
          coachFeedback: { type: Type.STRING }
        },
        required: ["isCorrect", "coachFeedback"]
      }
    }
  });

  return JSON.parse(response.text);
}
