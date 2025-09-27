import React from 'react';
import { 
    Card, 
    CardBody,
    Chip,
    Progress
} from '@heroui/react';
import { 
    FaAward,    
    FaChartLine,  
    FaRocket,
    FaCheckCircle,
    FaLock
} from 'react-icons/fa';

const AchievementsTab = ({ enhancedProfile, getAchievementIcon, getAchievementRarityColor }) => {
    if (!enhancedProfile) return null;

    return (
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Achievement System</h2>
                <p className="text-gray-400">Track your progress and unlock rewards as you master coding challenges.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-bgCustomLight border-gray-600/30">
                    <CardBody className="p-6 text-center">
                        <FaAward className="text-3xl text-yellow-400 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-white mb-2">
                            {enhancedProfile.achievements.filter(a => a.unlocked).length}/{enhancedProfile.achievements.length}
                        </div>
                        <div className="text-sm text-gray-400">Achievements</div>
                    </CardBody>
                </Card>
                
                <Card className="bg-bgCustomLight border-gray-600/30">
                    <CardBody className="p-6 text-center">
                        <FaChartLine className="text-3xl text-green-400 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-white mb-2">
                            {Math.round((enhancedProfile.achievements.filter(a => a.unlocked).length / enhancedProfile.achievements.length) * 100)}%
                        </div>
                        <div className="text-sm text-gray-400">Completion</div>
                    </CardBody>
                </Card>
                
                <Card className="bg-bgCustomLight border-gray-600/30">
                    <CardBody className="p-6 text-center">
                        <FaRocket className="text-3xl text-purple-400 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-white mb-2">
                            {enhancedProfile.currentStreak}
                        </div>
                        <div className="text-sm text-gray-400">Current Streak</div>
                    </CardBody>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {enhancedProfile.achievements.map((achievement) => (
                    <Card 
                        key={achievement.id} 
                        className={`${achievement.unlocked ? 'bg-bgCustomLight' : 'bg-gray-800/50'} border-gray-600/30 hover:border-red-500/50 transition-all duration-300 cursor-pointer ${
                            achievement.unlocked && achievement.category === 'performance' ? 'shadow-lg shadow-blue-500/20' :
                            achievement.unlocked && achievement.category === 'consistency' ? 'shadow-lg shadow-purple-500/20' :
                            achievement.unlocked && achievement.category === 'special' ? 'shadow-lg shadow-yellow-500/20' : ''
                        }`}
                    >
                        <CardBody className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`p-3 rounded-lg text-2xl ${achievement.unlocked ? 'text-red-400' : 'text-gray-600'}`}>
                                    {achievement.unlocked ? getAchievementIcon(achievement.id) : <FaLock />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className={`font-bold text-lg ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                                            {achievement.name}
                                        </h3>
                                        <Chip 
                                            size="sm" 
                                            variant="flat"
                                            className={`${
                                                achievement.category === 'getting-started' 
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                : achievement.category === 'problem-solving' 
                                                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                                : achievement.category === 'consistency'
                                                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                                : achievement.category === 'performance'
                                                    ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                                                : achievement.category === 'special'
                                                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                                : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                                            } text-xs font-semibold border capitalize`}
                                        >
                                            {achievement.category === 'getting-started' 
                                                ? '🚀 Getting Started'
                                            : achievement.category === 'problem-solving' 
                                                ? '🧩 Problem Solving'
                                            : achievement.category === 'consistency'
                                                ? '🔥 Consistency'
                                            : achievement.category === 'performance'
                                                ? '⚡ Performance'
                                            : achievement.category === 'special'
                                                ? '🌟 Special'
                                            : achievement.category}
                                        </Chip>
                                    </div>
                                    <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {achievement.description}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Progress</span>
                                    <span className="text-gray-400">
                                        {Math.min(achievement.progress, achievement.target)}/{achievement.target}
                                    </span>
                                </div>
                                <Progress 
                                    value={Math.min((achievement.progress / achievement.target) * 100, 100)}
                                    color={achievement.unlocked ? "success" : "default"}
                                    size="sm"
                                />
                            </div>
                            
                            <div className="flex justify-end items-center">
                                {achievement.unlocked && (
                                    <div className="flex items-center gap-1 text-green-400 text-sm">
                                        <FaCheckCircle />
                                        <span>Unlocked</span>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AchievementsTab;