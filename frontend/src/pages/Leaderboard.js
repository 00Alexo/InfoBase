import React, { useState, useEffect, useMemo } from 'react';
import { useAuthContext } from '../Hooks/useAuthContext';
import {useNavigate} from 'react-router-dom'

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('total');
  const [leaderboardData, setLeaderboardData] = useState({
    total: [],
    python: [],
    java: [],
    cpp: [],
    elo: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API}/problems/getLeaderboard?type=${activeTab}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();

        if (response.ok) {
          setLeaderboardData(prev => ({
            ...prev,
            [activeTab]: data.leaderboard
          }));
          console.log(data);
        } else {
          throw new Error(data.error || 'Failed to fetch leaderboard');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch leaderboard data');
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [activeTab]);

  const tabs = [
    { id: 'total', label: 'Total Problems' },
    { id: 'python', label: 'Python'},
    { id: 'java', label: 'Java' },
    { id: 'cpp', label: 'C++'},
    { id: 'elo', label: 'Code Battles' }
  ];

  const currentLeaderboard = leaderboardData[activeTab] || [];
  const currentUserId = user?.id || user?._id;

  const getMetricValue = (entry) => {
    if (activeTab === 'elo') {
      return `${entry.eloScore} ELO`;
    }
    return `${entry.problemsSolved} solved`;
  };

  const getMetricHeader = () => {
    if (activeTab === 'elo') {
      return 'ELO Score';
    }
    return 'Problems Solved';
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const isCurrentUser = (userId) => {
    return currentUserId && userId === currentUserId;
  };

  const getUserInitials = (username) => {
    return username.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mb-4"></div>
              <div className="text-gray-400">Loading leaderboard...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="text-red-400 text-xl mb-2">⚠️</div>
              <div className="text-gray-400">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-gray-400">Compete with the best coders and climb the ranks</p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2 p-1 bg-gray-800 rounded-xl border border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-none justify-center ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <span className="text-sm sm:text-base">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="bg-gray-750 border-b border-gray-700">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-6 sm:col-span-7">User</div>
              <div className="col-span-5 sm:col-span-4 text-right">{getMetricHeader()}</div>
            </div>
          </div>

          <div className="divide-y divide-gray-700">
            {currentLeaderboard.map((entry, index) => (
              <div
                key={`${entry.userId}-${index}`}
                className={`grid grid-cols-12 gap-4 px-6 py-4 transition-all duration-200 hover:bg-gray-750 ${
                  isCurrentUser(entry.userId) 
                    ? 'bg-red-950/20 border-l-4 border-l-red-500 shadow-lg shadow-red-500/10' 
                    : ''
                }`}
              >
                <div className="col-span-1 flex items-center justify-center">
                  <span className={`text-lg font-bold ${
                    entry.rank <= 3 ? 'text-2xl' : 'text-gray-300'
                  }`}>
                    {entry.rank}
                  </span>
                </div>

                <div className="col-span-6 sm:col-span-7 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isCurrentUser(entry.userId)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {entry.avatar ? (
                      <img 
                        src={entry.avatar} 
                        alt={entry.username} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getUserInitials(entry.username)
                    )}
                  </div>

                  <div onClick={() => navigate(`/profile/${entry.username}`)} className="flex flex-col cursor-pointer">
                    <button className={`text-left hover:text-red-400 transition-colors font-medium ${
                      isCurrentUser(entry.userId) ? 'text-red-400' : 'text-white'
                    }`}>
                      {entry.username}
                    </button>
                    {isCurrentUser(entry.userId) && (
                      <div className="text-xs text-red-400 font-medium">You</div>
                    )}
                  </div>
                </div>

                <div className="col-span-5 sm:col-span-4 flex items-center justify-end">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      isCurrentUser(entry.userId) ? 'text-red-400' : 'text-white'
                    }`}>
                      {activeTab === 'elo' ? entry.ELO : entry.problemsSolved}
                    </div>
                    <div className="text-xs text-gray-400">
                      {activeTab === 'elo' ? 'ELO' : 'problems'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentLeaderboard.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              <div className="text-lg font-medium mb-2">No data available</div>
              <div className="text-sm">Start solving problems to appear on the leaderboard!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;