import React from 'react';
import { 
    Card, 
    CardBody, 
    Chip,
    Button,
    Progress
} from '@heroui/react';
import { 
    FaCheckCircle,
    FaTimesCircle,
    FaBullseye,
    FaTrophy
} from 'react-icons/fa';

const OverviewTab = ({ 
    filteredSubmissions, 
    formatDate, 
    getScoreColor,
    setActiveTab,
    stats,
    enhancedProfile
}) => {
    return (
        <div className="p-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>

                    <div className="space-y-4">
                        {filteredSubmissions.slice(0, 8).map((submission, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 bg-bgCustomLight rounded-lg border border-gray-700/30 hover:border-red-500/30 transition-colors">
                                <div className={`p-2 rounded-full ${submission.score >= 100 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {submission.score >= 100 ? <FaCheckCircle /> : <FaTimesCircle />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-white font-medium">Problem #{submission.problemId}</h3>
                                        <span className="text-sm text-gray-400">{formatDate(submission.date)}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Chip
                                            size="sm"
                                            color={getScoreColor(submission.score)}
                                            variant="flat"
                                        >
                                            {submission.score} pts
                                        </Chip>
                                        {submission.results && submission.results.length > 0 && (
                                            <Chip size="sm" className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                                {submission.results.filter(r => r.status === 'ACCEPTED').length}/{submission.results.length} tests passed
                                            </Chip>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <Button 
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        onPress={() => setActiveTab("submissions")}
                    >
                        View All Submissions
                    </Button>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Performance Analytics</h2>

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
        </div>
    );
};

export default OverviewTab;