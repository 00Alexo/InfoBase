import React from 'react';
import { 
    Card, 
    CardBody, 
    Progress,
    Chip
} from '@heroui/react';
import { 
    FaBullseye,
    FaTrophy,
    FaCheckCircle,
    FaTimes
} from 'react-icons/fa';

const AnalyticsTab = ({ 
    enhancedProfile, 
    stats, 
    filteredSubmissions,
    selectedPeriod,
    setSelectedPeriod,
    getAchievementIcon,
    getAchievementRarityColor
}) => {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-8">Detailed Performance Analytics</h2>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <Card className="bg-bgCustomLight border-gray-700/30">
                    <CardBody className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-6">Activity Heatmap</h3>
                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {enhancedProfile.weeklyActivity.map((day, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-sm font-medium text-white mb-2">{day.day}</div>
                                    <div 
                                        className={`h-16 rounded-lg flex items-center justify-center font-bold transition-all hover:scale-105 ${
                                            day.problems > 0 
                                                ? day.problems >= 4 
                                                    ? 'bg-red-500 text-white' 
                                                    : day.problems >= 3 
                                                    ? 'bg-red-400 text-white' 
                                                    : day.problems >= 2 
                                                    ? 'bg-red-300 text-gray-900'
                                                    : 'bg-red-200 text-gray-800'
                                                : 'bg-gray-700 text-gray-400'
                                        }`}
                                        title={`${day.problems} problems solved, ${day.submissions} submissions`}
                                    >
                                        {day.problems}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {day.submissions} subs
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-sm text-gray-400">
                            Hover over days to see detailed statistics
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-bgCustomLight border-gray-700/30">
                    <CardBody className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-6">Programming Languages</h3>
                        <div className="space-y-4">
                            {enhancedProfile.languageStats.map((lang, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full ${
                                                lang.language === 'C++' ? 'bg-blue-500' :
                                                lang.language === 'Python' ? 'bg-yellow-500' :
                                                lang.language === 'Java' ? 'bg-green-500' :
                                                'bg-gray-500'
                                            }`} />
                                            <span className="text-white font-medium">{lang.language}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-white font-bold">{lang.count}</div>
                                            <div className="text-gray-400 text-sm">{lang.percentage}%</div>
                                        </div>
                                    </div>
                                    <Progress 
                                        value={lang.percentage} 
                                        color={
                                            lang.language === 'C++' ? 'primary' : 
                                            lang.language === 'Python' ? 'warning' : 
                                            lang.language === 'Java' ? 'success' :
                                            'default'
                                        }
                                        size="lg"
                                        className="w-full"
                                    />
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-bgCustomLight border-gray-700/30">
                    <CardBody className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-6">Difficulty Breakdown</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full bg-green-500" />
                                        <span className="text-white font-medium">Easy</span>
                                    </div>
                                    <span className="text-gray-400">
                                        {enhancedProfile.difficultyBreakdown.easy.solved}/{enhancedProfile.difficultyBreakdown.easy.attempted}
                                    </span>
                                </div>
                                <Progress 
                                    value={enhancedProfile.difficultyBreakdown.easy.attempted > 0 ? (enhancedProfile.difficultyBreakdown.easy.solved / enhancedProfile.difficultyBreakdown.easy.attempted) * 100 : 0}
                                    color="success"
                                    size="lg"
                                />
                                <div className="text-sm text-gray-400 mt-1">
                                    {enhancedProfile.difficultyBreakdown.easy.attempted > 0 ? Math.round((enhancedProfile.difficultyBreakdown.easy.solved / enhancedProfile.difficultyBreakdown.easy.attempted) * 100) : 0}% success rate
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full bg-yellow-500" />
                                        <span className="text-white font-medium">Medium</span>
                                    </div>
                                    <span className="text-gray-400">
                                        {enhancedProfile.difficultyBreakdown.medium.solved}/{enhancedProfile.difficultyBreakdown.medium.attempted}
                                    </span>
                                </div>
                                <Progress 
                                    value={enhancedProfile.difficultyBreakdown.medium.attempted > 0 ? (enhancedProfile.difficultyBreakdown.medium.solved / enhancedProfile.difficultyBreakdown.medium.attempted) * 100 : 0}
                                    color="warning"
                                    size="lg"
                                />
                                <div className="text-sm text-gray-400 mt-1">
                                    {enhancedProfile.difficultyBreakdown.medium.attempted > 0 ? Math.round((enhancedProfile.difficultyBreakdown.medium.solved / enhancedProfile.difficultyBreakdown.medium.attempted) * 100) : 0}% success rate
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full bg-red-500" />
                                        <span className="text-white font-medium">Hard</span>
                                    </div>
                                    <span className="text-gray-400">
                                        {enhancedProfile.difficultyBreakdown.hard.solved}/{enhancedProfile.difficultyBreakdown.hard.attempted}
                                    </span>
                                </div>
                                <Progress 
                                    value={enhancedProfile.difficultyBreakdown.hard.attempted > 0 ? (enhancedProfile.difficultyBreakdown.hard.solved / enhancedProfile.difficultyBreakdown.hard.attempted) * 100 : 0}
                                    color="danger"
                                    size="lg"
                                />
                                <div className="text-sm text-gray-400 mt-1">
                                    {enhancedProfile.difficultyBreakdown.hard.attempted > 0 ? Math.round((enhancedProfile.difficultyBreakdown.hard.solved / enhancedProfile.difficultyBreakdown.hard.attempted) * 100) : 0}% success rate
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-bgCustomLight border-gray-700/30">
                    <CardBody className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-6">Achievement Progress</h3>
                        <div className="space-y-4">
                            {enhancedProfile.achievements.map((achievement) => (
                                <div key={achievement.id} className={`p-4 rounded-lg border transition-all ${
                                    achievement.unlocked 
                                        ? getAchievementRarityColor(achievement.category) + ' border-current'
                                        : 'bg-gray-800/50 border-gray-700 opacity-60'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{getAchievementIcon(achievement.id)}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`font-semibold ${achievement.unlocked ? '' : 'text-gray-500'}`}>
                                                    {achievement.name}
                                                </span>
                                                <Chip size="sm" className={getAchievementRarityColor(achievement.category)}>
                                                    {achievement.category}
                                                </Chip>
                                            </div>
                                            <p className={`text-sm ${achievement.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                                                {achievement.description}
                                            </p>
                                        </div>
                                        <div className={`text-2xl ${achievement.unlocked ? 'text-green-400' : 'text-gray-600'}`}>
                                            {achievement.unlocked ? <FaCheckCircle /> : <FaTimes />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-bgCustomLight border-gray-700/30">
                    <CardBody className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Score Distribution</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-green-400">Perfect (100 pts)</span>
                                    <span className="text-gray-400">{filteredSubmissions.filter(s => s.score === 100).length}</span>
                                </div>
                                <Progress 
                                    value={(filteredSubmissions.filter(s => s.score === 100).length / filteredSubmissions.length) * 100}
                                    color="success"
                                    size="sm"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-yellow-400">Good (75-99 pts)</span>
                                    <span className="text-gray-400">{filteredSubmissions.filter(s => s.score >= 75 && s.score < 100).length}</span>
                                </div>
                                <Progress 
                                    value={(filteredSubmissions.filter(s => s.score >= 75 && s.score < 100).length / filteredSubmissions.length) * 100}
                                    color="warning"
                                    size="sm"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-orange-400">Average (50-74 pts)</span>
                                    <span className="text-gray-400">{filteredSubmissions.filter(s => s.score >= 50 && s.score < 75).length}</span>
                                </div>
                                <Progress 
                                    value={(filteredSubmissions.filter(s => s.score >= 50 && s.score < 75).length / filteredSubmissions.length) * 100}
                                    color="secondary"
                                    size="sm"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-red-400">Needs Work (&lt;50 pts)</span>
                                    <span className="text-gray-400">{filteredSubmissions.filter(s => s.score < 50).length}</span>
                                </div>
                                <Progress 
                                    value={(filteredSubmissions.filter(s => s.score < 50).length / filteredSubmissions.length) * 100}
                                    color="danger"
                                    size="sm"
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-bgCustomLight border-gray-600/30">
                    <CardBody className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <FaBullseye className="text-2xl text-purple-400" />
                            <h3 className="text-xl font-semibold text-white">Monthly Goals</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-white">Solve {Math.max(20, Math.floor(stats.solvedProblems * 1.2))} Problems This Month</span>
                                    <span className="text-gray-400">{Math.min(stats.solvedProblems, Math.max(20, Math.floor(stats.solvedProblems * 1.2)))}/{Math.max(20, Math.floor(stats.solvedProblems * 1.2))}</span>
                                </div>
                                <Progress value={(Math.min(stats.solvedProblems, Math.max(20, Math.floor(stats.solvedProblems * 1.2))) / Math.max(20, Math.floor(stats.solvedProblems * 1.2))) * 100} color="secondary" size="lg" />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-white">Maintain {Math.max(7, enhancedProfile.longestStreak + 1)}-day Streak</span>
                                    <span className="text-gray-400">{Math.min(enhancedProfile.currentStreak, Math.max(7, enhancedProfile.longestStreak + 1))}/{Math.max(7, enhancedProfile.longestStreak + 1)}</span>
                                </div>
                                <Progress value={(Math.min(enhancedProfile.currentStreak, Math.max(7, enhancedProfile.longestStreak + 1)) / Math.max(7, enhancedProfile.longestStreak + 1)) * 100} color="warning" size="lg" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-bgCustomLight border-gray-600/30">
                    <CardBody className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <FaTrophy className="text-2xl text-yellow-400" />
                            <h3 className="text-xl font-semibold text-white">Personal Bests</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-400">{stats.bestScore}</div>
                                <div className="text-sm text-gray-400">Highest Score</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-400">{enhancedProfile.longestStreak}</div>
                                <div className="text-sm text-gray-400">Longest Streak</div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsTab;