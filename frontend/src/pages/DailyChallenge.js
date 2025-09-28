import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DailyChallenge = ({ onClick, userInfo }) => {
  const navigate = useNavigate();
  const [dailyProblems, setDailyProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDailyProblems = async () => {
    setLoading(true);
    const response = await fetch(`${process.env.REACT_APP_API}/problems/getCalendar`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const json = await response.json();

    if (response.ok) {
      setDailyProblems(json);
      setLoading(false);
    }

    if (!response.ok) {
      console.log(json.error);
    }
  }

  useEffect(() => {
    if (userInfo) {
      getDailyProblems();
    }
  }, [userInfo]);

  const [popup, setPopup] = useState({ visible: false, message: '' });
  const today = new Date();
  const dayRefs = useRef([]);

  const minDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
  const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const parseSpecialDate = (specialDate) => {
    if (!specialDate) return null;
    
    const match = specialDate.match(/^(\d{1,2})([a-z]+)(\d{4})$/i);
    if (!match) return null;
    
    const [, day, monthStr, year] = match;
    
    const monthMap = {
      'jan': 0, 'january': 0,
      'feb': 1, 'february': 1,
      'mar': 2, 'march': 2,
      'apr': 3, 'april': 3,
      'may': 4,
      'jun': 5, 'june': 5,
      'jul': 6, 'july': 6,
      'aug': 7, 'august': 7,
      'sep': 8, 'sept': 8, 'september': 8,
      'oct': 9, 'october': 9,
      'nov': 10, 'november': 10,
      'dec': 11, 'december': 11
    };
    
    const monthNum = monthMap[monthStr.toLowerCase()];
    if (monthNum === undefined) return null;
    
    return new Date(parseInt(year), monthNum, parseInt(day));
  };

  const isProblemSolved = (problemId, date) => {
    if (!userInfo?.solvedProblems) return false;
    
    return userInfo.solvedProblems.some(solved => solved.problemId === problemId);
  };

  const processedProblems = useMemo(() => {
    const problems = {};
    
    dailyProblems.forEach(problem => {
      const problemDate = parseSpecialDate(problem.specialDate);
      if (!problemDate) return;
      
      const dateKey = `${problemDate.getFullYear()}-${problemDate.getMonth()}-${problemDate.getDate()}`;
      const isPastDate = problemDate < today;
      const isToday = problemDate.toDateString() === today.toDateString();
      const solved = isProblemSolved(problem.problemId, problemDate);
      
      problems[dateKey] = {
        name: problem.problemName,
        difficulty: problem.problemDifficulty,
        problemId: problem.problemId,
        solved: solved,
        points: solved ? Math.floor(Math.random() * 50) + 10 : 0,
        isPastDate,
        isToday,
        date: problemDate
      };
    });
    
    return problems;
  }, [dailyProblems, userInfo, today]);

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

    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="text-gray-400">Loading calendar data...</div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayData, index) => {
          if (!dayData) {
            return <div key={`empty-${index}`} className="aspect-[1.5] w-full"></div>;
          }
          
          const { year, month, day } = dayData;
          const dateKey = `${year}-${month}-${day}`;
          const problem = processedProblems[dateKey];
          
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
                className="relative group flex aspect-[1.5] w-full rounded-xl border font-medium border-gray-700 bg-gray-800 text-gray-500"
              >
                <span className="absolute left-2 top-2 flex items-center justify-center rounded-full text-lg sm:text-xl lg:text-2xl font-semibold">
                  {day}
                </span>
              </div>
            );
          }

          if (!problem) {
            return (
              <div
                key={`${month}-${day}`}
                className="relative group flex aspect-[1.5] w-full rounded-xl border font-medium border-gray-700 bg-gray-800 text-gray-400"
              >
                <span className="absolute left-2 top-2 flex items-center justify-center rounded-full text-lg sm:text-xl lg:text-2xl font-semibold">
                  {day}
                </span>
                <div className="flex-1 flex items-center justify-center text-sm font-medium">
                  No Problem
                </div>
              </div>
            );
          }
          
          const getDifficultyColor = (difficulty) => {
            switch (difficulty?.toLowerCase()) {
              case 'easy': return 'text-green-400';
              case 'medium': return 'text-yellow-400';
              case 'hard': return 'text-red-400';
              default: return 'text-gray-400';
            }
          };
          
          return (
            <div
              key={`${month}-${day}`}
              className={`relative group flex flex-col aspect-[1.5] w-full rounded-xl border font-medium transition-all hover:z-20 cursor-pointer ${
                isToday 
                  ? 'bg-red-900 border-red-500 text-red-100 shadow-lg shadow-red-500/20 ring-2 ring-red-500/50'
                  : problem?.solved
                  ? 'bg-gray-800 border-green-500/50 text-green-400'
                  : isPastDate 
                  ? 'bg-gray-800 border-red-500/50 text-red-400'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-red-500/50'
              }`}
              onClick={() => navigate(`/problems/${problem.problemId}`)}
            >
              <span className="absolute left-2 top-2 flex items-center justify-center rounded-full text-lg sm:text-xl lg:text-2xl font-semibold">
                {day}
              </span>
              
              <div className="mt-8 px-2 flex flex-col items-center justify-center text-center flex-1">
                <div className="text-sm font-medium truncate w-full px-1 mb-2" title={problem.name}>
                  {problem.name}
                </div>
                <div className={`text-sm ${getDifficultyColor(problem.difficulty)} font-semibold mb-2`}>
                  {problem.difficulty}
                </div>
                
                <div className="mt-1 flex items-center gap-1">
                  {problem.solved ? (
                    <span className="text-green-400 text-sm font-bold">SOLVED</span>
                  ) : isPastDate ? (
                    <span className="text-red-400 text-sm font-bold">FAILED</span>
                  ) : isToday ? (
                    <span className="text-red-300 text-sm font-bold">TODAY</span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [currentYear, currentMonth, processedProblems, onClick, loading]);

  return (
    <div className="calendar-container max-h-full overflow-y-hidden rounded-t-2xl bg-gray-900 pb-10 text-white shadow-xl min-h-[calc(100vh-70px)]">
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
              <span>Future/No Problem</span>
            </div>
          </div>
        </div>
        
        {!loading && dailyProblems.length > 0 && (
          <div className="mt-2 text-sm text-gray-500">
            Showing {dailyProblems.length} daily problems
          </div>
        )}
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