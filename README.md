# Tiny Euler 🚀🧮

Tiny Euler is an AI-powered, adaptive math learning platform designed for students in grades 3-5. It generates real-time, personalized math performance tasks based on a student's current mastery level across different topics.

## ✨ Features

*   **Personalized Learning:** Tracks student mastery across four core topics: Fractions, Multiplication, Geometry, and Word Problems.
*   **Dynamic Task Generation:** Uses Google's Gemini AI to generate unique, 32-question "Epic Math Adventures" tailored to the student's specific rank (Challenger, Duelist, Elite, Gladiator) in each topic.
*   **AI-Powered Grading & Coaching:** Evaluates student explanations in real-time and provides guiding "Coach Feedback" without giving away the direct answer.
*   **Rank Progression System:** Gamified leveling system to keep students engaged and motivated.
*   **Retro UI:** A fun, colorful, and kid-friendly interface.
*   **Secure Authentication:** Google Sign-In powered by Firebase.

## 🛠️ Tech Stack

*   **Frontend:** React 18, TypeScript, Vite
*   **Styling:** Tailwind CSS, Lucide React (Icons)
*   **Backend/BaaS:** Firebase (Authentication, Firestore)
*   **AI Integration:** Google Gen AI SDK (`@google/genai` using `gemini-3-flash-preview`)

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   A Firebase Project (with Google Authentication and Firestore enabled)
*   A Google Gemini API Key

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd tiny-euler
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the root directory and add your API keys (see `.env.example` for reference). Note that the Gemini API key is accessed server-side or injected by the environment, while Firebase keys are public to the Vite client:
    ```env
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_firebase_app_id
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```

## 📁 Project Structure

*   `/src/components`: React components (Dashboard, Login, PerformanceTask, etc.)
*   `/src/services`: API and backend integration (Firebase database logic, Gemini AI generation)
*   `/src/types.ts`: TypeScript interfaces and types
*   `/src/firebase.ts`: Firebase initialization and configuration
