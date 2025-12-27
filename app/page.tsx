"use client"

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  BarChart2,
  Settings,
  Flame,
  Check,
  X,
  ChevronRight,
  Droplets,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';

/**
 * PoopPal - A Tracker with Duolingo Feel & Flo Colors
 * Fully Responsive: Desktop, Tablet, Mobile
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
    lg: 'px-8 py-4 text-lg md:text-xl font-bold border-b-[6px]',
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
        duration-150 
        transform 
        rounded-2xl 
        font-extrabold 
        flex items-center justify-center gap-2
        ${currentVariant.bg} 
        ${currentVariant.border} 
        ${currentVariant.text}
        ${!disabled ? currentVariant.hover : 'opacity-50 cursor-not-allowed'}
        ${!disabled ? 'active:border-b-0 active:translate-y-[4px] hover:scale-[1.02]' : ''}
        ${fullWidth ? 'w-full' : ''}
        ${currentSize}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// Bristol Scale Card (Responsive)
const StoolTypeCard = ({ label, description, selected, onClick, emoji, delay = 0 }) => (
  <div
    onClick={onClick}
    style={{ animationDelay: `${delay}ms` }}
    className={`
      cursor-pointer
      relative p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200
      flex flex-col items-center gap-1 sm:gap-2
      animate-scale-in
      ${selected
        ? 'border-[#FF8096] bg-[#FFF0F3] scale-[1.02] shadow-lg'
        : 'border-gray-200 bg-white hover:border-[#FFB7B2] hover:-translate-y-1 hover:shadow-md shadow-sm'}
    `}
  >
    <div className={`text-3xl sm:text-4xl md:text-5xl filter drop-shadow-sm transition-transform duration-200 ${selected ? 'animate-wiggle' : ''}`}>{emoji}</div>
    <div className="text-center">
      <div className={`font-bold text-sm sm:text-base ${selected ? 'text-[#FF8096]' : 'text-gray-600'}`}>{label}</div>
      <div className="text-[10px] sm:text-xs text-gray-400 font-medium leading-tight mt-1">{description}</div>
    </div>
    {selected && (
      <div className="absolute top-2 right-2 bg-[#FF8096] text-white rounded-full p-1 animate-bounce-in">
        <Check size={12} strokeWidth={4} />
      </div>
    )}
  </div>
);

// Stat Card (Responsive)
const StatCard = ({ icon: Icon, value, label, color, delay = 0 }) => (
  <div
    style={{ animationDelay: `${delay}ms` }}
    className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 card-hover animate-slide-up"
  >
    <div className={`p-2 sm:p-3 rounded-xl ${color} transition-transform duration-300 hover:rotate-12`}>
      <Icon size={20} className="text-white sm:w-6 sm:h-6" />
    </div>
    <div>
      <div className="text-xl sm:text-2xl md:text-3xl font-black text-gray-700">{value}</div>
      <div className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wide">{label}</div>
    </div>
  </div>
);

// Weekly Chart Component
const WeeklyChart = ({ logs }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  // Calculate logs per day for the last 7 days
  const weekData = days.map((day, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const count = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.toDateString() === date.toDateString();
    }).length;
    return { day, count, isToday: date.toDateString() === today.toDateString() };
  });

  const maxCount = Math.max(...weekData.map(d => d.count), 1);

  return (
    <div className="flex items-end justify-between gap-1 sm:gap-2 h-24 sm:h-32 md:h-40">
      {weekData.map((data, index) => (
        <div key={data.day} className="flex-1 flex flex-col items-center gap-1 sm:gap-2">
          <div
            className={`w-full rounded-t-xl transition-all duration-500 ease-out ${data.isToday ? 'bg-[#FF8096]' : 'bg-[#A6D8D4]'
              }`}
            style={{
              height: `${(data.count / maxCount) * 100}%`,
              minHeight: data.count > 0 ? '12px' : '4px',
              animationDelay: `${index * 100}ms`
            }}
          />
          <span className={`text-[10px] sm:text-xs font-bold ${data.isToday ? 'text-[#FF8096]' : 'text-gray-400'}`}>
            {data.day}
          </span>
        </div>
      ))}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState('dashboard'); // dashboard, log, stats
  const [logs, setLogs] = useState([
    { id: 1, type: 3, date: new Date().toISOString(), notes: "Healthy start!" },
    { id: 2, type: 4, date: new Date(Date.now() - 86400000).toISOString(), notes: "All good." },
    { id: 3, type: 4, date: new Date(Date.now() - 172800000).toISOString(), notes: "Regular." },
    { id: 4, type: 5, date: new Date(Date.now() - 259200000).toISOString(), notes: "" },
  ]);
  const [streak, setStreak] = useState(12);
  const [showAllLogs, setShowAllLogs] = useState(false);

  // Logging State
  const [selectedType, setSelectedType] = useState(null);
  const [isLogging, setIsLogging] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bristol Scale Data
  const stoolTypes = [
    { type: 1, label: 'Hard', emoji: '🪨', desc: 'Hard lumps' },
    { type: 2, label: 'Lumpy', emoji: '🥜', desc: 'Lumpy sausage' },
    { type: 3, label: 'Cracked', emoji: '🌽', desc: 'Cracked sausage' },
    { type: 4, label: 'Smooth', emoji: '🌭', desc: 'Smooth snake' },
    { type: 5, label: 'Soft', emoji: '☁️', desc: 'Soft blobs' },
    { type: 6, label: 'Mushy', emoji: '🍦', desc: 'Mushy solids' },
    { type: 7, label: 'Liquid', emoji: '💧', desc: 'Watery' },
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

  const visibleLogs = showAllLogs ? logs : logs.slice(0, 4);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-flo font-sans text-slate-800">
      {/* Main Container - Responsive */}
      <div className="w-full min-h-screen flex flex-col lg:flex-row">

        {/* Sidebar for Desktop */}
        <aside className="hidden lg:flex lg:w-72 xl:w-80 bg-white border-r-2 border-gray-100 flex-col fixed h-full z-20">
          {/* Logo */}
          <div className="px-6 py-6 flex items-center gap-3 border-b border-gray-100">
            <div className="bg-[#FF8096] p-3 rounded-xl animate-float">
              <span className="text-2xl">💩</span>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-700 tracking-tight">PoopPal</h1>
              <p className="text-xs font-bold text-gray-400">Track your health</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {[
              { id: 'dashboard', icon: Droplets, label: 'Dashboard' },
              { id: 'stats', icon: BarChart2, label: 'Statistics' },
              { id: 'profile', icon: Settings, label: 'Settings' }
            ].map((item, index) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                style={{ animationDelay: `${index * 100}ms` }}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 animate-slide-up
                  ${view === item.id
                    ? 'bg-[#FFF0F3] text-[#FF8096] shadow-sm'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}
                `}
              >
                <item.icon size={24} strokeWidth={2.5} className={view === item.id ? 'text-[#FF8096]' : ''} />
                <span className="font-bold">{item.label}</span>
                {view === item.id && (
                  <ChevronRight size={18} className="ml-auto text-[#FF8096]" />
                )}
              </button>
            ))}
          </nav>

        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-72 xl:ml-80">
          {/* Mobile/Tablet Header */}
          <header className="lg:hidden px-4 sm:px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-lg border-b border-gray-100 z-10 sticky top-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-[#FF8096] p-2 sm:p-2.5 rounded-xl animate-float">
                <span className="text-lg sm:text-xl">💩</span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-gray-700 tracking-tight">PoopPal</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1">
                <Flame className="text-orange-400 fill-orange-400" size={18} />
                <span className="font-extrabold text-orange-400">{streak}</span>
              </div>
              <div className="bg-[#FF8096] w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#D65D73] flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="p-4 sm:p-6 lg:p-8 xl:p-10 pb-24 lg:pb-10 space-y-6 sm:space-y-8 max-w-6xl mx-auto">

            {/* Greeting */}
            <section className="animate-fade-in">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-700 mb-2">Hello, User! 👋</h2>
              <p className="text-gray-400 font-bold text-sm sm:text-base">Time to listen to your body.</p>
            </section>

            {/* Stats Row - Responsive Grid */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                icon={Check}
                value={logs.filter(l => new Date(l.date).getDate() === new Date().getDate()).length}
                label="Today"
                color="bg-[#A6D8D4]"
                delay={100}
              />
              <StatCard
                icon={Calendar}
                value={logs.length}
                label="Total"
                color="bg-[#FFB7B2]"
                delay={200}
              />
              <StatCard
                icon={TrendingUp}
                value="4.2"
                label="Avg Consistency"
                color="bg-[#B4A7D6]"
                delay={300}
              />
              <StatCard
                icon={Clock}
                value="8am"
                label="Best Time"
                color="bg-[#FFD966]"
                delay={400}
              />
            </section>

            {/* Main Content Grid - Desktop: 2 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

              {/* Main Action Card */}
              <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm flex flex-col items-center gap-4 sm:gap-6 text-center animate-scale-in glow-pink">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-[#FFF0F3] rounded-full flex items-center justify-center animate-float">
                  <span className="text-4xl sm:text-5xl lg:text-6xl">🚽</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-gray-700">Track your movement</h3>
                  <p className="text-gray-400 font-medium text-xs sm:text-sm mt-1 max-w-xs mx-auto">Keep your streak alive and understand your digestive health better.</p>
                </div>
                <JuicyButton
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setIsLogging(true)}
                  className="animate-pulse-slow max-w-xs"
                >
                  <Plus size={24} className="mr-1" />
                  LOG NOW
                </JuicyButton>
              </section>

              {/* Day Streak */}
              <section
                className="bg-gradient-to-br from-orange-100 to-yellow-50 rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-orange-100 shadow-sm flex flex-col justify-between animate-slide-up"
                style={{ animationDelay: '200ms' }}
              >
                <div className="flex items-center gap-3">
                  <Flame className="text-orange-400 fill-orange-400 animate-pulse-slow" size={32} />
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-orange-500">{streak}</span>
                </div>
                <div className="mt-3">
                  <p className="text-sm sm:text-base font-extrabold text-orange-400">Day Streak! 🔥</p>
                  <p className="text-xs sm:text-sm font-medium text-orange-300 mt-1">Keep it going!</p>
                </div>
              </section>
            </div>

            {/* Statistics */}
            <section className="animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Statistics</h3>
              </div>
              <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h4 className="text-base sm:text-lg font-extrabold text-gray-700">This Week</h4>
                  <span className="text-xs sm:text-sm font-bold text-[#FF8096]">View Details</span>
                </div>
                <WeeklyChart logs={logs} />
              </div>
            </section>

            {/* Recent History */}
            <section className="animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Recent Logs</h3>
                <button
                  onClick={() => setShowAllLogs(prev => !prev)}
                  className="text-[#FF8096] font-bold text-xs sm:text-sm hover:underline transition-all"
                >
                  {showAllLogs ? 'VIEW LESS' : 'VIEW ALL'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 stagger-children">
                {visibleLogs.map((log) => {
                  const logType = stoolTypes.find(t => t.type === log.type);

                  return (
                    <div
                      key={log.id}
                      className="bg-white p-4 rounded-2xl border-2 border-gray-100 flex items-center justify-between card-hover"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="bg-[#F0F8FF] p-2.5 sm:p-3 rounded-xl text-lg sm:text-xl">
                          {logType?.emoji}
                        </div>
                        <div>
                          <div className="font-bold text-gray-700 text-sm sm:text-base">{logType?.label}</div>
                          <div className="text-[10px] sm:text-xs font-bold text-gray-400">
                            {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="font-extrabold text-gray-300 text-xs sm:text-sm">
                        {getDayName(log.date)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        </main>

        {/* Mobile/Tablet Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t-2 border-gray-100 px-2 py-2 flex justify-around z-20 pb-safe">
          {[
            { id: 'dashboard', icon: Droplets, label: 'Track' },
            { id: 'stats', icon: BarChart2, label: 'Stats' },
            { id: 'profile', icon: Settings, label: 'Profile' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`
                flex-1 flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl transition-all duration-200
                ${view === item.id ? 'bg-[#FFF0F3]' : 'bg-transparent'}
              `}
            >
              <item.icon
                size={24}
                strokeWidth={2.5}
                className={`transition-all duration-200 ${view === item.id ? 'text-[#FF8096] scale-110' : 'text-gray-300'}`}
              />
              <span className={`text-[10px] sm:text-xs font-bold mt-1 ${view === item.id ? 'text-[#FF8096]' : 'text-gray-300'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Logging Modal Overlay */}
        {isLogging && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-[#FFF9F9] rounded-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="px-4 sm:px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
                <button onClick={() => setIsLogging(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={24} className="text-gray-400 hover:text-gray-600" strokeWidth={3} />
                </button>
                <div className="bg-gray-100 rounded-full h-2 w-full max-w-[50%] mx-4">
                  <div className={`bg-[#FF8096] h-2 rounded-full transition-all duration-500 ${selectedType ? 'w-[100%]' : 'w-[33%]'}`}></div>
                </div>
                <div className="w-10"></div> {/* Spacer */}
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-black text-gray-700 text-center mb-2">How was it?</h2>
                <p className="text-center text-gray-400 font-bold text-sm mb-6 sm:mb-8">Select the type that best matches.</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {stoolTypes.map((t, index) => (
                    <StoolTypeCard
                      key={t.type}
                      label={t.label}
                      emoji={t.emoji}
                      description={t.desc}
                      selected={selectedType === t.type}
                      onClick={() => setSelectedType(t.type)}
                      delay={index * 50}
                    />
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-white border-t-2 border-gray-100 shrink-0">
                <JuicyButton
                  variant={selectedType ? 'primary' : 'outline'}
                  size="lg"
                  fullWidth
                  disabled={!selectedType}
                  onClick={handleLog}
                  className={selectedType ? 'animate-pulse-slow' : ''}
                >
                  {selectedType ? (
                    <>
                      <Check size={20} />
                      CONFIRM LOG
                    </>
                  ) : 'SELECT A TYPE'}
                </JuicyButton>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
