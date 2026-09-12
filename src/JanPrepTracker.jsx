import React, { useEffect, useState } from 'react';
import { Calendar, CheckSquare, Save, Download, Terminal, Database, Cpu, BarChart2, Timer, Play, CheckCircle } from 'lucide-react';

const loadSaved = () => {
  try {
    return JSON.parse(localStorage.getItem('janprep_state') || '{}');
  } catch {
    return {};
  }
};

const saved = loadSaved();

export default function JanPrepTracker() {
  // State management for user input and completion tracking
  const [weeklyHours, setWeeklyHours] = useState(saved.weeklyHours ?? 15);
  const [completedPhases, setCompletedPhases] = useState(saved.completedPhases ?? {});
  const [startedAt, setStartedAt] = useState(saved.startedAt ?? null);
  const [now, setNow] = useState(Date.now);
  const [saveMsg, setSaveMsg] = useState('');

  // Tick the clock every second while a session is running
  useEffect(() => {
    if (startedAt == null) return;
    const tick = () => setNow(Date.now());
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [startedAt]);

  const elapsedSec = startedAt == null ? 0 : Math.max(0, Math.floor((now - startedAt) / 1000));
  const fmtDur = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return [h, m, sec].map((n) => String(n).padStart(2, '0')).join(':');
  };
  const startedTimeLabel = startedAt ? new Date(startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '';

  const COURSE_WEEKS = 16;
  const finishBase = startedAt != null ? startedAt : now;
  const expectedFinish = new Date(finishBase + COURSE_WEEKS * 7 * 24 * 60 * 60 * 1000);
  const finishLabel = expectedFinish.toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const daysRemaining = startedAt != null ? Math.max(0, Math.ceil((expectedFinish - now) / 86400000)) : COURSE_WEEKS * 7;

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

  // Persist state to localStorage
  const persist = (state) => {
    try {
      localStorage.setItem('janprep_state', JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  };

  // Save Progress button — persists everything
  const saveProgress = () => {
    setSaveMsg(persist({ weeklyHours, completedPhases, startedAt }) ? 'Saved ✓' : 'Save failed');
    setTimeout(() => setSaveMsg(''), 1600);
  };

  // Start button — records the exact moment of the click, then locks in
  const startSession = () => {
    if (startedAt != null) return;
    const t = Date.now();
    setStartedAt(t);
    setNow(t);
    persist({ weeklyHours, completedPhases, startedAt: t });
  };

  // Export data function
  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ weeklyHours, completedPhases, startedAt }));
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

      {/* Session Timer */}
      <div className="bg-indigo-600 text-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Timer className="w-6 h-6" />
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200 block">Session Timer</span>
            <p className={`text-3xl font-extrabold font-mono tabular-nums leading-tight ${startedAt ? '' : 'text-indigo-200'}`}>
              {startedAt ? fmtDur(elapsedSec) : '00:00:00'}
            </p>
            {startedAt && <p className="text-xs text-indigo-200">Started at {startedTimeLabel} — click ✔ locks the start time</p>}
            {!startedAt && <p className="text-xs text-indigo-200">Click Start when you begin. The clock counts from that exact moment.</p>}
            <p className="text-xs text-indigo-100 font-semibold mt-1">Expected finish: {finishLabel} ({daysRemaining} days left)</p>
          </div>
        </div>
        <button
          onClick={startSession}
          disabled={startedAt != null}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-bold transition-colors ${startedAt ? 'bg-indigo-800/60 text-indigo-200 cursor-not-allowed' : 'bg-white text-indigo-700 hover:bg-indigo-50 shadow-sm active:scale-95'}`}
          title={startedAt ? 'Already started' : 'Start the session clock'}
        >
          {startedAt ? <><CheckCircle className="w-4 h-4" /> Started</> : <><Play className="w-4 h-4" /> Start</>}
        </button>
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
      <div className="flex flex-wrap gap-3 justify-end items-center border-t border-gray-200 pt-4">
        {saveMsg && <span className="text-sm font-medium text-green-600 mr-1">{saveMsg}</span>}
        <button onClick={saveProgress} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          <Save className="w-4 h-4" /> Save Progress
        </button>
        <button onClick={exportData} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium text-white shadow-sm transition-colors">
          <Download className="w-4 h-4" /> Export Blueprint
        </button>
      </div>
    </div>
  );
}