import React, { useState } from 'react';
import { Calendar, BookOpen, CheckSquare, Save, Download, Terminal, Database, Cpu, BarChart2 } from 'lucide-react';

export default function JanPrepTracker() {
  // State management for user input and completion tracking
  const [weeklyHours, setWeeklyHours] = useState(15);
  const [completedPhases, setCompletedPhases] = useState({});

  // Curriculum data mapping your goals to January
  const phases = [
    {
      id: 'bash',
      title: 'Phase 1: Bash & The CLI',
      duration: 'Weeks 1-3',
      icon: <Terminal className="w-5 h-5 text-blue-500" />,
      skills: ['Terminal navigation', 'File manipulation', 'Shell scripting', 'Automation basics']
    },
    {
      id: 'python_data',
      title: 'Phase 2: Python Fundamentals & Data',
      duration: 'Weeks 4-8',
      icon: <BarChart2 className="w-5 h-5 text-green-500" />,
      skills: ['Data structures & logic', 'Functions & OOP', 'NumPy & Pandas', 'Data cleanup & analysis']
    },
    {
      id: 'backend',
      title: 'Phase 3: Backends & Databases',
      duration: 'Weeks 9-12',
      icon: <Database className="w-5 h-5 text-purple-500" />,
      skills: ['FastAPI / Flask routing', 'REST APIs', 'SQL / Database integration', 'Authentication basics']
    },
    {
      id: 'simulations',
      title: 'Phase 4: Simulations & Capstones',
      duration: 'Weeks 13-16',
      icon: <Cpu className="w-5 h-5 text-orange-500" />,
      skills: ['Pygame/Matplotlib mechanics', 'Algorithm visualization', 'State engines', 'Full project deployment']
    }
  ];

  // Dynamic calculations based on your input
  const dailyHours7Day = (weeklyHours / 7).toFixed(1);
  const dailyHours5Day = (weeklyHours / 5).toFixed(1);
  const totalHoursTrained = weeklyHours * 16; // 16 weeks total until January

  // Calculate completion percentage
  const totalPhases = phases.length;
  const completedCount = Object.values(completedPhases).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalPhases) * 100);

  // Toggle checklist items
  const togglePhase = (id) => {
    setCompletedPhases(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Export data function
  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ weeklyHours, completedPhases }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "jan_prep_progress.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-md font-sans">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-600" />
          Jan-Prep Progress Tracker & Blueprint
        </h1>
        <p className="text-gray-600 text-sm">Fast-tracked curriculum to master backend engineering and simulations.</p>
      </div>

      {/* Calculator Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Weekly Target Hours</label>
          <input 
            type="number" 
            value={weeklyHours} 
            onChange={(e) => setWeeklyHours(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-800"
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Daily Breakdown</span>
          <p className="text-sm text-gray-700"><span className="font-bold text-indigo-600">{dailyHours7Day} hrs</span>/day (7-day week)</p>
          <p className="text-sm text-gray-700"><span className="font-bold text-indigo-600">{dailyHours5Day} hrs</span>/day (5-day week)</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Course Hours</span>
          <p className="text-xl font-extrabold text-gray-800">{totalHoursTrained} Hours</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-700">Overall Syllabus Progress</span>
          <span className="text-sm font-bold text-indigo-600">{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Curriculum Phases */}
      <div className="space-y-4 mb-6">
        {phases.map((phase) => (
          <div 
            key={phase.id} 
            className={`p-4 rounded-lg border transition-all ${completedPhases[phase.id] ? 'bg-green-50/50 border-green-200' : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {phase.icon}
                <div>
                  <h3 className={`font-bold ${completedPhases[phase.id] ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{phase.title}</h3>
                  <span className="text-xs text-gray-400 font-medium">{phase.duration}</span>
                </div>
              </div>
              <button 
                onClick={() => togglePhase(phase.id)}
                className={`p-1.5 rounded-md border flex items-center justify-center transition-colors ${completedPhases[phase.id] ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300 hover:border-gray-400 text-transparent'}`}
              >
                <CheckSquare className="w-4 h-4 text-current" />
              </button>
            </div>
            
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-8 list-disc text-sm text-gray-600">
              {phase.skills.map((skill, index) => (
                <li key={index} className={completedPhases[phase.id] ? 'text-gray-400 line-through' : ''}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-end border-t border-gray-200 pt-4">
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          <Save className="w-4 h-4" /> Save Progress
        </button>
        <button onClick={exportData} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium text-white shadow-sm transition-colors">
          <Download className="w-4 h-4" /> Export Blueprint
        </button>
      </div>
    </div>
  );
}