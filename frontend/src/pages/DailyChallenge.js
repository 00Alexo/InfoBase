import React, { useMemo, useRef, useState, useEffect } from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const mockProblems = [
  { name: "Two Sum", difficulty: "Easy" },
  { name: "Valid Parentheses", difficulty: "Easy" },
  { name: "Merge Two Sorted Lists", difficulty: "Easy" },
  { name: "Best Time to Buy Stock", difficulty: "Easy" },
  { name: "Valid Palindrome", difficulty: "Easy" },
  { name: "Invert Binary Tree", difficulty: "Easy" },
  { name: "Binary Search", difficulty: "Easy" },
  { name: "Flood Fill", difficulty: "Easy" },
  { name: "Maximum Subarray", difficulty: "Easy" },
  { name: "Climbing Stairs", difficulty: "Easy" },
  { name: "Add Two Numbers", difficulty: "Medium" },
  { name: "Longest Substring", difficulty: "Medium" },
  { name: "Container With Water", difficulty: "Medium" },
  { name: "3Sum", difficulty: "Medium" },
  { name: "Group Anagrams", difficulty: "Medium" },
  { name: "Product Except Self", difficulty: "Medium" },
  { name: "Valid Sudoku", difficulty: "Medium" },
  { name: "Rotate Image", difficulty: "Medium" },
  { name: "Spiral Matrix", difficulty: "Medium" },
  { name: "Jump Game", difficulty: "Medium" },
  { name: "Median of Arrays", difficulty: "Hard" },
  { name: "Trapping Rain Water", difficulty: "Hard" },
  { name: "Merge k Sorted Lists", difficulty: "Hard" },
  { name: "Word Ladder", difficulty: "Hard" },
  { name: "Serialize Binary Tree", difficulty: "Hard" },
];

