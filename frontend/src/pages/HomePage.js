import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardBody, 
  Avatar, 
  Button, 
  Chip, 
  Progress,
  Link,
  Badge
} from '@heroui/react';
import {useLocation, useNavigate} from 'react-router-dom';
import { 
  FaGithub, 
  FaLinkedin, 
  FaGlobe, 
  FaMapMarkerAlt,
  FaCode,
  FaTrophy,
  FaFire,
  FaChartLine,
  FaCalendarAlt,
  FaClock,
  FaChevronRight,
  FaStar,
  FaEye,
  FaChartBar,
  FaBolt,
  FaAward,
  FaBullseye,
  FaCrown,
  FaRocket,
  FaGem,
  FaUsers,
  FaLayerGroup,
} from 'react-icons/fa';
import NavBar from '../components/NavBar';

const HomePage = ({ userInfo }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = userInfo ? { ...userInfo } : null;

  const availableTags = {
    'Base programming elements': 'IX',
    'Elementary algorithms': 'IX', 
    'One-dimensional tables (Arrays)': 'IX',
    'Two-dimensional arrays (matrices)': 'IX',
    'Functions': 'X',
    'Recursion': 'X',
    'DivideEtImpera': 'X',
    'Chars & Strings': 'X',
    'Backtracking': 'XI',
    'Dynamic Programming': 'XI',
    'Graph Theory': 'XI',
    'OOP': 'XI'
  };

  const stats = useMemo(() => {
    if (!user) return { totalSubmissions: 0, problemsSolved: 0, successRate: 0, unlockedAchievements: 0 };
    
    const totalSubmissions = user.submissions?.length || 0;
    const problemsSolved = user.solvedProblems?.length || 0;
    const successRate = totalSubmissions > 0 ? Math.round((problemsSolved / totalSubmissions) * 100) : 0;
    const unlockedAchievements = user.achievements?.filter(achievement => achievement.unlocked).length || 0;
    
    return {
      totalSubmissions,
      problemsSolved,
      successRate,
      unlockedAchievements
    };
  }, [user]);

  const languageStats = useMemo(() => {
    if (!user || !user.submissions || user.submissions.length === 0) return [];

    const languageCount = {};
    const languageScores = {};

    user.submissions.forEach(submission => {
      const lang = submission.language || 'Unknown';
      languageCount[lang] = (languageCount[lang] || 0) + 1;
      if (!languageScores[lang]) languageScores[lang] = [];
      languageScores[lang].push(submission.score || 0);
    });

    return Object.entries(languageCount)
      .map(([language, count]) => ({
        language,
        count,
        percentage: Math.round((count / user.submissions.length) * 100),
        averageScore: (languageScores[language] && languageScores[language].length > 0)
          ? Math.round(languageScores[language].reduce((a, b) => a + b, 0) / languageScores[language].length)
          : 0
      }))
      .sort((a, b) => b.count - a.count);
  }, [user?.submissions]);

  const difficultyStats = useMemo(() => {
    if (!user || !user.submissions || user.submissions.length === 0) return [];
    
    const difficultyData = {};
    
    user.submissions.forEach(submission => {
      const diff = submission.difficulty || 'Unknown';
      if (!difficultyData[diff]) {
        difficultyData[diff] = { total: 0, solved: 0, totalScore: 0 };
      }
      difficultyData[diff].total += 1;
      difficultyData[diff].totalScore += submission.score || 0;
      if ((submission.score || 0) >= 100) {
        difficultyData[diff].solved += 1;
      }
    });
    
    return Object.entries(difficultyData)
      .map(([difficulty, data]) => ({
        difficulty,
        total: data.total,
        solved: data.solved,
        averageScore: data.total > 0 ? Math.round(data.totalScore / data.total) : 0,
        solveRate: data.total > 0 ? Math.round((data.solved / data.total) * 100) : 0
      }));
  }, [user]);

  const tagStats = useMemo(() => {
    const tagData = {};
    const submissions = user?.submissions || [];

    Object.keys(availableTags).forEach(tagName => {
        tagData[tagName] = {
        count: 0,
        solvedCount: 0,
        totalScore: 0,
        scores: [],
        isClass: false
        };
    });
    
    ['IX', 'X', 'XI'].forEach(className => {
        tagData[className] = {
        count: 0,
        solvedCount: 0,
        totalScore: 0,
        scores: [],
        isClass: true
        };
    });
    
    if (user?.solvedProblems && user.solvedProblems.length > 0) {
        user.solvedProblems.forEach(solvedProblem => {
        if (solvedProblem.tags) {
            solvedProblem.tags.forEach(tagObj => {
            const tagName = tagObj.name;
            const isClass = tagObj.class;
            
            if (!tagData[tagName]) {
                tagData[tagName] = {
                count: 0,
                solvedCount: 0,
                totalScore: 0,
                scores: [],
                isClass: isClass
                };
            }
            
            tagData[tagName].count += 1;
            tagData[tagName].solvedCount += 1;
            
            const submission = submissions.find(sub => sub.problemId === solvedProblem.problemId);
            if (submission && submission.score !== undefined) {
                tagData[tagName].totalScore += submission.score;
                tagData[tagName].scores.push(submission.score);
            } else {
                tagData[tagName].totalScore += 100;
                tagData[tagName].scores.push(100);
            }
            });
        }
        });
    }

    return Object.entries(tagData)
        .map(([tagName, data]) => ({
        tag: tagName,
        count: data.count,
        averageScore: data.scores.length > 0 
            ? Math.round(data.totalScore / data.scores.length) 
            : 0, 
        solvedCount: data.solvedCount,
        isClass: data.isClass
        }))
        .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.tag.localeCompare(b.tag);
        });
}, [user]);

  const recentSubmissions = useMemo(() => {
    if (!user?.submissions || user?.submissions.length === 0) return [];
    return user.submissions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
  }, [user?.submissions]);

  const previewAchievements = useMemo(() => {
    if (!user?.achievements) return [];
    return user.achievements
      .filter(achievement => achievement.unlocked)
      .slice(0, 8);
  }, [user?.achievements]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getScoreColor = (score) => {
    if (score >= 100) return "success";
    if (score >= 75) return "warning";
    if (score >= 50) return "secondary";
    return "danger";
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "success";
      case "medium": return "warning";
      case "hard": return "danger";
      default: return "default";
    }
  };

  const getAchievementIcon = (iconName) => {
    switch (iconName) {
      case "FaCode": return <FaCode />;
      case "FaStar": return <FaStar />;
      case "FaCalendarAlt": return <FaCalendarAlt />;
      case "FaBullseye": return <FaBullseye />;
      case "FaAward": return <FaAward />;
      case "FaCrown": return <FaCrown />;
      case "FaFire": return <FaFire />;
      case "FaRocket": return <FaRocket />;
      case "FaGem": return <FaGem />;
      case "FaBolt": return <FaBolt />;
      case "FaClock": return <FaClock />;
      case "FaUsers": return <FaUsers />;
      default: return <FaTrophy />;
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "common": return "bg-gray-600 text-gray-300";
      case "uncommon": return "bg-green-600 text-green-300";
      case "rare": return "bg-blue-600 text-blue-300";
      case "epic": return "bg-purple-600 text-purple-300";
      case "legendary": return "bg-yellow-600 text-yellow-300";
      default: return "bg-gray-600 text-gray-300";
    }
  };

  const getLanguageColor = (language) => {
    switch (language?.toLowerCase()) {
      case "c++": return "bg-blue-500";
      case "python": return "bg-green-500";
      case "java": return "bg-orange-500";
      case "javascript": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getCategoryColor = (tag, isClass) => {
    if (isClass) {
      switch (tag) {
        case 'IX': return "bg-green-500";
        case 'X': return "bg-blue-500";
        case 'XI': return "bg-purple-500";
        default: return "bg-gray-500";
      }
    }

    const category = availableTags[tag];
    switch (category) {
      case 'IX': return "bg-green-400";
      case 'X': return "bg-blue-400";
      case 'XI': return "bg-purple-400";
      default: return "bg-gray-400";
    }
  };

  const calculateCurrentStreak = () => {
    if (!user?.solvedProblems || user?.solvedProblems.length === 0) return 0;
    
    const today = new Date();
    const solvedProblems = user.solvedProblems.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let streak = 0;
    const uniqueDays = new Set();
    
    solvedProblems.forEach(problem => {
      const problemDate = new Date(problem.date);
      const dateStr = problemDate.toDateString();
      uniqueDays.add(dateStr);
    });
    
    const uniqueDaysArray = Array.from(uniqueDays).sort((a, b) => new Date(b) - new Date(a));
    
    for (let i = 0; i < uniqueDaysArray.length; i++) {
      const dayDate = new Date(uniqueDaysArray[i]);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (dayDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else if (i === 0 && dayDate.toDateString() === new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateCurrentStreak();

  return (
    <div>
        {location.pathname !== "/home" && <NavBar userInfo={userInfo}/>}
        <div className="min-h-screen bg-[#18191c] py-6 px-6">
        <div className="mx-auto space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-[#1f2937] border border-gray-700/50">
                <CardBody className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{stats?.totalSubmissions}</div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <FaCode className="text-red-500" />
                    <span>Total Submissions</span>
                </div>
                </CardBody>
            </Card>

            <Card className="bg-[#1f2937] border border-gray-700/50">
                <CardBody className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{stats?.problemsSolved}</div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <FaTrophy className="text-green-500" />
                    <span>Problems Solved</span>
                </div>
                </CardBody>
            </Card>

            <Card className="bg-[#1f2937] border border-gray-700/50">
                <CardBody className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{stats.successRate}%</div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <FaChartLine className="text-blue-500" />
                    <span>Success Rate</span>
                </div>
                </CardBody>
            </Card>

            <Card className="bg-[#1f2937] border border-gray-700/50">
                <CardBody className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{stats.unlockedAchievements}</div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <FaStar className="text-yellow-500" />
                    <span>Achievements</span>
                </div>
                </CardBody>
            </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
                <Card className="bg-[#1f2937] border border-gray-700/50">
                <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FaClock className="text-red-500" />
                        Recent Activity
                    </h2>
                    <Button
                        onClick={() => navigate('/profile/alex')}
                        size="sm"
                        variant="bordered"
                        className="border-gray-600 hover:border-red-500/50 text-gray-400 hover:text-white"
                        endContent={<FaChevronRight />}
                    >
                        View All Submissions
                    </Button>
                    </div>
                    
                    {recentSubmissions.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {recentSubmissions.map((submission, index) => (
                        <div
                            key={`${submission.problemId}-${index}`}
                            className="p-4 rounded-lg bg-[#111827] border border-gray-700/30 hover:border-gray-600/50 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-white">
                                Problem #{submission.problemId}
                                </span>
                                <Chip
                                size="sm"
                                color={getDifficultyColor(submission.difficulty)}
                                variant="flat"
                                >
                                {submission.difficulty}
                                </Chip>
                            </div>
                            <Chip
                                size="sm"
                                color={getScoreColor(submission.score || 0)}
                                variant="flat"
                                className="font-bold"
                            >
                                {submission.score || 0}
                            </Chip>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-gray-400">
                            <span>{submission.language}</span>
                            <span>{formatDate(submission.date)}</span>
                            </div>
                        </div>
                        ))}
                    </div>
                    ) : (
                    <div className="text-center text-gray-400 py-8">
                        <FaCode className="mx-auto text-4xl mb-4 opacity-50" />
                        <p>No submissions yet. Start solving problems!</p>
                    </div>
                    )}
                </CardBody>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#1f2937] border border-gray-700/50">
                    <CardBody className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FaCode className="text-blue-500" />
                        Language Distribution
                    </h3>
                    {languageStats.length > 0 ? (
                        <div className="space-y-4">
                        {languageStats.map((lang) => (
                            <div key={lang.language} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${getLanguageColor(lang.language)}`} />
                                <span className="text-white font-medium">{lang.language}</span>
                                </div>
                                <div className="text-sm text-gray-400">
                                {lang.count} ({lang.percentage}%)
                                </div>
                            </div>
                            <Progress
                                value={lang.percentage}
                                className="max-w-full"
                                size="sm"
                                color="danger"
                            />
                            <div className="text-xs text-gray-500">
                                Average Score: {lang.averageScore}%
                            </div>
                            </div>
                        ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-4">
                        <p>No language data available yet.</p>
                        </div>
                    )}
                    </CardBody>
                </Card>

                <Card className="bg-[#1f2937] border border-gray-700/50">
                    <CardBody className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FaBullseye className="text-yellow-500" />
                        Difficulty Analysis
                    </h3>
                    {difficultyStats.length > 0 ? (
                        <div className="space-y-4">
                        {difficultyStats.map((diff) => (
                            <div key={diff.difficulty} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                <Chip
                                    size="sm"
                                    color={getDifficultyColor(diff.difficulty)}
                                    variant="flat"
                                >
                                    {diff.difficulty}
                                </Chip>
                                </div>
                                <div className="text-sm text-gray-400">
                                {diff.solved}/{diff.total} solved
                                </div>
                            </div>
                            <Progress
                                value={diff.solveRate}
                                className="max-w-full"
                                size="sm"
                                color={diff.solveRate >= 80 ? "success" : diff.solveRate >= 60 ? "warning" : "danger"}
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Solve Rate: {diff.solveRate}%</span>
                                <span>Avg Score: {diff.averageScore}%</span>
                            </div>
                            </div>
                        ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-4">
                        <p>No difficulty data available yet.</p>
                        </div>
                    )}
                    </CardBody>
                </Card>
                </div>
            </div>

            <div className="space-y-6">
                <Card className="bg-[#1f2937] border border-gray-700/50">
                <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FaTrophy className="text-yellow-500" />
                        Achievements
                    </h2>
                    <Button
                        onClick={() => navigate('/profile/alex')}
                        size="sm"
                        variant="bordered"
                        className="border-gray-600 hover:border-red-500/50 text-gray-400 hover:text-white"
                        endContent={<FaEye />}
                    >
                        View All
                    </Button>
                    </div>
                    
                    {previewAchievements.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                        {previewAchievements.map((achievement) => (
                        <div
                            key={achievement.id}
                            className="p-3 rounded-lg bg-[#111827] border border-gray-700/30 text-center hover:border-gray-600/50 transition-colors"
                        >
                            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-2 ${getRarityColor(achievement.rarity)}`}>
                            {getAchievementIcon(achievement.icon)}
                            </div>
                            <div className="text-sm font-medium text-white truncate">
                            {achievement.name}
                            </div>
                            <div className="text-xs text-gray-400 capitalize">
                            {achievement.rarity}
                            </div>
                        </div>
                        ))}
                    </div>
                    ) : (
                    <div className="text-center text-gray-400 py-4">
                        <FaTrophy className="mx-auto text-3xl mb-2 opacity-50" />
                        <p>No achievements unlocked yet.</p>
                    </div>
                    )}
                </CardBody>
                </Card>

                <Card className="bg-[#1f2937] border border-gray-700/50">
                <CardBody className="p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                    <Button
                        className="w-full justify-start bg-red-500 hover:bg-red-600 text-white"
                        startContent={<FaCode />}
                        onClick={() => navigate('/problems/list')}
                    >
                        Practice Problems
                    </Button>
                    <Button
                        onClick={() => navigate('/problems/codeBattles')}
                        variant="bordered"
                        className="w-full justify-start border-gray-600 hover:border-red-500/50 text-gray-300 hover:text-white"
                        startContent={<FaFire />}
                    >
                        Start 1v1 Duel
                    </Button>
                    <Button
                        onClick={() => navigate('/problems/contests')}
                        variant="bordered"
                        className="w-full justify-start border-gray-600 hover:border-red-500/50 text-gray-300 hover:text-white"
                        startContent={<FaCalendarAlt />}
                    >
                        View Contests
                    </Button>
                    <Button
                        onClick={() => navigate('/profile/alex')}
                        variant="bordered"
                        className="w-full justify-start border-gray-600 hover:border-red-500/50 text-gray-300 hover:text-white"
                        startContent={<FaChartBar />}
                    >
                        Full Analytics
                    </Button>
                    </div>
                </CardBody>
                </Card>

                <Card className="bg-[#1f2937] border border-gray-700/50">
                <CardBody className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Performance Summary</h3>
                    <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Most Used Language</span>
                        <span className="text-white font-medium">
                        {languageStats[0]?.language || 'N/A'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Current Streak</span>
                        <span className="text-white font-medium flex items-center gap-1">
                        {currentStreak > 0 && <FaFire className="text-orange-500" />}
                        {currentStreak} days
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Best Difficulty</span>
                        <span className="text-white font-medium">
                        {difficultyStats.sort((a, b) => b.solveRate - a.solveRate)[0]?.difficulty || 'N/A'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Score</span>
                        <span className="text-white font-medium">
                        {user?.submissions?.reduce((sum, sub) => sum + (sub.score || 0), 0) || 0}
                        </span>
                    </div>
                    </div>
                </CardBody>
                </Card>
            </div>
            </div>
            <Card className="bg-[#1f2937] border border-gray-700/50">
            <CardBody className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FaLayerGroup className="text-purple-500" />
                Problem Categories
                </h3>
                {tagStats.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tagStats.map((tag) => (
                    <div
                        key={tag.tag}
                        className="p-4 rounded-lg bg-[#111827] border border-gray-700/30 hover:border-gray-600/50 transition-colors"
                    >
                        <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(tag.tag, tag.isClass)}`} />
                        <span className="text-sm font-medium text-gray-300 truncate">{tag.tag}</span>
                        {tag.isClass && (
                            <Chip size="sm" className="bg-indigo-500/20 text-indigo-300 text-xs">
                            CLASS
                            </Chip>
                        )}
                        </div>
                        <div className="text-lg font-bold text-white mb-1">{tag.count} solved</div>
                        <div className="text-xs text-gray-500">
                        Average Score: {tag.averageScore}%
                        </div>
                        {!tag.isClass && availableTags[tag.tag] && (
                        <div className="text-xs text-purple-400 mt-1">
                            Level {availableTags[tag.tag]}
                        </div>
                        )}
                    </div>
                    ))}
                </div>
                ) : (
                <div className="text-center text-gray-400 py-8">
                    <FaLayerGroup className="mx-auto text-4xl mb-4 opacity-50" />
                    <p>No categories data available yet.</p>
                </div>
                )}
            </CardBody>
            </Card>
        </div>
        </div>
    </div>
  );
};

export default HomePage;