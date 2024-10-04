import { Clipboard, List, Unlock } from "lucide-react";
import { useState } from "react";
import { ExamList } from "../ExamesList";
import { ExamesToPerform } from "../ExamesToPerform";
import { ExamesToRelease } from "../ExamesToRelease";

export const ExamesPage = () => {
  const [activeTab, setActiveTab] = useState("to-perform");

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 p-4">
        <nav className="flex space-x-4">
          <div
            onClick={() => setActiveTab("to-perform")}
            className="flex items-center text-purple-700 hover:text-purple-900 cursor-pointer"
          >
            <Clipboard className="w-5 h-5 mr-2" />
            Exames a realizar
          </div>
          <div
            onClick={() => setActiveTab("to-release")}
            className="flex items-center text-purple-700 hover:text-purple-900 cursor-pointer"
          >
            <Unlock className="w-5 h-5 mr-2" />
            Exames a liberar
          </div>
          <div
            onClick={() => setActiveTab("listagem")}
            className="flex items-center text-purple-700 hover:text-purple-900 cursor-pointer"
          >
            <List className="w-5 h-5 mr-2" />
            Listagem de exames
          </div>
        </nav>
      </header>
      {activeTab === "to-perform" && <ExamesToPerform />}
      {activeTab === "to-release" && <ExamesToRelease />}
      {activeTab === "listagem" && <ExamList />}
    </div>
  );
};