const DailyChallenge = ({ onClick, userInfo }) => {
  const [popup, setPopup] = useState({ visible: false, message: '' });
  const today = new Date();
  const dayRefs = useRef([]);

  const minDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
  const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const generateMockProblems = useMemo(() => {
    const problems = {};
    const startDate = new Date(minDate);
    const endDate = new Date(today);
    
    let currentDate = new Date(startDate);
    let problemIndex = 0;
    
    while (currentDate <= endDate) {
      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
      const problem = mockProblems[problemIndex % mockProblems.length];
      
      const isPastDate = currentDate < today;
      const isToday = currentDate.toDateString() === today.toDateString();
      const solved = isPastDate ? Math.random() < 0.7 : false;
      
      problems[dateKey] = {
        ...problem,
        solved: solved,
        points: solved ? Math.floor(Math.random() * 50) + 10 : 0,
        isPastDate,
        isToday
      };
      
      currentDate.setDate(currentDate.getDate() + 1);
      problemIndex++;
    }
    
    return problems;
  }, []);

  const canGoToPreviousMonth = () => {
    if (currentYear > minDate.getFullYear()) return true;
    if (currentYear === minDate.getFullYear() && currentMonth > minDate.getMonth()) return true;
    return false;
  };

  const canGoToNextMonth = () => {
    if (currentYear < maxDate.getFullYear()) return true;
    if (currentYear === maxDate.getFullYear() && currentMonth < maxDate.getMonth()) return true;
    return false;
  };

  const goToPreviousMonth = () => {
    if (canGoToPreviousMonth()) {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
  };

  const goToNextMonth = () => {
    if (canGoToNextMonth()) {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const generateCalendar = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const calendarDays = [];
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push({
        year: currentYear,
        month: currentMonth,
        day: day,
      });
    }

    const totalCells = Math.ceil(calendarDays.length / 7) * 7;
    while (calendarDays.length < totalCells) {
      calendarDays.push(null);
    }

    const calendarWeeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      calendarWeeks.push(calendarDays.slice(i, i + 7));
    }
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayData, index) => {
          if (!dayData) {
            return <div key={`empty-${index}`} className="aspect-[1.3] w-full"></div>;
          }
          
          const { year, month, day } = dayData;
          const dateKey = `${year}-${month}-${day}`;
          const problem = generateMockProblems[dateKey];
          
          const isToday = 
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          
          const currentDate = new Date(year, month, day);
          const isPastDate = currentDate < today;
          const isFutureDate = currentDate > today;

          if (isFutureDate) {
            return (
              <div
                key={`${month}-${day}`}
                className="relative group flex aspect-[1.3] w-full rounded-xl border font-medium border-gray-700 bg-gray-800 text-gray-500"
              >
                <span className="absolute left-1 top-1 flex items-center justify-center rounded-full text-base sm:text-lg lg:text-xl font-semibold">
                  {day}
                </span>
              </div>
            );
          }
          
          const getDifficultyColor = (difficulty) => {
            switch (difficulty) {
              case 'Easy': return 'text-green-400';
              case 'Medium': return 'text-yellow-400';
              case 'Hard': return 'text-red-400';
              default: return 'text-gray-400';
            }
          };
          
          return (
            <div
              key={`${month}-${day}`}
              className={`relative group flex flex-col aspect-[1.3] w-full rounded-xl border font-medium transition-all hover:z-20 cursor-pointer ${
                isToday 
                  ? 'bg-red-900 border-red-500 text-red-100 shadow-lg shadow-red-500/20 ring-2 ring-red-500/50'
                  : problem?.solved
                  ? 'bg-gray-800 border-green-500/50 text-green-400'
                  : isPastDate 
                  ? 'bg-gray-800 border-red-500/50 text-red-400'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-red-500/50'
              }`}
              onClick={() => onClick && onClick(problem, dateKey)}
            >
              <span className="absolute left-1 top-1 flex items-center justify-center rounded-full text-base sm:text-lg lg:text-xl font-semibold">
                {day}
              </span>
              
              {problem && (
                <div className="mt-6 px-1 flex flex-col items-center justify-center text-center flex-1">
                  <div className="text-xs font-medium truncate w-full px-1 mb-1" title={problem.name}>
                    {problem.name}
                  </div>
                  <div className={`text-xs ${getDifficultyColor(problem.difficulty)} font-semibold mb-1`}>
                    {problem.difficulty}
                  </div>
                  
                  <div className="mt-1 flex items-center gap-1">
                    {problem.solved ? (
                      <>
                        <span className="text-green-400 text-sm font-bold">SOLVED</span>
                      </>
                    ) : isPastDate ? (
                      <span className="text-red-400 text-sm font-bold">FAILED</span>
                    ) : isToday ? (
                      <span className="text-red-300 text-xs font-bold">TODAY</span>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }, [currentYear, currentMonth, generateMockProblems, onClick]);

  return (
    <div className="calendar-container max-h-full overflow-y-scroll rounded-t-2xl bg-gray-900 pb-10 text-white shadow-xl">
      {popup.visible && (
        <div className="absolute bottom-10 left-1/2 z-50 transform -translate-x-1/2 bg-red-600 text-white p-4 rounded-lg shadow-md">
          {popup.message}
        </div>
      )}

      <div className="w-full rounded-t-2xl bg-gray-900 px-5 pt-7 pb-4 sm:px-10 sm:pt-8 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">
            Daily Problems Calendar
          </h2>
          
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousMonth}
              disabled={!canGoToPreviousMonth()}
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 hover:bg-gray-700 hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white font-medium"
            >
              ← Prev
            </button>
            
            <span className="text-lg font-medium min-w-[140px] text-center text-red-400">
              {monthNames[currentMonth]} {currentYear}
            </span>
            
            <button
              onClick={goToNextMonth}
              disabled={!canGoToNextMonth()}
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 hover:bg-gray-700 hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white font-medium"
            >
              Next →
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-400">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-800 border border-green-500/50 rounded"></div>
              <span>Solved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-800 border border-red-500/50 rounded"></div>
              <span>Failed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-900 border border-red-500 rounded"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-800 border border-gray-700 rounded"></div>
              <span>Future</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid px-5 sm:px-10 w-full grid-cols-7 text-center text-xs font-semibold uppercase text-gray-400 sm:text-sm border-b border-gray-800 pb-2 mt-4">
        {daysOfWeek.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      
      <div className="mt-4 mx-5 sm:mx-10">
        {generateCalendar}
      </div>
    </div>
  );
};

export default DailyChallenge;