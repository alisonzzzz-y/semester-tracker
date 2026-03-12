import React, { useState, useEffect } from 'react';
import { Calendar, Plus, TrendingUp, Award, Flame, Target, BarChart3, PieChart, ChevronLeft, ChevronRight, Undo2, Trash2 } from 'lucide-react';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [weeklyScore, setWeeklyScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [weekHistory, setWeekHistory] = useState([]);
  const [showScoreAnimation, setShowScoreAnimation] = useState(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Study Tasks');
  const [customScore, setCustomScore] = useState(5);
  const [view, setView] = useState('dashboard');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTaskAdded, setShowTaskAdded] = useState(false);
  const [deletingTasks, setDeletingTasks] = useState(new Set());

  const categories = {
    'Study Tasks': { score: null, color: '#8b5cf6', icon: '📚', fixed: false, min: 3, max: 8 },
    'Class Attendance': { score: 3, color: '#7C3AED', icon: '🎓', fixed: true },
    'Exercise': { score: 7, color: '#F97316', icon: '💪', fixed: true },
    'Other Meaningful': { score: null, color: '#8b5cf6', icon: '✨', fixed: false, min: 3, max: 8 }
  };

  useEffect(() => {
    const saved = localStorage.getItem('semesterTracker');
    if (saved) {
      const data = JSON.parse(saved);
      
      // 检查是否需要重置周分数（每周一重置）
      const today = new Date();
      const lastResetDate = data.lastWeeklyReset ? new Date(data.lastWeeklyReset) : null;
      
      // 计算本周的周一
      const thisMonday = new Date(today);
      const dayOfWeek = today.getDay(); // 0=周日, 1=周一, ...
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 周日需要回退6天
      thisMonday.setDate(today.getDate() - daysFromMonday);
      thisMonday.setHours(0, 0, 0, 0);
      
      // 如果上次重置日期早于本周周一，需要重置
      const needsReset = !lastResetDate || lastResetDate < thisMonday;
      
      setTasks(data.tasks || []);
      setWeekHistory(data.weekHistory || []);
      
      if (needsReset) {
        // 保存上周的数据到历史
        if (lastResetDate && data.weeklyScore > 0) {
          const lastMonday = new Date(lastResetDate);
          const lastSunday = new Date(lastMonday);
          lastSunday.setDate(lastMonday.getDate() + 6);
          
          // 计算上周的任务完成数
          const lastWeekTasks = (data.tasks || []).filter(t => {
            const taskDate = new Date(t.date);
            return taskDate >= lastMonday && taskDate <= lastSunday && t.completed;
          });
          
          const weekData = {
            startDate: lastMonday.toISOString(),
            endDate: lastSunday.toISOString(),
            score: data.weeklyScore,
            tasksCompleted: lastWeekTasks.length,
            totalTasks: (data.tasks || []).filter(t => {
              const taskDate = new Date(t.date);
              return taskDate >= lastMonday && taskDate <= lastSunday;
            }).length
          };
          
          const newHistory = [...(data.weekHistory || []), weekData];
          setWeekHistory(newHistory);
          
          // 保存到 localStorage
          localStorage.setItem('semesterTracker', JSON.stringify({
            tasks: data.tasks || [],
            weeklyScore: 0,
            streak: 0,
            lastWeeklyReset: today.toISOString(),
            weekHistory: newHistory
          }));
        }
        
        setWeeklyScore(0);
        setStreak(0);
      } else {
        setWeeklyScore(data.weeklyScore || 0);
        setStreak(data.streak || 0);
      }
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('semesterTracker');
    const lastResetDate = saved ? JSON.parse(saved).lastWeeklyReset : new Date().toISOString();
    
    localStorage.setItem('semesterTracker', JSON.stringify({
      tasks, 
      weeklyScore, 
      streak,
      lastWeeklyReset: lastResetDate,
      weekHistory
    }));
  }, [tasks, weeklyScore, streak, weekHistory]);

  const addTask = () => {
    if (!newTaskText.trim()) return;
    const categoryData = categories[selectedCategory];
    const taskScore = categoryData.fixed ? categoryData.score : customScore;
    const newTask = {
      id: Date.now(),
      text: newTaskText,
      category: selectedCategory,
      completed: false,
      date: new Date().toISOString(),
      score: taskScore
    };
    setTasks([newTask, ...tasks]);
    setNewTaskText('');
    setShowTaskAdded(true);
    setTimeout(() => setShowTaskAdded(false), 2000);
  };

  const completeTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: true, completedAt: new Date().toISOString() } : t
    ));
    setWeeklyScore(prev => prev + task.score);
    setShowScoreAnimation({ score: task.score, category: task.category });
    setTimeout(() => setShowScoreAnimation(null), 2000);
    
    // Update streak - 基于本周的连续完成天数
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonday = getThisMonday();
    
    // 获取本周已完成任务的所有日期
    const completedDates = new Set(
      tasks
        .filter(t => t.completed && new Date(t.date) >= thisMonday)
        .map(t => {
          const d = new Date(t.date);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
    );
    
    // 加上今天
    completedDates.add(today.getTime());
    
    // 从今天往前数，连续的天数
    let currentStreak = 0;
    const checkDate = new Date(today);
    
    while (checkDate >= thisMonday) {
      if (completedDates.has(checkDate.getTime())) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    setStreak(currentStreak);
  };

  const uncompleteTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.completed) return;
    const updatedTasks = tasks.map(t =>
      t.id === taskId ? { ...t, completed: false, completedAt: null } : t
    );
    setTasks(updatedTasks);
    setWeeklyScore(prev => prev - task.score);

    // Recalculate streak from updated tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonday = getThisMonday();
    const completedDates = new Set(
      updatedTasks
        .filter(t => t.completed && new Date(t.date) >= thisMonday)
        .map(t => { const d = new Date(t.date); d.setHours(0, 0, 0, 0); return d.getTime(); })
    );
    let currentStreak = 0;
    const checkDate = new Date(today);
    while (checkDate >= thisMonday) {
      if (completedDates.has(checkDate.getTime())) { currentStreak++; checkDate.setDate(checkDate.getDate() - 1); }
      else break;
    }
    setStreak(currentStreak);
  };

  const deleteTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // 添加到正在删除的集合
    setDeletingTasks(prev => new Set([...prev, taskId]));
    
    // 等待动画完成后再真正删除
    setTimeout(() => {
      const remainingTasks = tasks.filter(t => t.id !== taskId);
      if (task.completed) {
        setWeeklyScore(prev => prev - task.score);
        // Recalculate streak from remaining tasks
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const thisMonday = getThisMonday();
        const completedDates = new Set(
          remainingTasks
            .filter(t => t.completed && new Date(t.date) >= thisMonday)
            .map(t => { const d = new Date(t.date); d.setHours(0, 0, 0, 0); return d.getTime(); })
        );
        let currentStreak = 0;
        const checkDate = new Date(today);
        while (checkDate >= thisMonday) {
          if (completedDates.has(checkDate.getTime())) { currentStreak++; checkDate.setDate(checkDate.getDate() - 1); }
          else break;
        }
        setStreak(currentStreak);
      }
      setTasks(remainingTasks);
      setDeletingTasks(prev => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }, 300); // 与 CSS 动画时长一致
  };

  const getTodayTasks = () => {
    const today = new Date().toDateString();
    return tasks.filter(t => new Date(t.date).toDateString() === today);
  };

  const getWeekTasks = () => {
    const thisMonday = getThisMonday();
    const today = new Date().toDateString();
    return tasks.filter(t => new Date(t.date) >= thisMonday && new Date(t.date).toDateString() !== today);
  };

  const getPreviousTasks = () => {
    const thisMonday = getThisMonday();
    return tasks.filter(t => new Date(t.date) < thisMonday);
  };

  const getTasksForDate = (date) => {
    return tasks.filter(t => new Date(t.date).toDateString() === date.toDateString());
  };

  const getWeeklyTrend = () => {
    const weeks = [];
    const today = new Date();
    const thisMonday = getThisMonday();
    
    // 计算需要显示的7周（包括本周）
    // 如果历史数据不足，用过去任务数据计算
    for (let i = 6; i >= 1; i--) {
      const weekStart = new Date(thisMonday);
      weekStart.setDate(thisMonday.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      // 先尝试从历史数据中找
      const historyWeek = weekHistory.find(h => {
        const hStart = new Date(h.startDate);
        return hStart.getTime() === weekStart.getTime();
      });
      
      if (historyWeek) {
        // 使用历史数据
        const startLabel = `${weekStart.getMonth() + 1}.${weekStart.getDate()}`;
        const endLabel = `${weekEnd.getMonth() + 1}.${weekEnd.getDate()}`;
        weeks.push({
          week: `${startLabel}-${endLabel}`,
          score: historyWeek.score,
          tasks: historyWeek.tasksCompleted
        });
      } else {
        // 从任务数据中计算（兼容旧数据）
        const weekTasks = tasks.filter(t => {
          const taskDate = new Date(t.date);
          return taskDate >= weekStart && taskDate <= weekEnd && t.completed;
        });
        
        const startLabel = `${weekStart.getMonth() + 1}.${weekStart.getDate()}`;
        const endLabel = `${weekEnd.getMonth() + 1}.${weekEnd.getDate()}`;
        weeks.push({
          week: `${startLabel}-${endLabel}`,
          score: weekTasks.reduce((sum, t) => sum + t.score, 0),
          tasks: weekTasks.length
        });
      }
    }
    
    // 添加本周数据（实时）
    const thisSunday = new Date(thisMonday);
    thisSunday.setDate(thisMonday.getDate() + 6);
    
    const thisWeekTasks = tasks.filter(t => {
      const taskDate = new Date(t.date);
      return taskDate >= thisMonday && taskDate <= today && t.completed;
    });
    
    const startLabel = `${thisMonday.getMonth() + 1}.${thisMonday.getDate()}`;
    const endLabel = `${thisSunday.getMonth() + 1}.${thisSunday.getDate()}`;
    
    weeks.push({
      week: `${startLabel}-${endLabel}`,
      score: weeklyScore,
      tasks: thisWeekTasks.length
    });
    
    return weeks;
  };

  const getCalendarData = () => {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayTasks = getTasksForDate(date);
      days.push({
        date: date,
        score: dayTasks.filter(t => t.completed).reduce((sum, t) => sum + t.score, 0),
        completed: dayTasks.filter(t => t.completed).length,
        total: dayTasks.length
      });
    }
    return days;
  };

  const getCategoryStats = () => {
    return Object.entries(categories).map(([name, data]) => ({
      name, icon: data.icon, color: data.color,
      total: tasks.filter(t => t.category === name).length,
      completed: tasks.filter(t => t.category === name && t.completed).length,
      points: tasks.filter(t => t.category === name && t.completed).reduce((sum, t) => sum + t.score, 0)
    }));
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // getDay() 返回 0-6 (0=周日, 1=周一, ..., 6=周六)
    // 我们需要以周一为起始，所以需要调整
    // 周日应该是第7列，所以周日(0)需要6个空格，周一(1)需要0个空格
    let firstDayOfWeek = firstDay.getDay();
    const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  // 计算本周的周一
  const getThisMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - daysFromMonday);
    thisMonday.setHours(0, 0, 0, 0);
    return thisMonday;
  };

  const completedToday = getTodayTasks().filter(t => t.completed).length;
  const totalToday = getTodayTasks().length;
  
  // 本周完成的任务数（从周一到今天）
  const completedThisWeek = tasks.filter(t => {
    const taskDate = new Date(t.date);
    return taskDate >= getThisMonday() && t.completed;
  }).length;

  // 渲染不同视图的内容
  const renderView = () => {
    if (view === 'dashboard') {
      return <DashboardView 
        tasks={tasks}
        getTodayTasks={getTodayTasks}
        getWeekTasks={getWeekTasks}
        getPreviousTasks={getPreviousTasks}
        categories={categories}
        newTaskText={newTaskText}
        setNewTaskText={setNewTaskText}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        customScore={customScore}
        setCustomScore={setCustomScore}
        addTask={addTask}
        completeTask={completeTask}
        uncompleteTask={uncompleteTask}
        deleteTask={deleteTask}
        deletingTasks={deletingTasks}
        weeklyScore={weeklyScore}
        streak={streak}
        completedToday={completedToday}
        totalToday={totalToday}
        completedThisWeek={completedThisWeek}
      />;
    }
    
    if (view === 'calendar') {
      return <CalendarView 
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        getDaysInMonth={getDaysInMonth}
        getTasksForDate={getTasksForDate}
        categories={categories}
        completeTask={completeTask}
        uncompleteTask={uncompleteTask}
        deleteTask={deleteTask}
        deletingTasks={deletingTasks}
      />;
    }
    
    if (view === 'stats') {
      return <StatsView 
        tasks={tasks}
        getWeeklyTrend={getWeeklyTrend}
        getCategoryStats={getCategoryStats}
        getCalendarData={getCalendarData}
        weekHistory={weekHistory}
      />;
    }
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#0d0d0d' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        body { background-color: #0d0d0d !important; }
        
        @keyframes scoreFloat {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
        .score-animation { animation: scoreFloat 2s ease-out forwards; }
        
        @keyframes slideInFromBottom {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .task-added-animation { animation: slideInFromBottom 0.3s ease-out; }
        
        .checkbox {
          appearance: none; width: 20px; height: 20px;
          background: #2a2a2a; border-radius: 6px;
          cursor: pointer; position: relative;
          transition: all 150ms ease; flex-shrink: 0;
        }
        .checkbox:hover { background: #3a3a3a; }
        .checkbox:checked { background: #8b5cf6; }
        .checkbox:checked::after {
          content: '✓'; position: absolute; color: white;
          font-size: 14px; font-weight: 700;
          top: 50%; left: 50%; transform: translate(-50%, -50%);
        }
        .checkbox:disabled { opacity: 0.4; cursor: not-allowed; }
        
        input[type="range"] {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 10px;
          border-radius: 5px; outline: none;
          background: linear-gradient(to right, 
            var(--slider-color, #10B981) 0%, 
            var(--slider-color, #10B981) var(--range-progress), 
            #2a2a2a var(--range-progress), 
            #2a2a2a 100%);
          transition: background 0.15s ease;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 28px; height: 28px;
          background: var(--slider-color, #10B981);
          cursor: grab; border-radius: 50%;
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--slider-color, #10B981) 15%, transparent),
                      0 4px 12px color-mix(in srgb, var(--slider-color, #10B981) 40%, transparent),
                      0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 0 0 6px color-mix(in srgb, var(--slider-color, #10B981) 25%, transparent),
                      0 6px 20px color-mix(in srgb, var(--slider-color, #10B981) 50%, transparent),
                      0 3px 6px rgba(0, 0, 0, 0.3);
        }
        
        input[type="range"]::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.05);
          box-shadow: 0 0 0 8px color-mix(in srgb, var(--slider-color, #10B981) 30%, transparent),
                      0 2px 8px color-mix(in srgb, var(--slider-color, #10B981) 60%, transparent);
        }
        
        input[type="range"]::-moz-range-track {
          height: 10px;
          border-radius: 5px;
          background: #2a2a2a;
        }
        
        input[type="range"]::-moz-range-progress {
          height: 10px;
          border-radius: 5px;
          background: var(--slider-color, #10B981);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 28px; height: 28px;
          background: var(--slider-color, #10B981);
          cursor: grab; border-radius: 50%; border: none;
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--slider-color, #10B981) 15%, transparent),
                      0 4px 12px color-mix(in srgb, var(--slider-color, #10B981) 40%, transparent),
                      0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 0 0 6px color-mix(in srgb, var(--slider-color, #10B981) 25%, transparent),
                      0 6px 20px color-mix(in srgb, var(--slider-color, #10B981) 50%, transparent),
                      0 3px 6px rgba(0, 0, 0, 0.3);
        }
        
        input[type="range"]::-moz-range-thumb:active {
          cursor: grabbing;
          transform: scale(1.05);
          box-shadow: 0 0 0 8px color-mix(in srgb, var(--slider-color, #10B981) 30%, transparent),
                      0 2px 8px color-mix(in srgb, var(--slider-color, #10B981) 60%, transparent);
        }
        
        .view-content {
          animation: fadeSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeSlideOut {
          from {
            opacity: 1;
            transform: translateX(0) scale(1);
            max-height: 200px;
          }
          to {
            opacity: 0;
            transform: translateX(-20px) scale(0.95);
            max-height: 0;
            margin: 0;
            padding-top: 0;
            padding-bottom: 0;
          }
        }
        
        .deleting {
          animation: fadeSlideOut 0.3s ease-out forwards;
          pointer-events: none;
        }
      `}</style>

      {showScoreAnimation && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 score-animation pointer-events-none">
          <div className="text-8xl font-bold" style={{ color: categories[showScoreAnimation.category].color }}>
            +{showScoreAnimation.score}
          </div>
        </div>
      )}

      {showTaskAdded && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 task-added-animation pointer-events-none">
          <div className="px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg" 
               style={{ backgroundColor: '#8b5cf6', color: 'white' }}>
            <span className="text-xl">✓</span>
            Task added successfully
          </div>
        </div>
      )}

      <div className="px-12 py-4">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Semester Tracker</h1>
          <div className="flex gap-2 rounded-full p-1.5" style={{ 
            backgroundColor: '#1c1c1e',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            {[
              { key: 'dashboard', label: 'Dashboard', Icon: BarChart3 },
              { key: 'calendar', label: 'Calendar', Icon: Calendar },
              { key: 'stats', label: 'Statistics', Icon: PieChart }
            ].map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300"
                style={{ 
                  backgroundColor: view === key ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                  color: view === key ? '#a78bfa' : '#d1d1d1',
                  backdropFilter: view === key ? 'blur(10px)' : 'none'
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-12 pb-8">
        <div className="max-w-[1100px] mx-auto">
          <div className="view-content" key={view}>
            {renderView()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard 组件
const DashboardView = ({ tasks, getTodayTasks, getWeekTasks, getPreviousTasks, categories, newTaskText, setNewTaskText, selectedCategory, setSelectedCategory, customScore, setCustomScore, addTask, completeTask, uncompleteTask, deleteTask, deletingTasks, weeklyScore, streak, completedToday, totalToday, completedThisWeek }) => (
  <div className="space-y-6">
    <div className="rounded-2xl p-8" style={{ backgroundColor: '#1c1c1e' }}>
      <h2 className="text-2xl font-semibold mb-6">Add Task</h2>
      <div className="space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="What do you want to accomplish?"
            className="flex-1 rounded-xl px-5 py-4 text-white transition-all duration-150"
            style={{ 
              backgroundColor: '#222222',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
              outline: 'none'
            }}
            onFocus={(e) => e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.3), 0 0 0 2px rgba(139, 92, 246, 0.5)'}
            onBlur={(e) => e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.3)'}
          />
          <button 
            onClick={addTask} 
            className="font-semibold px-8 py-4 rounded-xl transition-all duration-150 flex items-center gap-2"
            style={{ 
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #9f7aea, #8b5cf6)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
            }}
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(categories).map(([name, data]) => (
            <button
              key={name}
              onClick={() => setSelectedCategory(name)}
              className="px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-150"
              style={{
                backgroundColor: selectedCategory === name ? '#2a2a2a' : '#222222',
                color: selectedCategory === name ? '#fff' : '#d1d1d1',
                boxShadow: selectedCategory === name ? '0 0 0 2px #8b5cf6' : 'none'
              }}
            >
              {data.icon} {name} <span style={{ color: '#8a8a8a' }}>{data.fixed ? `+${data.score}` : `+${customScore}`}</span>
            </button>
          ))}
        </div>

        {!categories[selectedCategory].fixed && (
          <div className="p-6 rounded-2xl" style={{ 
            backgroundColor: '#1c1c1e',
            boxShadow: `0 0 30px ${categories[selectedCategory].color}14`
          }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold" style={{ color: categories[selectedCategory].color }}>Customize Points</span>
              <span className="text-xs" style={{ color: '#8a8a8a' }}>Slide to adjust value</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <input 
                  type="range" 
                  min={categories[selectedCategory].min || 3}
                  max={categories[selectedCategory].max || 8}
                  value={customScore}
                  onChange={(e) => setCustomScore(Number(e.target.value))} 
                  className="w-full"
                  style={{
                    '--range-progress': `${((customScore - (categories[selectedCategory].min || 3)) / ((categories[selectedCategory].max || 8) - (categories[selectedCategory].min || 3))) * 100}%`,
                    '--slider-color': categories[selectedCategory].color
                  }}
                />
                <div className="flex justify-between mt-3 text-xs font-medium" style={{ color: '#6a6a6a' }}>
                  {Array.from({ length: (categories[selectedCategory].max || 8) - (categories[selectedCategory].min || 3) + 1 }, (_, i) => (
                    <span key={i}>{(categories[selectedCategory].min || 3) + i}</span>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="flex flex-col items-center justify-center transition-all duration-300"
                     style={{ 
                       filter: `drop-shadow(0 4px 12px ${categories[selectedCategory].color}${Math.round(20 + (customScore - 3) * 8).toString(16).padStart(2, '0')})`
                     }}>
                  <div className="text-5xl font-bold leading-none" style={{ 
                    color: categories[selectedCategory].color,
                    textShadow: `0 2px 8px ${categories[selectedCategory].color}50`
                  }}>
                    {customScore}
                  </div>
                  <div className="text-xs mt-2 font-medium" style={{ color: '#6a6a6a' }}>points</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="grid grid-cols-4 gap-4">
      {[
        { label: 'Weekly Score', value: weeklyScore, Icon: TrendingUp, color: '#8b5cf6', progress: Math.min(weeklyScore, 100), caption: 'of 100 points' },
        { label: 'Streak', value: streak, Icon: Flame, color: '#F97316', caption: streak >= 7 ? '🔥 On fire' : streak >= 3 ? '💪 Going strong' : 'Start today' },
        { label: 'Today', value: `${completedToday}/${totalToday}`, Icon: Target, color: '#10B981', progress: totalToday > 0 ? (completedToday / totalToday) * 100 : 0 },
        { label: 'This Week', value: completedThisWeek, Icon: Award, color: '#7C3AED', caption: 'tasks completed' }
      ].map((stat, idx) => (
        <div key={idx} className="rounded-2xl p-8 transition-colors duration-150" style={{ backgroundColor: '#1c1c1e' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.color}1a` }}>
              <stat.Icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#8a8a8a' }}>{stat.label}</span>
          </div>
          <div className="text-[56px] font-bold leading-none mb-4">
            {typeof stat.value === 'string' && stat.value.includes('/') ? (
              <>{stat.value.split('/')[0]}<span className="text-2xl" style={{ color: '#8a8a8a' }}>/{stat.value.split('/')[1]}</span></>
            ) : stat.value}
          </div>
          {stat.progress !== undefined && (
            <div className="h-1 rounded-full overflow-hidden mb-3" style={{ backgroundColor: '#222222' }}>
              <div className="h-full bg-white transition-all duration-500 ease-out" style={{ width: `${stat.progress}%` }} />
            </div>
          )}
          {stat.caption && <div className="text-xs" style={{ color: '#8a8a8a' }}>{stat.caption}</div>}
        </div>
      ))}
    </div>

    <div className="rounded-2xl p-8" style={{ backgroundColor: '#1c1c1e' }}>
      <h2 className="text-2xl font-semibold mb-6">Today's Tasks</h2>
      {getTodayTasks().length === 0 ? (
        <div className="text-center py-16">
          <Target className="w-16 h-16 mx-auto mb-4" style={{ color: '#555555' }} />
          <p className="text-lg mb-2" style={{ color: '#d1d1d1' }}>No tasks for today</p>
          <p className="text-sm" style={{ color: '#8a8a8a' }}>Get started by adding a task above</p>
        </div>
      ) : (
        <div className="space-y-2">
          {getTodayTasks().map(task => (
            <div 
              key={task.id} 
              className={`p-5 rounded-xl transition-all duration-150 group ${deletingTasks.has(task.id) ? 'deleting' : ''}`}
              style={{ backgroundColor: '#222222', opacity: task.completed ? 0.4 : 1 }}
            >
              <div className="flex items-center gap-4">
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  onChange={() => task.completed ? uncompleteTask(task.id) : completeTask(task.id)} 
                  className="checkbox" 
                />
                <div className="flex-1">
                  <div className={`font-medium ${task.completed ? 'line-through' : ''}`} style={{ color: task.completed ? '#8a8a8a' : '#fff' }}>
                    {task.text}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-sm" style={{ color: '#8a8a8a' }}>
                    <span>{categories[task.category].icon} {task.category}</span>
                    <span>•</span>
                    <span className="font-semibold" style={{ color: categories[task.category].color }}>
                      +{task.score} pts
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {task.completed && (
                    <button
                      onClick={() => uncompleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-2 rounded-lg"
                      style={{ backgroundColor: '#2a2a2a', color: '#d1d1d1' }}
                      title="Undo"
                    >
                      <Undo2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-2 rounded-lg"
                    style={{ backgroundColor: '#2a2a2a', color: '#ef4444' }}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="rounded-2xl p-8" style={{ backgroundColor: '#1c1c1e' }}>
      <h2 className="text-2xl font-semibold mb-6">This Week's Tasks</h2>
      {getWeekTasks().length === 0 ? (
        <div className="text-center py-16">
          <Award className="w-16 h-16 mx-auto mb-4" style={{ color: '#555555' }} />
          <p className="text-lg mb-2" style={{ color: '#d1d1d1' }}>No tasks this week</p>
          <p className="text-sm" style={{ color: '#8a8a8a' }}>Add some tasks to build momentum</p>
        </div>
      ) : (
        <div className="space-y-2">
          {getWeekTasks().map(task => {
            const taskDate = new Date(task.date);
            const today = new Date();
            const isToday = taskDate.toDateString() === today.toDateString();
            const daysAgo = Math.floor((today - taskDate) / (1000 * 60 * 60 * 24));
            
            return (
              <div 
                key={task.id} 
                className={`p-5 rounded-xl transition-all duration-150 group ${deletingTasks.has(task.id) ? 'deleting' : ''}`}
                style={{ backgroundColor: '#222222', opacity: task.completed ? 0.4 : 1 }}
              >
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    checked={task.completed}
                    onChange={() => task.completed ? uncompleteTask(task.id) : completeTask(task.id)} 
                    className="checkbox" 
                  />
                  <div className="flex-1">
                    <div className={`font-medium ${task.completed ? 'line-through' : ''}`} style={{ color: task.completed ? '#8a8a8a' : '#fff' }}>
                      {task.text}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-sm" style={{ color: '#8a8a8a' }}>
                      <span>{categories[task.category].icon} {task.category}</span>
                      <span>•</span>
                      <span className="font-semibold" style={{ color: categories[task.category].color }}>
                        +{task.score} pts
                      </span>
                      <span>•</span>
                      <span className="text-xs">
                        {isToday ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {task.completed && (
                      <button
                        onClick={() => uncompleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-2 rounded-lg"
                        style={{ backgroundColor: '#2a2a2a', color: '#d1d1d1' }}
                        title="Undo"
                      >
                        <Undo2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-2 rounded-lg"
                      style={{ backgroundColor: '#2a2a2a', color: '#ef4444' }}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>

    {getPreviousTasks().length > 0 && (
      <div className="rounded-2xl p-8" style={{ backgroundColor: '#1c1c1e' }}>
        <h2 className="text-2xl font-semibold mb-6">Previous Tasks</h2>
        <div className="space-y-2">
          {getPreviousTasks()
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(task => {
              const taskDate = new Date(task.date);
              const today = new Date();
              const daysAgo = Math.floor((today - taskDate) / (1000 * 60 * 60 * 24));
              
              return (
                <div 
                  key={task.id} 
                  className={`p-5 rounded-xl transition-all duration-150 group ${deletingTasks.has(task.id) ? 'deleting' : ''}`}
                  style={{ backgroundColor: '#222222', opacity: task.completed ? 0.4 : 1 }}
                >
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      checked={task.completed}
                      onChange={() => task.completed ? uncompleteTask(task.id) : completeTask(task.id)} 
                      className="checkbox" 
                    />
                    <div className="flex-1">
                      <div className={`font-medium ${task.completed ? 'line-through' : ''}`} style={{ color: task.completed ? '#8a8a8a' : '#fff' }}>
                        {task.text}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-sm" style={{ color: '#8a8a8a' }}>
                        <span>{categories[task.category].icon} {task.category}</span>
                        <span>•</span>
                        <span className="font-semibold" style={{ color: categories[task.category].color }}>
                          +{task.score} pts
                        </span>
                        <span>•</span>
                        <span className="text-xs">
                          {taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ({daysAgo} days ago)
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {task.completed && (
                        <button
                          onClick={() => uncompleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-2 rounded-lg"
                          style={{ backgroundColor: '#2a2a2a', color: '#d1d1d1' }}
                          title="Undo"
                        >
                          <Undo2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-2 rounded-lg"
                        style={{ backgroundColor: '#2a2a2a', color: '#ef4444' }}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    )}
  </div>
);

// Calendar 组件 - 后续消息继续
const CalendarView = ({ currentMonth, setCurrentMonth, selectedDate, setSelectedDate, getDaysInMonth, getTasksForDate, categories, completeTask, uncompleteTask, deleteTask, deletingTasks }) => {
  const isCurrentMonth = currentMonth.getMonth() === new Date().getMonth() && 
                         currentMonth.getFullYear() === new Date().getFullYear();
  
  return (
  <div className="space-y-6">
    <div className="grid gap-6" style={{ gridTemplateColumns: '2fr 1fr' }}>
      <div className="rounded-2xl p-5" style={{ backgroundColor: '#1c1c1e' }}>
        <div className="flex items-center mb-4 gap-4">
          <h2 className="text-xl font-bold whitespace-nowrap truncate flex-1 min-w-0">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2 flex-shrink-0">
            <button 
              onClick={() => {
                const d = new Date(currentMonth);
                d.setMonth(d.getMonth() - 1);
                setCurrentMonth(d);
              }} 
              className="p-2 rounded-lg transition-all duration-150"
              style={{ backgroundColor: '#222222' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#222222'}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = '#333333';
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2a2a';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {
                setCurrentMonth(new Date());
                setSelectedDate(new Date());
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={{ 
                backgroundColor: isCurrentMonth ? '#3a3a3a' : '#222222',
                color: isCurrentMonth ? '#f5f5f5' : '#d1d1d1'
              }}
              onMouseEnter={(e) => {
                if (!isCurrentMonth) {
                  e.currentTarget.style.backgroundColor = '#2a2a2a';
                } else {
                  e.currentTarget.style.backgroundColor = '#454545';
                }
              }}
              onMouseLeave={(e) => {
                if (!isCurrentMonth) {
                  e.currentTarget.style.backgroundColor = '#222222';
                } else {
                  e.currentTarget.style.backgroundColor = '#3a3a3a';
                }
              }}
              onMouseDown={(e) => {
                if (!isCurrentMonth) {
                  e.currentTarget.style.backgroundColor = '#333333';
                } else {
                  e.currentTarget.style.backgroundColor = '#505050';
                }
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                if (!isCurrentMonth) {
                  e.currentTarget.style.backgroundColor = '#2a2a2a';
                } else {
                  e.currentTarget.style.backgroundColor = '#454545';
                }
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Today
            </button>
            <button 
              onClick={() => {
                const d = new Date(currentMonth);
                d.setMonth(d.getMonth() + 1);
                setCurrentMonth(d);
              }} 
              className="p-2 rounded-lg transition-all duration-150"
              style={{ backgroundColor: '#222222' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#222222'}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = '#333333';
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2a2a';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-xs font-semibold pb-2 uppercase tracking-wider" style={{ color: '#8a8a8a' }}>
              {day}
            </div>
          ))}
          {getDaysInMonth().map((date, idx) => {
            if (!date) return <div key={`e-${idx}`} className="h-12" />;
            const dayTasks = getTasksForDate(date);
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            const completedCount = dayTasks.filter(t => t.completed).length;
            const hasCompletedTasks = completedCount > 0;
            const hasUncompletedTasks = dayTasks.length > completedCount;

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(date)}
                className="h-12 rounded-lg relative flex items-center justify-center transition-all duration-150"
                style={{
                  backgroundColor: isSelected ? '#2a2a2a' : '#1c1c1e',
                  outline: isSelected ? '2px solid #8b5cf6' : isToday ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  outlineOffset: '-2px'
                }}
              >
                <span className="text-sm font-semibold" style={{ color: isToday && !isSelected ? '#8b5cf6' : '#fff' }}>
                  {date.getDate()}
                </span>

                {isToday && !isSelected && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: '#8b5cf6' }} />
                )}

                {dayTasks.length > 0 && (
                  <div className="absolute top-1 right-1 flex gap-0.5">
                    {hasCompletedTasks && (
                      <div 
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: categories[dayTasks.find(t => t.completed)?.category]?.color || '#00D9FF' }}
                      />
                    )}
                    {hasUncompletedTasks && (
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#8a8a8a' }} />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl p-5 flex flex-col" style={{ backgroundColor: '#1c1c1e', width: '100%' }}>
        <h3 className="text-base font-semibold mb-4">
          {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </h3>
        
        {getTasksForDate(selectedDate).length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-xl flex-shrink-0" style={{ backgroundColor: '#222222' }}>
            <div>
              <div className="text-2xl font-bold">{getTasksForDate(selectedDate).length}</div>
              <div className="text-xs" style={{ color: '#8a8a8a' }}>Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>
                {getTasksForDate(selectedDate).filter(t => t.completed).length}
              </div>
              <div className="text-xs" style={{ color: '#8a8a8a' }}>Done</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: '#00D9FF' }}>
                {getTasksForDate(selectedDate).filter(t => t.completed).reduce((sum, t) => sum + t.score, 0)}
              </div>
              <div className="text-xs" style={{ color: '#8a8a8a' }}>Points</div>
            </div>
          </div>
        )}
        
        {getTasksForDate(selectedDate).length === 0 ? (
          <div className="text-center py-12 flex-1 flex flex-col items-center justify-center">
            <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: '#555555' }} />
            <p className="text-sm mb-4" style={{ color: '#8a8a8a' }}>No tasks this day</p>
          </div>
        ) : (
          <div className="space-y-2 flex-1 overflow-y-auto">
            {getTasksForDate(selectedDate).map(task => (
              <div 
                key={task.id} 
                className={`p-4 rounded-xl transition-colors duration-150 group ${deletingTasks.has(task.id) ? 'deleting' : ''}`}
                style={{ 
                  backgroundColor: '#222222',
                  opacity: task.completed ? 0.5 : 1
                }}
              >
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    checked={task.completed}
                    onChange={() => task.completed ? uncompleteTask(task.id) : completeTask(task.id)} 
                    className="checkbox mt-0.5" 
                  />
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${task.completed ? 'line-through' : ''}`} style={{ color: task.completed ? '#8a8a8a' : '#fff' }}>
                      {task.text}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: '#8a8a8a' }}>
                      <span>{categories[task.category].icon}</span>
                      <span className="font-bold" style={{ color: categories[task.category].color }}>
                        +{task.score}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {task.completed && (
                      <button
                        onClick={() => uncompleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1.5 rounded-lg"
                        style={{ backgroundColor: '#2a2a2a', color: '#d1d1d1' }}
                        title="Undo"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1.5 rounded-lg"
                      style={{ backgroundColor: '#2a2a2a', color: '#ef4444' }}
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

const StatsView = ({ tasks, getWeeklyTrend, getCategoryStats, getCalendarData, weekHistory }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-4 gap-4">
      <div className="rounded-2xl p-8" style={{ backgroundColor: '#1c1c1e' }}>
        <div className="text-[56px] font-bold leading-none mb-2">{tasks.length}</div>
        <div className="text-sm" style={{ color: '#8a8a8a' }}>Total Tasks</div>
      </div>
      <div className="rounded-2xl p-8" style={{ backgroundColor: '#1c1c1e' }}>
        <div className="text-[56px] font-bold leading-none mb-2" style={{ color: '#00D9FF' }}>
          {tasks.filter(t => t.completed).length}
        </div>
        <div className="text-sm" style={{ color: '#8a8a8a' }}>Completed</div>
      </div>
      <div className="rounded-2xl p-8" style={{ backgroundColor: '#1c1c1e' }}>
        <div className="text-[56px] font-bold leading-none mb-2" style={{ color: '#8b5cf6' }}>
          {tasks.filter(t => t.completed).reduce((sum, t) => sum + t.score, 0)}
        </div>
        <div className="text-sm" style={{ color: '#8a8a8a' }}>Total Points</div>
      </div>
      <div className="rounded-2xl p-8" style={{ backgroundColor: '#1c1c1e' }}>
        <div className="text-[56px] font-bold leading-none mb-2" style={{ color: '#F97316' }}>
          {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
        </div>
        <div className="text-sm" style={{ color: '#8a8a8a' }}>Completion</div>
      </div>
    </div>

    <div className="rounded-2xl p-10" style={{ backgroundColor: '#1c1c1e' }}>
      <h3 className="text-2xl font-bold mb-8">Weekly Performance</h3>
      <WeeklyChart data={getWeeklyTrend()} />
    </div>

    <div className="rounded-2xl p-10" style={{ backgroundColor: '#1c1c1e' }}>
      <h3 className="text-2xl font-bold mb-8">Category Breakdown</h3>
      <div className="space-y-6">
        {getCategoryStats().map(cat => {
          // 找出所有类别中的最大完成次数，用于归一化进度条
          const maxCompleted = Math.max(...getCategoryStats().map(c => c.completed), 1);
          const barWidth = (cat.completed / maxCompleted) * 100;
          
          return (
            <div key={cat.name}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                       style={{ backgroundColor: `${cat.color}15` }}>
                    {cat.icon}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{cat.name}</div>
                    <div className="text-sm" style={{ color: '#8a8a8a' }}>
                      {cat.completed} completed · {cat.points} points
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold" style={{ color: cat.color }}>
                    {cat.completed}
                  </div>
                  <div className="text-xs" style={{ color: '#8a8a8a' }}>times</div>
                </div>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#1c1c1e' }}>
                <div 
                  className="h-full transition-all duration-500 rounded-full"
                  style={{ 
                    width: `${barWidth}%`, 
                    backgroundColor: cat.color,
                    boxShadow: `0 0 12px ${cat.color}50`
                  }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <div className="rounded-2xl p-10" style={{ backgroundColor: '#1c1c1e' }}>
      <h3 className="text-2xl font-bold mb-6">30-Day Activity</h3>
      <div className="grid grid-cols-10 gap-2.5">
        {getCalendarData().map((day, idx) => {
          const intensity = day.score > 0 ? Math.min((day.score / 20) * 100, 100) : 0;
          return (
            <div 
              key={idx} 
              className="aspect-square rounded-md transition-all cursor-pointer hover:scale-110"
              style={{ background: day.score > 0 ? `rgba(0, 217, 255, ${intensity/100})` : '#222222' }}
              title={`${day.date.toLocaleDateString()}: ${day.score} pts`} 
            />
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-6 text-xs" style={{ color: '#8a8a8a' }}>
        <span>Less</span>
        <div className="flex gap-1.5">
          <div className="w-5 h-5 rounded-md" style={{ backgroundColor: '#222222' }}></div>
          <div className="w-5 h-5 rounded-md" style={{ background: 'rgba(0, 217, 255, 0.3)' }}></div>
          <div className="w-5 h-5 rounded-md" style={{ background: 'rgba(0, 217, 255, 0.6)' }}></div>
          <div className="w-5 h-5 rounded-md" style={{ background: 'rgba(0, 217, 255, 1)' }}></div>
        </div>
        <span>More</span>
      </div>
    </div>
  </div>
);

const WeeklyChart = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  // 动态计算最大值，至少为 20，向上取整到 10 的倍数
  const rawMax = Math.max(...data.map(d => d.score), 20);
  const maxScore = Math.ceil(rawMax / 10) * 10;
  const h = 280, w = 700;
  
  return (
    <div className="relative h-80">
      {hoveredIndex !== null && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-xl shadow-xl z-10" style={{ backgroundColor: '#2a2a2a', border: '1px solid #222222' }}>
          <div className="text-xs mb-1" style={{ color: '#8a8a8a' }}>{data[hoveredIndex].week}</div>
          <div className="text-2xl font-bold">
            {data[hoveredIndex].score} <span className="text-sm" style={{ color: '#8a8a8a' }}>pts</span>
          </div>
          <div className="text-xs" style={{ color: '#d1d1d1' }}>{data[hoveredIndex].tasks} tasks</div>
        </div>
      )}
      
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const v = (maxScore / 4) * i;
          return (
            <g key={i}>
              <line 
                x1="60" 
                y1={h - 40 - (i / 4 * (h - 80))} 
                x2={w - 30} 
                y2={h - 40 - (i / 4 * (h - 80))}
                stroke="#2a2a2a" 
                strokeWidth="1" 
              />
              <text 
                x="45" 
                y={h - 40 - (i / 4 * (h - 80)) + 5} 
                fill="#8a8a8a" 
                fontSize="12" 
                textAnchor="end"
              >
                {Math.round(v)}
              </text>
            </g>
          );
        })}
        
        <text x="30" y="20" fill="#8a8a8a" fontSize="11" fontWeight="500">pts</text>
        
        <polyline 
          points={data.map((d, i) => {
            const x = 90 + (i * ((w - 120) / (data.length - 1)));
            const y = h - 40 - (d.score / maxScore * (h - 80));
            return `${x},${y}`;
          }).join(' ')} 
          fill="none" 
          stroke="#8b5cf6" 
          strokeWidth="3" 
          strokeLinecap="round" 
        />
        
        {data.map((d, i) => {
          const x = 90 + (i * ((w - 120) / (data.length - 1)));
          const y = h - 40 - (d.score / maxScore * (h - 80));
          const isHovered = hoveredIndex === i;
          
          return (
            <g key={i}>
              <circle 
                cx={x} 
                cy={y} 
                r={isHovered ? 10 : 7}
                fill="#0d0d0d" 
                stroke="#8b5cf6" 
                strokeWidth="3"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer transition-all"
                style={{ transition: 'all 150ms ease' }}
              />
              <text 
                x={x} 
                y={h - 15} 
                textAnchor="middle" 
                fill="#d1d1d1" 
                fontSize="12" 
                fontWeight="500"
              >
                {d.week}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default App;
