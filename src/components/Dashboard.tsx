import React from "react";
import { Student, CAASPPLevel } from "../types";
import { Smile, Star, ChevronRight } from "lucide-react";
import RankIcon from "./RankIcon";

interface DashboardProps {
  student: Student;
  onSelectTopic: (topic: string) => void;
}

const LEVEL_COLORS: Record<CAASPPLevel, string> = {
  "Challenger": "bg-[#E52521] text-white",
  "Duelist": "bg-[#FFD166] text-black",
  "Elite": "bg-[#06D6A0] text-black",
  "Gladiator": "bg-[#0496FF] text-white"
};

const PROGRESS_WIDTH: Record<CAASPPLevel, string> = {
  "Challenger": "w-1/4",
  "Duelist": "w-1/2",
  "Elite": "w-3/4",
  "Gladiator": "w-full"
};

export default function Dashboard({ student, onSelectTopic }: DashboardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 max-w-7xl mx-auto">
      {/* Left Column: Profile & Progress */}
      <div className="lg:col-span-4 space-y-6">
        <div className="retro-box p-6 bg-[#FFF9E6]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bangers text-black tracking-wider">{student.displayName}</h2>
              <p className="text-black font-bold">Grade {student.gradeLevel} Explorer</p>
            </div>
            <div className="w-24 h-24 flex items-center justify-center transform hover:scale-110 transition-transform">
              <RankIcon level={student.overallCAASPPLevel} className="w-full h-full drop-shadow-xl" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2 items-center">
                <span className="font-bangers text-xl tracking-wider text-black">Overall Level</span>
                <span className={`px-3 py-1 rounded-lg border-2 border-black text-sm font-bold ${LEVEL_COLORS[student.overallCAASPPLevel]}`}>
                  {student.overallCAASPPLevel}
                </span>
              </div>
              <div className="h-6 border-4 border-black bg-white rounded-xl overflow-hidden shadow-[inset_0px_4px_0px_rgba(0,0,0,0.1)]">
                <div className={`h-full bg-[#E52521] border-r-4 border-black transition-all duration-500 ${PROGRESS_WIDTH[student.overallCAASPPLevel]}`} />
              </div>
            </div>

            <div className="pt-6 border-t-4 border-black border-dashed">
              <h3 className="text-2xl font-bangers text-black mb-4 tracking-wider flex items-center">
                <Star className="w-6 h-6 mr-2 fill-[#FFD166] stroke-black stroke-[3]" />
                Topic Mastery
              </h3>
              <div className="space-y-3">
                {Object.entries(student.topicLevels).map(([topic, level]) => (
                  <div key={topic} className="flex justify-between items-center bg-white border-2 border-black p-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center space-x-3">
                      <RankIcon level={level} className="w-8 h-8" />
                      <span className="capitalize font-bold text-black">{topic}</span>
                    </div>
                    <span className={`text-sm font-bold px-2 py-1 rounded border border-black ${LEVEL_COLORS[level]}`}>{level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Topics Grid */}
      <div className="lg:col-span-8 flex flex-col justify-center items-center">
        <h2 className="text-5xl font-bangers text-black mb-8 tracking-wider drop-shadow-[2px_2px_0px_#fff] text-center">Ready for an Epic Adventure?</h2>
        <p className="text-xl font-bold text-black/80 mb-12 text-center max-w-lg">
          Take on 32 challenges across Fractions, Multiplication, Geometry, and Word Problems to prove your mastery!
        </p>
        <button
          onClick={() => onSelectTopic("mixed")}
          className="group retro-btn bg-[#E52521] p-8 text-left flex items-center justify-between w-full max-w-md hover:bg-[#d41b17]"
        >
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white retro-box flex items-center justify-center text-black font-bangers text-4xl transform group-hover:rotate-12 transition-transform">
              🚀
            </div>
            <div>
              <h3 className="font-bangers text-4xl text-white tracking-wider">Start Now!</h3>
              <p className="font-bold text-white/90 text-lg">32 Questions</p>
            </div>
          </div>
          <ChevronRight className="w-12 h-12 text-white group-hover:translate-x-2 transition-transform" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
