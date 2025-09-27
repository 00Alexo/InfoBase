import React, { useState, useRef } from 'react';
import { 
    Card, 
    CardBody, 
    Chip,
    Avatar,
    Button,
    Progress
} from '@heroui/react';
import { 
    FaTrophy,
    FaEdit,
    FaShareAlt,
    FaCode,
    FaCheckCircle,
    FaChartLine,
    FaBullseye,
    FaRocket,
    FaFire,
    FaCamera,
    FaUpload
} from 'react-icons/fa';

const ProfileHeader = ({ 
    enhancedProfile, 
    stats, 
    isOwnProfile, 
    setActiveTab, 
    getAchievementIcon,
    getAchievementRarityColor,
    showAllAchievements,
    setShowAllAchievements,
    onAvatarUpdate
}) => {
    const [showCopiedNotification, setShowCopiedNotification] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);
    
    if (!enhancedProfile) return null;

    const handleShareProfile = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            setShowCopiedNotification(true);
            setTimeout(() => setShowCopiedNotification(false), 3000);
        }).catch(err => {
            console.error('Failed to copy link: ', err);
        });
    };

    const handleAvatarClick = () => {
        if (isOwnProfile && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        setIsUploadingAvatar(true);

        try {
            // Convert file to base64
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64String = e.target.result;
                
                // Call the upload function passed from parent
                if (onAvatarUpdate) {
                    await onAvatarUpdate(base64String);
                }
                
                setIsUploadingAvatar(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Avatar upload failed:', error);
            alert('Failed to upload avatar. Please try again.');
            setIsUploadingAvatar(false);
        }
    };

    return (
        <div className="relative">
            {showCopiedNotification && (
                <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                    <FaCheckCircle />
                    <span>Profile link copied to clipboard!</span>
                </div>
            )}
            
            <Card className="bg-bgCustomCard border-gray-700/30 mb-8 w-full">
                <CardBody className="p-10">
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                        <div className="xl:col-span-4 flex items-center justify-center">
                            <div className="flex flex-col items-center text-center">
                                {/* Avatar with upload functionality */}
                                <div className="relative group">
                                    <Avatar
                                        showFallback
                                        name={enhancedProfile.username?.charAt(0).toUpperCase()}
                                        className={`transition-all border-2 border-red-700 w-32 h-32 text-4xl rounded-full duration-300 ${
                                            isOwnProfile ? 'cursor-pointer hover:brightness-50' : ''
                                        }`}
                                        src={enhancedProfile.profilePicture || ''}
                                        onClick={handleAvatarClick}
                                    />
                                    
                                    {/* Upload overlay - only show on own profile */}
                                    {isOwnProfile && (
                                        <div 
                                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-full bg-black/50"
                                            onClick={handleAvatarClick}
                                        >
                                            {isUploadingAvatar ? (
                                                <div className="animate-spin text-white text-2xl">
                                                    <FaUpload />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-white">
                                                    <FaCamera className="text-2xl mb-1" />
                                                    <span className="text-xs">Change</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Hidden file input */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                                
                                <h1 className="text-4xl font-bold text-white mb-6 mt-4">
                                    {enhancedProfile.displayName}
                                </h1>
                                
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Chip 
                                        className="bg-red-600 text-white font-semibold"
                                        startContent={<FaTrophy className="text-yellow-300" />}
                                        size="lg"
                                    >
                                        {enhancedProfile.rank}
                                    </Chip>
                                </div>
                                
                                <p className="text-gray-300 mb-6 max-w-sm leading-relaxed">
                                    {enhancedProfile.bio || 'No bio available yet.'}
                                </p>
                                
                                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-400 mb-1">
                                            {enhancedProfile.currentStreak}
                                        </div>
                                        <div className="text-sm text-gray-400">Current Streak</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-400 mb-1">
                                            {enhancedProfile.longestStreak}
                                        </div>
                                        <div className="text-sm text-gray-400">Best Streak</div>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 mt-6">
                                    {isOwnProfile && (
                                        <Button
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                            startContent={<FaEdit />}
                                            onPress={() => setActiveTab("settings")}
                                        >
                                            Edit Profile
                                        </Button>
                                    )}
                                    <Button
                                        variant="bordered"
                                        className="border-red-500 text-red-400 hover:bg-red-500/10"
                                        startContent={<FaShareAlt />}
                                        onPress={handleShareProfile}
                                    >
                                        Share Profile
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="xl:col-span-5">
                            <h2 className="text-2xl font-bold text-white mb-6">Performance Overview</h2>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                <Card className="bg-bgCustomLight border-gray-600/30">
                                    <CardBody className="p-6 text-center">
                                        <FaCode className="text-3xl text-red-400 mx-auto mb-3" />
                                        <div className="text-3xl font-bold text-white mb-2">
                                            {stats.totalSubmissions}
                                        </div>
                                        <div className="text-sm text-gray-400">Total Submissions</div>
                                    </CardBody>
                                </Card>
                                
                                <Card className="bg-bgCustomLight border-gray-600/30">
                                    <CardBody className="p-6 text-center">
                                        <FaCheckCircle className="text-3xl text-green-400 mx-auto mb-3" />
                                        <div className="text-3xl font-bold text-white mb-2">
                                            {stats.solvedProblems}
                                        </div>
                                        <div className="text-sm text-gray-400">Problems Solved</div>
                                    </CardBody>
                                </Card>
                                
                                <Card className="bg-bgCustomLight border-gray-600/30">
                                    <CardBody className="p-6 text-center">
                                        <FaChartLine className="text-3xl text-yellow-400 mx-auto mb-3" />
                                        <div className="text-3xl font-bold text-white mb-2">
                                            {stats.successRate}%
                                        </div>
                                        <div className="text-sm text-gray-400">Success Rate</div>
                                    </CardBody>
                                </Card>
                                
                                <Card className="bg-bgCustomLight border-gray-600/30">
                                    <CardBody className="p-6 text-center">
                                        <FaBullseye className="text-3xl text-blue-400 mx-auto mb-3" />
                                        <div className="text-3xl font-bold text-white mb-2">
                                            {stats.averageScore}
                                        </div>
                                        <div className="text-sm text-gray-400">Average Score</div>
                                    </CardBody>
                                </Card>
                                
                                <Card className="bg-bgCustomLight border-gray-600/30">
                                    <CardBody className="p-6 text-center">
                                        <FaRocket className="text-3xl text-purple-400 mx-auto mb-3" />
                                        <div className="text-3xl font-bold text-white mb-2">
                                            {stats.bestScore}
                                        </div>
                                        <div className="text-sm text-gray-400">Best Score</div>
                                    </CardBody>
                                </Card>
                                
                                <Card className="bg-bgCustomLight border-gray-600/30">
                                    <CardBody className="p-6 text-center">
                                        <FaFire className="text-3xl text-orange-400 mx-auto mb-3" />
                                        <div className="text-3xl font-bold text-white mb-2">
                                            {stats.recentActivity}
                                        </div>
                                        <div className="text-sm text-gray-400">This Week</div>
                                    </CardBody>
                                </Card>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-300">Easy Problems</span>
                                        <span className="text-gray-400">{enhancedProfile.difficultyBreakdown.easy.solved}/{enhancedProfile.difficultyBreakdown.easy.attempted}</span>
                                    </div>
                                    <Progress 
                                        value={enhancedProfile.difficultyBreakdown.easy.attempted > 0 ? (enhancedProfile.difficultyBreakdown.easy.solved / enhancedProfile.difficultyBreakdown.easy.attempted) * 100 : 0}
                                        color="success"
                                        className="max-w-full"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-300">Medium Problems</span>
                                        <span className="text-gray-400">{enhancedProfile.difficultyBreakdown.medium.solved}/{enhancedProfile.difficultyBreakdown.medium.attempted}</span>
                                    </div>
                                    <Progress 
                                        value={enhancedProfile.difficultyBreakdown.medium.attempted > 0 ? (enhancedProfile.difficultyBreakdown.medium.solved / enhancedProfile.difficultyBreakdown.medium.attempted) * 100 : 0}
                                        color="warning"
                                        className="max-w-full"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-300">Hard Problems</span>
                                        <span className="text-gray-400">{enhancedProfile.difficultyBreakdown.hard.solved}/{enhancedProfile.difficultyBreakdown.hard.attempted}</span>
                                    </div>
                                    <Progress 
                                        value={enhancedProfile.difficultyBreakdown.hard.attempted > 0 ? (enhancedProfile.difficultyBreakdown.hard.solved / enhancedProfile.difficultyBreakdown.hard.attempted) * 100 : 0}
                                        color="danger"
                                        className="max-w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="xl:col-span-3">
                            <h2 className="text-2xl font-bold text-white mb-6">Achievements</h2>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {enhancedProfile.achievements.slice(0, showAllAchievements ? enhancedProfile.achievements.length : 4).map((achievement, index) => (
                                    <Card key={achievement.id} className={`${achievement.unlocked ? getAchievementRarityColor(achievement.category) : 'bg-gray-800 opacity-50'} border-0`}>
                                        <CardBody className="p-4 text-center">
                                            <div className="text-2xl mb-2">{getAchievementIcon(achievement.id)}</div>
                                            <div className="text-sm font-medium">{achievement.name}</div>
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-4">Weekly Activity</h3>
                            <div className="grid grid-cols-7 gap-2 mb-4">
                                {enhancedProfile.weeklyActivity.map((day, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-xs text-gray-400 mb-2">{day.day}</div>
                                        <div 
                                            className={`h-8 rounded-sm ${
                                                day.problems > 0 
                                                    ? day.problems >= 3 
                                                        ? 'bg-red-500' 
                                                        : day.problems >= 2 
                                                        ? 'bg-red-400' 
                                                        : 'bg-red-300'
                                                    : 'bg-gray-700'
                                            }`}
                                            title={`${day.problems} problems solved`}
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-4">Languages Used</h3>
                            <div className="space-y-3">
                                {enhancedProfile.languageStats.map((lang, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-300">{lang.language}</span>
                                            <span className="text-gray-400">{lang.count} problems</span>
                                        </div>
                                        <Progress value={lang.percentage} color="danger" size="sm" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default ProfileHeader;