"use client"

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  BarChart2,
  Settings,
  Trophy,
  Flame,
  Check,
  X,
  ChevronRight,
  Droplets,
  Wind
} from 'lucide-react';

/**
 * PoopPal - A Tracker with Duolingo Feel & Flo Colors
 */

// --- Components ---

// Juicy Button Component (Duolingo Style)
const JuicyButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  disabled = false
}) => {
  // Color Schemas (Flo Inspired)
  const variants = {
    primary: {
      bg: 'bg-[#FF8096]', // Flo Pink
      border: 'border-[#D65D73]',
      text: 'text-white',
      hover: 'hover:bg-[#FF94A8]',
    },
    secondary: {
      bg: 'bg-[#A6D8D4]', // Flo Teal
      border: 'border-[#7CB2AE]',
      text: 'text-white',
      hover: 'hover:bg-[#B8E6E2]',
    },
    outline: {
      bg: 'bg-white',
      border: 'border-[#E5E5E5]',
      text: 'text-[#5A5A5A]',
      hover: 'hover:bg-[#F9F9F9]',
    },
    danger: {
      bg: 'bg-[#FFB7B2]', // Soft Red
      border: 'border-[#E08F8A]',
      text: 'text-white',
      hover: 'hover:bg-[#FFC9C5]',
    },
    success: {
      bg: 'bg-[#98DE8F]', // Soft Green
      border: 'border-[#7BC172]',
      text: 'text-white',
      hover: 'hover:bg-[#A9EFA0]',
    }
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm border-b-4',
    md: 'px-6 py-3 text-base border-b-4',
    lg: 'px-8 py-4 text-xl font-bold border-b-[6px]',
    icon: 'p-3 border-b-4 rounded-2xl'
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size] || sizes.md;

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`
        relative 
        transition-all 
        duration-100 
        transform 
        rounded-2xl 
        font-extrabold 
        flex items-center justify-center gap-2
        ${currentVariant.bg} 
        ${currentVariant.border} 
        ${currentVariant.text}
        ${!disabled ? currentVariant.hover : 'opacity-50 cursor-not-allowed'}
        ${!disabled ? 'active:border-b-0 active:translate-y-[4px]' : ''}
        ${fullWidth ? 'w-full' : ''}
        ${currentSize}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// Bristol Scale Card
const StoolTypeCard = ({ type, description, selected, onClick, emoji }) => (
  <div
    onClick={onClick}
    className={`
      cursor-pointer
      relative p-4 rounded-2xl border-2 transition-all duration-200
      flex flex-col items-center gap-2
      ${selected
        ? 'border-[#FF8096] bg-[#FFF0F3] translate-y-[2px]'
        : 'border-gray-200 bg-white hover:border-[#FFB7B2] hover:-translate-y-1 shadow-sm'}
    `}
  >
    <div className="text-4xl filter drop-shadow-sm">{emoji}</div>
    <div className="text-center">
      <div className={`font-bold ${selected ? 'text-[#FF8096]' : 'text-gray-600'}`}>Type {type}</div>
      <div className="text-xs text-gray-400 font-medium leading-tight mt-1">{description}</div>
    </div>
    {selected && (
      <div className="absolute top-2 right-2 bg-[#FF8096] text-white rounded-full p-1">
        <Check size={12} strokeWidth={4} />
      </div>
    )}
  </div>
);

// Stat Card
const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <div className="text-2xl font-black text-gray-700">{value}</div>
      <div className="text-sm font-bold text-gray-400 uppercase tracking-wide">{label}</div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState('dashboard'); // dashboard, log, stats
  const [logs, setLogs] = useState([
    { id: 1, type: 3, date: new Date().toISOString(), notes: "Healthy start!" },
    { id: 2, type: 4, date: new Date(Date.now() - 86400000).toISOString(), notes: "All good." }
  ]);
  const [streak, setStreak] = useState(12);

  // Logging State
  const [selectedType, setSelectedType] = useState(null);
  const [isLogging, setIsLogging] = useState(false);

  // Bristol Scale Data
  const stoolTypes = [
    { type: 1, emoji: '🪨', desc: 'Hard lumps' },
    { type: 2, emoji: '🥜', desc: 'Lumpy sausage' },
    { type: 3, emoji: '🌽', desc: 'Cracked sausage' },
    { type: 4, emoji: '🌭', desc: 'Smooth snake' },
    { type: 5, emoji: '☁️', desc: 'Soft blobs' },
    { type: 6, emoji: '🍦', desc: 'Mushy solids' },
    { type: 7, emoji: '💧', desc: 'Watery' },
  ];

  const handleLog = () => {
    if (!selectedType) return;
    const newLog = {
      id: Date.now(),
      type: selectedType,
      date: new Date().toISOString(),
      notes: ""
    };
    setLogs([newLog, ...logs]);
    setIsLogging(false);
    setSelectedType(null);
    setStreak(prev => prev + 1); // Mock streak logic
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="min-h-screen bg-[#FFF9F9] font-sans text-slate-800 flex justify-center">
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-[#FFF9F9] min-h-screen flex flex-col shadow-2xl relative overflow-hidden">

        {/* Header */}
        <header className="px-6 py-4 flex justify-between items-center bg-white border-b border-gray-100 z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <div className="bg-[#FF8096] p-2 rounded-xl">
              <span className="text-xl">💩</span>
            </div>
            <h1 className="text-xl font-extrabold text-gray-700 tracking-tight">PoopPal</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Flame className="text-orange-400 fill-orange-400" size={20} />
              <span className="font-extrabold text-orange-400">{streak}</span>
            </div>
            <div className="bg-[#FF8096] w-8 h-8 rounded-full border-2 border-[#D65D73]"></div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 pb-24 space-y-8">

          {/* Greeting */}
          <section>
            <h2 className="text-3xl font-black text-gray-700 mb-2">Hello, User!</h2>
            <p className="text-gray-400 font-bold">Time to listen to your body.</p>
          </section>

          {/* Stats Row */}
          <section className="grid grid-cols-2 gap-4">
            <StatCard
              icon={Check}
              value={logs.filter(l => new Date(l.date).getDate() === new Date().getDate()).length}
              label="Today"
              color="bg-[#A6D8D4]"
            />
            <StatCard
              icon={Calendar}
              value={logs.length}
              label="Total"
              color="bg-[#FFB7B2]"
            />
          </section>

          {/* Main Action - The "Juicy" Interaction */}
          <section className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-sm flex flex-col items-center gap-6 text-center">
            <div className="w-24 h-24 bg-[#FFF0F3] rounded-full flex items-center justify-center mb-2">
              <span className="text-5xl">🚽</span>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-gray-700">Track your movement</h3>
              <p className="text-gray-400 font-medium text-sm mt-1">Keep your streak alive and track your health.</p>
            </div>
            <JuicyButton
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setIsLogging(true)}
              className="animate-pulse-slow"
            >
              LOG NOW
            </JuicyButton>
          </section>

          {/* Recent History */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-gray-700">Recent Logs</h3>
              <button className="text-[#FF8096] font-bold text-sm">VIEW ALL</button>
            </div>
            <div className="space-y-3">
              {logs.slice(0, 3).map((log) => (
                <div key={log.id} className="bg-white p-4 rounded-2xl border-2 border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#F0F8FF] p-3 rounded-xl text-xl">
                      {stoolTypes.find(t => t.type === log.type)?.emoji}
                    </div>
                    <div>
                      <div className="font-bold text-gray-700">Type {log.type}</div>
                      <div className="text-xs font-bold text-gray-400">{new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                  <div className="font-extrabold text-gray-300 text-sm">
                    {getDayName(log.date)}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>

        {/* Floating Navigation (Duolingo Style) */}
        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t-2 border-gray-100 px-2 py-2 flex justify-around z-20 pb-safe">
          {[
            { id: 'dashboard', icon: Droplets, label: 'Track' },
            { id: 'stats', icon: BarChart2, label: 'Stats' },
            { id: 'profile', icon: Settings, label: 'Profile' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`
                  flex-1 flex items-center justify-center p-3 rounded-xl transition-all
                  ${view === item.id ? 'bg-[#FFF0F3]' : 'bg-transparent'}
                `}
            >
              <item.icon
                size={28}
                strokeWidth={2.5}
                className={view === item.id ? 'text-[#FF8096]' : 'text-gray-300'}
              />
            </button>
          ))}
        </nav>

        {/* Logging Modal Overlay */}
        {isLogging && (
          <div className="absolute inset-0 z-50 flex flex-col bg-[#FFF9F9] animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
              <button onClick={() => setIsLogging(false)}>
                <X size={28} className="text-gray-300 hover:text-gray-500" strokeWidth={3} />
              </button>
              <div className="bg-gray-100 rounded-full h-2 w-full max-w-[50%] mx-4">
                <div className="bg-[#FF8096] h-2 rounded-full w-[33%]"></div>
              </div>
              <div className="w-7"></div> {/* Spacer */}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="text-2xl font-black text-gray-700 text-center mb-2">How was it?</h2>
              <p className="text-center text-gray-400 font-bold mb-8">Select the type that best matches.</p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {stoolTypes.map((t) => (
                  <StoolTypeCard
                    key={t.type}
                    type={t.type}
                    emoji={t.emoji}
                    description={t.desc}
                    selected={selectedType === t.type}
                    onClick={() => setSelectedType(t.type)}
                  />
                ))}
              </div>
            </div>

            <div className="p-6 bg-white border-t-2 border-gray-100 pb-8">
              <JuicyButton
                variant={selectedType ? 'primary' : 'outline'}
                size="lg"
                fullWidth
                disabled={!selectedType}
                onClick={handleLog}
              >
                {selectedType ? 'CONFIRM LOG' : 'SELECT A TYPE'}
              </JuicyButton>
            </div>
          </div>
        )}

      </div>

      {/* Global Styles for Animations/Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        
        :root {
          font-family: 'Nunito', sans-serif;
        }

        /* Hide scrollbar for clean UI */
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}