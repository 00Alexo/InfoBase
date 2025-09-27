import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProfile } from '../Hooks/useGetProfile';
import { useAuthContext } from '../Hooks/useAuthContext';
import ProfileHeader from '../components/Profile/ProfileHeader';
import AchievementsTab from '../components/Profile/AchievementsTab';
import RankTab from '../components/Profile/RankTab';
import SubmissionsTab from '../components/Profile/SubmissionsTab';
import AnalyticsTab from '../components/Profile/AnalyticsTab';
import OverviewTab from '../components/Profile/OverviewTab';
import SettingsTab from '../components/Profile/SettingsTab';
import { 
    Card, 
    CardBody, 
    Tabs, 
    Tab,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Chip,
} from '@heroui/react';
import { 
    FaUser, 
    FaCode, 
    FaCalendarAlt,  
    FaChartLine, 
    FaCog,
    FaEye,
    FaTrophy,
    FaFire,
    FaStar,
    FaGraduationCap,
    FaClock,
    FaRocket,
    FaLightbulb,
    FaDownload,
    FaCopy,
    FaChartBar,
    FaBolt,
    FaCrown,
    FaGem
} from 'react-icons/fa';

const ProfilePage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { getProfile, refetchProfile, error, isLoading, profile } = useGetProfile(username);
    
    const [activeTab, setActiveTab] = useState("overview");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [selectedSolution, setSelectedSolution] = useState(null);
    const [viewMode, setViewMode] = useState("grid"); 
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("all");
    const [showAllAchievements, setShowAllAchievements] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [editForm, setEditForm] = useState({
        bio: '',
        location: '',
        website: '',
        github: '',
        linkedin: '',
        gender: ''
    });
    
    const { isOpen: isSolutionOpen, onOpen: onSolutionOpen, onClose: onSolutionClose } = useDisclosure();
    const { isOpen: isStatsOpen, onOpen: onStatsOpen, onClose: onStatsClose } = useDisclosure();
    const { isOpen: isAchievementsOpen, onOpen: onAchievementsOpen, onClose: onAchievementsClose } = useDisclosure();

    const getEnhancedProfile = () => {
        if (!profile) return null;
        
        const achievements = profile.achievements || [];
        const unlockedAchievements = achievements.filter(a => a.unlocked);
        
        return {
            ...profile,
            displayName: profile.username || 'Anonymous User',
            bio: profile.bio || '',
            location: profile.location || '',
            website: profile.website || '',
            githubUsername: profile.github || '',
            linkedinProfile: profile.linkedin || '',
            profilePicture: profile.profilePicture || '',
            currentStreak: calculateCurrentStreak(),
            longestStreak: calculateLongestStreak(),
            rank: getRank(),
            achievements: achievements,
            weeklyActivity: generateWeeklyActivity(),
            languageStats: generateLanguageStats(),
            difficultyBreakdown: generateDifficultyBreakdown()
        };
    };

    const calculateCurrentStreak = () => {
        if (!profile?.solvedProblems || profile.solvedProblems.length === 0) return 0;
        
        const today = new Date();
        const solvedProblems = profile.solvedProblems.sort((a, b) => 
            new Date(b.solvedAt || b.date) - new Date(a.solvedAt || a.date)
        );
        
        let streak = 0;
        const uniqueDays = new Set();
        
        solvedProblems.forEach(problem => {
            const problemDate = new Date(problem.solvedAt || problem.date);
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

    const calculateLongestStreak = () => {
        if (!profile?.solvedProblems || profile.solvedProblems.length === 0) return 0;
        
        const solvedProblems = profile.solvedProblems.sort((a, b) => 
            new Date(a.solvedAt || a.date) - new Date(b.solvedAt || b.date)
        );
        
        let longestStreak = 0;
        let currentStreak = 0;
        let lastDate = null;
        
        const uniqueDays = new Set();
        solvedProblems.forEach(problem => {
            const problemDate = new Date(problem.solvedAt || problem.date);
            const dateStr = problemDate.toDateString();
            uniqueDays.add(dateStr);
        });
        
        const sortedDays = Array.from(uniqueDays).sort();
        
        for (let i = 0; i < sortedDays.length; i++) {
            const currentDate = new Date(sortedDays[i]);
            
            if (lastDate) {
                const diffTime = currentDate - lastDate;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                    currentStreak++;
                } else {
                    longestStreak = Math.max(longestStreak, currentStreak);
                    currentStreak = 1;
                }
            } else {
                currentStreak = 1;
            }
            
            lastDate = currentDate;
        }
        
        return Math.max(longestStreak, currentStreak);
    };

    const getRank = () => {
        if (!profile?.achievements) return 'Beginner';
        
        const unlockedCount = profile.achievements.filter(a => a.unlocked).length;
        if (unlockedCount >= 10) return 'Expert';
        if (unlockedCount >= 6) return 'Advanced';
        if (unlockedCount >= 3) return 'Intermediate';
        return 'Beginner';
    };

    const generateWeeklyActivity = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const today = new Date();
        const weekActivity = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
            
            const problemsOnDay = profile?.solvedProblems?.filter(problem => {
                const problemDate = new Date(problem.solvedAt || problem.date);
                return problemDate.toDateString() === date.toDateString();
            }).length || 0;
            
            const submissionsOnDay = profile?.submissions?.filter(submission => {
                const submissionDate = new Date(submission.date);
                return submissionDate.toDateString() === date.toDateString();
            }).length || 0;
            
            weekActivity.push({
                day: dayName,
                problems: problemsOnDay,
                submissions: submissionsOnDay
            });
        }
        
        return weekActivity;
    };

    const generateLanguageStats = () => {
        if (!profile?.submissions || profile.submissions.length === 0) {
            return [
                { language: 'C++', count: 0, percentage: 33.33 },
                { language: 'Java', count: 0, percentage: 33.33 },
                { language: 'Python', count: 0, percentage: 33.34 }
            ];
        }
        
        const submissions = profile.submissions;
        const totalSubmissions = submissions.length;
        
        // Count submissions by language
        const cppCount = submissions.filter(s => s.language === 'C++').length;
        const javaCount = submissions.filter(s => s.language === 'Java').length;
        const pythonCount = submissions.filter(s => s.language === 'Python').length;
        
        // Calculate percentages
        const cppPercentage = totalSubmissions > 0 ? (cppCount / totalSubmissions) * 100 : 0;
        const javaPercentage = totalSubmissions > 0 ? (javaCount / totalSubmissions) * 100 : 0;
        const pythonPercentage = totalSubmissions > 0 ? (pythonCount / totalSubmissions) * 100 : 0;
        
        return [
            { language: 'C++', count: cppCount, percentage: Math.round(cppPercentage * 100) / 100 },
            { language: 'Java', count: javaCount, percentage: Math.round(javaPercentage * 100) / 100 },
            { language: 'Python', count: pythonCount, percentage: Math.round(pythonPercentage * 100) / 100 }
        ];
    };

    const generateDifficultyBreakdown = () => {
        if (!profile?.solvedProblems || !profile?.submissions) {
            return {
                easy: { solved: 0, attempted: 0 },
                medium: { solved: 0, attempted: 0 },
                hard: { solved: 0, attempted: 0 }
            };
        }

        const solvedProblems = profile.solvedProblems || [];
        const submissions = profile.submissions || [];
        const easySubmissions = submissions.filter(s => s.difficulty === 'easy' || s.difficulty === 'Easy');
        const mediumSubmissions = submissions.filter(s => s.difficulty === 'medium' || s.difficulty === 'Medium');
        const hardSubmissions = submissions.filter(s => s.difficulty === 'hard' || s.difficulty === 'Hard');

        const easySolved = easySubmissions.filter(s => s.score >= 100).length;
        const mediumSolved = mediumSubmissions.filter(s => s.score >= 100).length;
        const hardSolved = hardSubmissions.filter(s => s.score >= 100).length;

        const easyAttempted = easySubmissions.length;
        const mediumAttempted = mediumSubmissions.length;
        const hardAttempted = hardSubmissions.length;

        return {
            easy: { 
                solved: easySolved, 
                attempted: easyAttempted || (easySolved > 0 ? easySolved : 0)
            },
            medium: { 
                solved: mediumSolved, 
                attempted: mediumAttempted || (mediumSolved > 0 ? mediumSolved : 0)
            },
            hard: { 
                solved: hardSolved, 
                attempted: hardAttempted || (hardSolved > 0 ? hardSolved : 0)
            }
        };
    };

    const getAchievementIcon = (achievementId) => {
        switch(achievementId) {
            case 'first_blood':
                return <FaTrophy />;
            case 'getting_started':
                return <FaRocket />;
            case 'problem_crusher':
                return <FaFire />;
            case 'half_century':
                return <FaStar />;
            case 'century_club':
                return <FaCrown />;
            case 'speed_demon':
                return <FaBolt />;
            case 'unstoppable':
                return <FaFire />;
            case 'on_fire':
                return <FaFire />;
            case 'dedicated_learner':
                return <FaGraduationCap />;
            case 'perfectionist':
                return <FaGem />;
            case 'night_owl':
                return <FaClock />;
            case 'weekend_warrior':
                return <FaCalendarAlt />;
            default:
                return <FaTrophy />;
        }
    };

    const getEnhancedStats = () => {
        if (!profile?.submissions) return { 
            totalSubmissions: 0, 
            solvedProblems: 0, 
            successRate: 0,
            averageScore: 0,
            bestScore: 0,
            recentActivity: 0
        };
        
        const submissions = profile.submissions;
        const totalSubmissions = submissions.length;
        const solvedProblems = submissions.filter(sub => sub.score >= 100).length;
        const successRate = totalSubmissions > 0 ? Math.round((solvedProblems / totalSubmissions) * 100) : 0;
        const averageScore = totalSubmissions > 0 ? Math.round(submissions.reduce((sum, sub) => sum + sub.score, 0) / totalSubmissions) : 0;
        const bestScore = totalSubmissions > 0 ? Math.max(...submissions.map(sub => sub.score)) : 0;
        
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentActivity = submissions.filter(sub => new Date(sub.date) > weekAgo).length;
        
        return { totalSubmissions, solvedProblems, successRate, averageScore, bestScore, recentActivity };
    };

    const getFilteredSubmissions = () => {
        if (!profile?.submissions) return [];
        
        let filtered = [...profile.submissions];

        if (selectedPeriod !== "all") {
            const now = new Date();
            let cutoffDate = new Date();
            
            switch (selectedPeriod) {
                case "week":
                    cutoffDate.setDate(now.getDate() - 7);
                    break;
                case "month":
                    cutoffDate.setMonth(now.getMonth() - 1);
                    break;
                case "year":
                    cutoffDate.setFullYear(now.getFullYear() - 1);
                    break;
            }
            
            filtered = filtered.filter(sub => new Date(sub.date) > cutoffDate);
        }

        if (filterStatus === "solved") {
            filtered = filtered.filter(sub => sub.score >= 100);
        } else if (filterStatus === "unsolved") {
            filtered = filtered.filter(sub => sub.score < 100);
        } else if (filterStatus === "partial") {
            filtered = filtered.filter(sub => sub.score > 0 && sub.score < 100);
        }

        switch (sortBy) {
            case "newest":
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case "oldest":
                filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case "score_high":
                filtered.sort((a, b) => b.score - a.score);
                break;
            case "score_low":
                filtered.sort((a, b) => a.score - b.score);
                break;
            case "problem_id":
                filtered.sort((a, b) => a.problemId - b.problemId);
                break;
            default:
                break;
        }

        return filtered;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getScoreColor = (score) => {
        if (score >= 100) return "success";
        if (score >= 75) return "warning";
        if (score >= 50) return "secondary";
        if (score >= 25) return "danger";
        return "default";
    };

    const getAchievementRarityColor = (category) => {
        switch (category) {
            case 'getting_started': return 'bg-green-700 text-green-300';
            case 'problem_solving': return 'bg-blue-700 text-blue-300';
            case 'consistency': return 'bg-purple-700 text-purple-300';
            case 'performance': return 'bg-yellow-700 text-yellow-300';
            case 'special': return 'bg-red-700 text-red-300';
            default: return 'bg-gray-700 text-gray-300';
        }
    };

    const openSolutionModal = (solution) => {
        setSelectedSolution(solution);
        onSolutionOpen();
    };

    const handleProfileSave = async () => {
        try {
            setUpdateLoading(true);
            setUpdateError(null);
            
            const response = await fetch(`${process.env.REACT_APP_API}/user/editProfile/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    bio: editForm.bio || profile.bio,
                    location: editForm.location || profile.location,
                    website: editForm.website || profile.website,
                    github: editForm.github || profile.github,
                    linkedin: editForm.linkedin || profile.linkedin,
                    gender: editForm.gender || profile.gender
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            await refetchProfile();
            
            setEditForm({
                bio: '',
                location: '',
                website: '',
                github: '',
                linkedin: '',
                gender: ''
            });
            
            setUpdateSuccess(true);
            setIsEditing(false);
            
        } catch (error) {
            console.error('Failed to update profile:', error);
            setUpdateError(error.message);
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleSettingsSave = handleProfileSave;

    const handleAvatarUpdate = async (base64String) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API}/user/editProfilePicture`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: user.username,
                    profilePicture: base64String
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update avatar');
            }

            refetchProfile();
            
        } catch (error) {
            console.error('Avatar update failed:', error);
            throw error;
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const isOwnProfile = user?.username === username;
    const enhancedProfile = getEnhancedProfile();
    const stats = getEnhancedStats();
    const filteredSubmissions = getFilteredSubmissions();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bgCustomPage flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="animate-spin w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full"></div>
                    <span className="text-textCustomMuted text-xl">Loading profile...</span>
                </div>
            </div>
        );
    }

    if (error || !profile || !enhancedProfile) {
        return (
            <div className="min-h-screen bg-bgCustomPage flex items-center justify-center">
                <div className="text-center">
                    <div className="text-8xl mb-6 text-gray-400"><FaUser /></div>
                    <h2 className="text-3xl font-bold text-white mb-4">Profile not found</h2>
                    <p className="text-xl text-textCustomMuted">The user profile you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bgCustomPage">
            <div className="w-full px-8 py-8">
                <ProfileHeader 
                    enhancedProfile={enhancedProfile}
                    stats={stats}
                    isOwnProfile={isOwnProfile}
                    setActiveTab={setActiveTab}
                    getAchievementIcon={getAchievementIcon}
                    getAchievementRarityColor={getAchievementRarityColor}
                    showAllAchievements={showAllAchievements}
                    setShowAllAchievements={setShowAllAchievements}
                    onAvatarUpdate={handleAvatarUpdate}
                />

                <Card className="bg-bgCustomCard border-gray-700/30 w-full">
                    <CardBody className="p-0">
                        <Tabs 
                            selectedKey={activeTab}
                            onSelectionChange={setActiveTab}
                            className="w-full"
                            variant="underlined"
                            color="danger"
                            classNames={{
                                base: "w-full",
                                tabList: "gap-6 w-full relative rounded-none px-8 py-4 bg-bgCustomLight border-b border-gray-700/50",
                                cursor: "w-full bg-red-500 h-0.5",
                                tab: "max-w-fit px-4 py-3 h-auto",
                                tabContent: "group-data-[selected=true]:text-red-400 text-gray-400 font-medium text-base hover:text-gray-300 transition-colors"
                            }}
                        >
                            <Tab
                                key="overview"
                                title={
                                    <div className="flex items-center gap-3">
                                        <FaChartBar className="text-lg" />
                                        <span>Overview</span>
                                    </div>
                                }
                            >
                                <OverviewTab 
                                    filteredSubmissions={filteredSubmissions}
                                    formatDate={formatDate}
                                    getScoreColor={getScoreColor}
                                    setActiveTab={setActiveTab}
                                    stats={stats}
                                    enhancedProfile={enhancedProfile}
                                />
                            </Tab>

                            <Tab
                                key="submissions"
                                title={
                                    <div className="flex items-center gap-3">
                                        <FaCode className="text-lg" />
                                        <span>Submissions</span>
                                        <Chip 
                                            size="lg" 
                                            className="bg-red-500/20 text-red-300 border border-red-500/30"
                                        >
                                            {filteredSubmissions.length}
                                        </Chip>
                                    </div>
                                }
                            >
                                <SubmissionsTab 
                                    filteredSubmissions={filteredSubmissions}
                                    filterStatus={filterStatus}
                                    setFilterStatus={setFilterStatus}
                                    selectedPeriod={selectedPeriod}
                                    setSelectedPeriod={setSelectedPeriod}
                                    sortBy={sortBy}
                                    setSortBy={setSortBy}
                                    viewMode={viewMode}
                                    setViewMode={setViewMode}
                                    getScoreColor={getScoreColor}
                                    formatDate={formatDate}
                                />
                            </Tab>

                            <Tab
                                key="rank"
                                title={
                                    <div className="flex items-center gap-3">
                                        <FaCrown className="text-lg" />
                                        <span>Rank</span>
                                        <Chip 
                                            size="lg" 
                                            className="bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                        >
                                            {enhancedProfile.rank}
                                        </Chip>
                                    </div>
                                }
                            >
                                <RankTab enhancedProfile={enhancedProfile} />
                            </Tab>

                            <Tab
                                key="analytics"
                                title={
                                    <div className="flex items-center gap-3">
                                        <FaChartLine className="text-lg" />
                                        <span>Analytics</span>
                                    </div>
                                }
                            >
                                <AnalyticsTab 
                                    enhancedProfile={enhancedProfile}
                                    stats={stats}
                                    filteredSubmissions={filteredSubmissions}
                                    selectedPeriod={selectedPeriod}
                                    setSelectedPeriod={setSelectedPeriod}
                                    getAchievementIcon={getAchievementIcon}
                                    getAchievementRarityColor={getAchievementRarityColor}
                                />
                            </Tab>

                            <Tab
                                key="achievements"
                                title={
                                    <div className="flex items-center gap-3">
                                        <FaTrophy className="text-lg" />
                                        <span>Achievements</span>
                                        <Chip 
                                            size="lg" 
                                            className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                                        >
                                            {enhancedProfile.achievements.filter(a => a.unlocked).length}
                                        </Chip>
                                    </div>
                                }
                            >
                                <AchievementsTab 
                                    enhancedProfile={enhancedProfile}
                                    getAchievementIcon={getAchievementIcon}
                                    getAchievementRarityColor={getAchievementRarityColor}
                                />
                            </Tab>

                            {isOwnProfile && (
                                <Tab
                                    key="settings"
                                    title={
                                        <div className="flex items-center gap-3">
                                            <FaCog className="text-lg" />
                                            <span>Settings</span>
                                        </div>
                                    }
                                >
                                    <SettingsTab 
                                        updateError={updateError}
                                        updateSuccess={updateSuccess}
                                        isEditing={isEditing}
                                        setIsEditing={setIsEditing}
                                        editForm={editForm}
                                        setEditForm={setEditForm}
                                        profile={profile}
                                        handleProfileSave={handleProfileSave}
                                        updateLoading={updateLoading}
                                        setUpdateError={setUpdateError}
                                        setUpdateSuccess={setUpdateSuccess}
                                    />
                                </Tab>
                            )}
                        </Tabs>
                    </CardBody>
                </Card>
            </div>

            <Modal 
                isOpen={isSolutionOpen} 
                onClose={onSolutionClose}
                size="5xl"
                classNames={{
                    base: "bg-bgCustomCard border border-gray-700/50",
                    header: "border-b border-gray-700/30 pb-4",
                    body: "py-6",
                    footer: "border-t border-gray-700/30 pt-4"
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-2">
                        <div className="flex items-center justify-between w-full">
                            <h3 className="text-2xl font-bold text-white">
                                Problem #{selectedSolution?.problemId} Solution
                            </h3>
                            <div className="flex items-center gap-3">
                                <Chip
                                    size="lg"
                                    color={selectedSolution ? getScoreColor(selectedSolution.score) : "default"}
                                    variant="flat"
                                    className="font-bold"
                                >
                                    {selectedSolution?.score} pts
                                </Chip>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6 text-gray-400">
                            <span className="flex items-center gap-2">
                                <FaClock />
                                {selectedSolution && formatDate(selectedSolution.date)}
                            </span>
                            <span className="flex items-center gap-2">
                                <FaCode />
                                C++ Language
                            </span>
                            <span className="flex items-center gap-2">
                                <FaLightbulb />
                                {selectedSolution?.lines} lines, {selectedSolution?.chars} characters
                            </span>
                        </div>
                    </ModalHeader>
                    
                    <ModalBody>
                        <div className="bg-gray-900/80 rounded-xl p-6 border border-gray-700/50">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-white">Source Code</h4>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="bordered"
                                        className="border-gray-600 hover:border-purple-500/50 text-gray-300"
                                        startContent={<FaCopy />}
                                        onPress={() => selectedSolution && copyToClipboard(selectedSolution.solution)}
                                    >
                                        Copy Code
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="bordered"
                                        className="border-gray-600 hover:border-purple-500/50 text-gray-300"
                                        startContent={<FaDownload />}
                                    >
                                        Download
                                    </Button>
                                </div>
                            </div>
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto bg-black/50 p-4 rounded-lg border border-gray-800">
                                <code className="language-cpp">{selectedSolution?.solution}</code>
                            </pre>
                        </div>
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button
                            size="lg"
                            className="bg-gray-600 hover:bg-gray-700 text-white"
                            onPress={onSolutionClose}
                        >
                            Close
                        </Button>
                        <Button
                            size="lg"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            startContent={<FaEye />}
                            onPress={() => {
                                onSolutionClose();
                                window.open(`/problems/${selectedSolution?.problemId}`, '_blank');
                            }}
                        >
                            View Problem
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default ProfilePage;