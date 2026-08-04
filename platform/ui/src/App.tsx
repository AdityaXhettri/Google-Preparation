import { Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { DSAPatternsPage } from "./pages/DSAPatternsPage";
import { PatternDetailPage } from "./pages/PatternDetailPage";
import { DSAPractice } from "./pages/DSAPractice";
import { SystemDesignPractice } from "./pages/SystemDesignPractice";
import { BehavioralPractice } from "./pages/BehavioralPractice";
import { StudyPage } from "./pages/StudyPage";
import { ChatPage } from "./pages/ChatPage";
import { MockInterview } from "./pages/MockInterview";
import { Settings } from "./pages/Settings";

export default function App() {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dsa" element={<DSAPatternsPage />} />
          <Route path="/dsa/:pattern" element={<PatternDetailPage />} />
          <Route path="/practice/dsa" element={<DSAPractice />} />
          <Route path="/practice/system-design" element={<SystemDesignPractice />} />
          <Route path="/practice/behavioral" element={<BehavioralPractice />} />
          <Route path="/mock" element={<MockInterview />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </main>
    </div>
  );
}