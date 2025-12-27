"use client"

import React, { useState, useEffect } from 'react';
import {
  Plus,
  BarChart2,
  Settings,
  Flame,
  Check,
  X,
  ChevronRight,
  Droplets,
  Sparkles,
  Target,
  Award,
  Activity
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
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
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
      bg: 'bg-[#F5F5F5]',
      border: 'border-[#E0E0E0]',
      text: 'text-[#7A7A7A]',
      hover: 'hover:bg-[#ECECEC]',
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
const StoolTypeCard = ({
  label,
  selected,
  onClick,
  emoji,
  delay = 0
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  emoji: string;
  delay?: number;
}) => (
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
    </div>
    {selected && (
      <div className="absolute top-2 right-2 bg-[#FF8096] text-white rounded-full p-1 animate-bounce-in">
        <Check size={12} strokeWidth={4} />
      </div>
    )}
  </div>
);

// Stat Card (Responsive)
const StatCard = ({
  icon: Icon,
  value,
  label,
  color,
  delay = 0
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  value: string | number;
  label: string;
  color: string;
  delay?: number;
}) => (
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
const WeeklyChart = ({ logs }: { logs: Array<{ id: number; type: number; date: string; notes: string }> }) => {
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
  const [logs, setLogs] = useState(() => {
    const now = Date.now();
    return [
      { id: 1, type: 3, date: new Date().toISOString(), notes: "Healthy start!" },
      { id: 2, type: 4, date: new Date(now - 86400000).toISOString(), notes: "All good." },
      { id: 3, type: 4, date: new Date(now - 172800000).toISOString(), notes: "Regular." },
      { id: 4, type: 5, date: new Date(now - 259200000).toISOString(), notes: "" },
    ];
  });
  const [streak, setStreak] = useState(12);
  const [showAllLogs, setShowAllLogs] = useState(false);

  // Logging State
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bristol Scale Data
  const stoolTypes = [
    { type: 1, label: 'Hard', emoji: '🪨' },
    { type: 2, label: 'Lumpy', emoji: '🥜' },
    { type: 3, label: 'Cracked', emoji: '🌽' },
    { type: 4, label: 'Smooth', emoji: '🌭' },
    { type: 5, label: 'Soft', emoji: '☁️' },
    { type: 6, label: 'Mushy', emoji: '🍦' },
    { type: 7, label: 'Liquid', emoji: '💧' },
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

  const getDayName = (dateStr: string) => {
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

          <div className="p-4">
            <JuicyButton
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setIsLogging(true)}
            >
              <Plus size={20} />
              LOG NOW
            </JuicyButton>
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
                  cursor-pointer w-full flex items-center gap-4 p-4 rounded-md transition-all duration-200 animate-slide-up
                  ${view === item.id
                    ? 'bg-[#FFF0F3] text-[#FF8096]'
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

            {view === 'dashboard' && (
              <>
                {/* Greeting */}
                <section className="animate-fade-in">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-700 mb-2">Hello, User! 👋</h2>
                  <p className="text-gray-400 font-bold text-sm sm:text-base">Time to listen to your body.</p>
                </section>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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

                {/* Recent History */}
                <section className="animate-slide-up" style={{ animationDelay: '300ms' }}>
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
              </>
            )}

            {view === 'stats' && (
              <>
                {/* Stats Page Header */}
                <section className="animate-fade-in">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-700 mb-2">Statistics 📊</h2>
                  <p className="text-gray-400 font-bold text-sm sm:text-base">Track your digestive health journey.</p>
                </section>

                {/* Overview Stats Grid */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatCard
                    icon={Check}
                    value={logs.length}
                    label="Total Logs"
                    color="bg-[#A6D8D4]"
                    delay={100}
                  />
                  <StatCard
                    icon={Flame}
                    value={streak}
                    label="Day Streak"
                    color="bg-[#FFB7B2]"
                    delay={200}
                  />
                  <StatCard
                    icon={Activity}
                    value={(logs.reduce((sum, log) => sum + log.type, 0) / logs.length).toFixed(1) || '0'}
                    label="Avg Type"
                    color="bg-[#B4A7D6]"
                    delay={300}
                  />
                  <StatCard
                    icon={Target}
                    value="4"
                    label="Healthy Score"
                    color="bg-[#98DE8F]"
                    delay={400}
                  />
                </section>

                {/* Main Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

                  {/* Weekly Overview */}
                  <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                      <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Weekly Activity</h3>
                      <span className="text-xs sm:text-sm font-bold text-[#FF8096]">Last 7 Days</span>
                    </div>
                    <WeeklyChart logs={logs} />
                  </section>

                  {/* Bristol Scale Distribution */}
                  <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                      <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Type Distribution</h3>
                      <span className="text-xs sm:text-sm font-bold text-[#FF8096]">Bristol Scale</span>
                    </div>
                    <div className="space-y-3">
                      {stoolTypes.map((type) => {
                        const count = logs.filter(log => log.type === type.type).length;
                        const percentage = logs.length > 0 ? (count / logs.length * 100).toFixed(0) : 0;
                        return (
                          <div key={type.type} className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F0F8FF] rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                              {type.emoji}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-sm sm:text-base text-gray-700">{type.label}</span>
                                <span className="font-bold text-xs sm:text-sm text-gray-400">{percentage}%</span>
                              </div>
                              <div className="h-3 sm:h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    Number(percentage) > 0 ? 'bg-gradient-to-r from-[#FF8096] to-[#A6D8D4]' : 'bg-gray-200'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Daily Pattern */}
                  <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                      <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Daily Pattern</h3>
                      <span className="text-xs sm:text-sm font-bold text-[#FF8096]">By Time</span>
                    </div>
                    <div className="space-y-3">
                      {['Morning', 'Afternoon', 'Evening', 'Night'].map((timePeriod) => {
                        const hours = timePeriod === 'Morning' ? [6, 7, 8, 9, 10, 11] :
                                     timePeriod === 'Afternoon' ? [12, 13, 14, 15, 16, 17] :
                                     timePeriod === 'Evening' ? [18, 19, 20, 21] :
                                     [22, 23, 0, 1, 2, 3, 4, 5];
                        const count = logs.filter(log => {
                          const hour = new Date(log.date).getHours();
                          return hours.includes(hour);
                        }).length;
                        const percentage = logs.length > 0 ? (count / logs.length * 100).toFixed(0) : 0;
                        
                        const periodEmoji = timePeriod === 'Morning' ? '🌅' :
                                          timePeriod === 'Afternoon' ? '☀️' :
                                          timePeriod === 'Evening' ? '🌆' : '🌙';
                        
                        return (
                          <div key={timePeriod} className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFF9F3] rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                              {periodEmoji}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-sm sm:text-base text-gray-700">{timePeriod}</span>
                                <span className="font-bold text-xs sm:text-sm text-gray-400">{count} logs</span>
                              </div>
                              <div className="h-3 sm:h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    Number(percentage) > 0 ? 'bg-gradient-to-r from-[#FFD966] to-[#FFB7B2]' : 'bg-gray-200'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Health Insights */}
                  <section className="bg-gradient-to-br from-[#FFF0F3] to-[#E8F4F3] rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-[#FFE8EC] shadow-sm animate-slide-up" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="bg-[#FF8096] p-2 sm:p-3 rounded-xl animate-float">
                        <Award size={20} className="text-white sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Health Insights</h3>
                        <p className="text-xs sm:text-sm font-bold text-gray-400">Your digestive wellness</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/70 rounded-2xl p-3 sm:p-4 border border-white/50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="bg-[#98DE8F] p-1.5 sm:p-2 rounded-lg">
                            <Check size={12} className="text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-xs sm:text-sm text-gray-700">Great consistency!</p>
                            <p className="text-[10px] sm:text-xs font-medium text-gray-400">Your average type is 4 (ideal)</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/70 rounded-2xl p-3 sm:p-4 border border-white/50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="bg-[#FFD966] p-1.5 sm:p-2 rounded-lg">
                            <Flame size={12} className="text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-xs sm:text-sm text-gray-700">Strong streak!</p>
                            <p className="text-[10px] sm:text-xs font-medium text-gray-400">{streak} days of tracking</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/70 rounded-2xl p-3 sm:p-4 border border-white/50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="bg-[#A6D8D4] p-1.5 sm:p-2 rounded-lg">
                            <Activity size={12} className="text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-xs sm:text-sm text-gray-700">Regular pattern</p>
                            <p className="text-[10px] sm:text-xs font-medium text-gray-400">Morning is your best time</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                </div>

                {/* Monthly Trend */}
                <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm animate-slide-up" style={{ animationDelay: '500ms' }}>
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Monthly Trend</h3>
                    <span className="text-xs sm:text-sm font-bold text-[#FF8096]">Last 30 Days</span>
                  </div>
                  <div className="grid grid-cols-10 gap-1 sm:gap-2">
                    {Array.from({ length: 30 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - (29 - i));
                      const hasLog = logs.some(log => new Date(log.date).toDateString() === date.toDateString());
                      const isToday = date.toDateString() === new Date().toDateString();
                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded-lg sm:rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all hover:scale-110 cursor-default ${
                            hasLog 
                              ? `bg-gradient-to-br ${isToday ? 'from-[#FF8096] to-[#D65D73]' : 'from-[#A6D8D4] to-[#7CB2AE]'} text-white shadow-md`
                              : 'bg-gray-100 text-gray-300'
                          }`}
                          title={date.toLocaleDateString()}
                        >
                          {isToday ? '📍' : hasLog ? '✓' : ''}
                        </div>
                      );
                    })}
                  </div>
                </section>

              </>
            )}

          </div>
        </main>

        {/* Mobile/Tablet Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t-2 border-gray-100 px-2 py-2 flex items-center justify-around z-20 pb-safe">
          {[
            { id: 'dashboard', icon: Droplets, label: 'Track' },
            { id: 'stats', icon: BarChart2, label: 'Stats' },
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

          <button
            onClick={() => setIsLogging(true)}
            className="mx-2 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FF8096] text-white border-b-4 border-[#D65D73] shadow-lg transition-all duration-150 active:border-b-0 active:translate-y-[4px] hover:scale-[1.03]"
          >
            <Plus size={26} strokeWidth={3} />
          </button>

          <button
            onClick={() => setView('profile')}
            className={`
              flex-1 flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl transition-all duration-200
              ${view === 'profile' ? 'bg-[#FFF0F3]' : 'bg-transparent'}
            `}
          >
            <Settings
              size={24}
              strokeWidth={2.5}
              className={`transition-all duration-200 ${view === 'profile' ? 'text-[#FF8096] scale-110' : 'text-gray-300'}`}
            />
            <span className={`text-[10px] sm:text-xs font-bold mt-1 ${view === 'profile' ? 'text-[#FF8096]' : 'text-gray-300'}`}>
              Profile
            </span>
          </button>
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
