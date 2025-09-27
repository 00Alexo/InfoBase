const mongoose = require('mongoose');

const achievements = [
    {
        id: 'first_blood',
        category: 'getting_started',
        name: 'First Blood',
        description: 'Submit your very first solution',
        icon: "FaCode",
        rarity: 'common',
        points: 0,
        requirement: 'Submit 1 solution',
        progress: 0,
        target: 1,
        unlocked: false,
        tips: ['Start with an easy problem', 'Read the problem statement carefully', 'Test with the provided examples']
    },
    {
        id: 'getting_started',
        category: 'getting_started',
        name: 'Getting Started',
        description: 'Solve your first 5 problems',
        icon: "FaStar",
        rarity: 'common',
        points: 0,
        requirement: 'Solve 5 problems',
        progress: 0,
        target: 5,
        unlocked: false,
        tips: ['Focus on easy problems first', 'Understand different problem types', 'Practice basic algorithms']
    },
    {
        id: 'dedicated_learner',
        category: 'getting_started',
        name: 'Dedicated Learner',
        description: 'Solve problems for 3 consecutive days',
        icon: "FaCalendarAlt",
        rarity: 'uncommon',
        points: 0,
        requirement: 'Maintain 3-day streak',
        progress: 0,
        target: 3,
        unlocked: false,
        tips: ['Set a daily problem-solving goal', 'Start with just 1 problem per day', 'Use reminders to stay consistent']
    },
    {
        id: 'problem_crusher',
        category: 'problem_solving',
        name: 'Problem Crusher',
        description: 'Solve 25 problems',
        icon: "FaBullseye",
        rarity: 'uncommon',
        points: 0,
        requirement: 'Solve 25 problems',
        progress: 0,
        target: 25,
        unlocked: false,
        tips: ['Mix different difficulty levels', 'Focus on understanding solutions', 'Review and optimize your code']
    },
    {
        id: 'half_century',
        category: 'problem_solving',
        name: 'Half Century',
        description: 'Reach the milestone of 50 solved problems',
        icon: "FaAward",
        rarity: 'rare',
        points: 0,
        requirement: 'Solve 50 problems',
        progress: 0,
        target: 50,
        unlocked: false,
        tips: ['Explore different algorithm categories', 'Practice data structures', 'Challenge yourself with medium problems']
    },
    {
        id: 'century_club',
        category: 'problem_solving',
        name: 'Century Club',
        description: 'Join the elite with 100 solved problems',
        icon: "FaCrown",
        rarity: 'epic',
        points: 0,
        requirement: 'Solve 100 problems',
        progress: 0,
        target: 100,
        unlocked: false,
        tips: ['Master advanced algorithms', 'Solve hard difficulty problems', 'Participate in coding challenges']
    },
    {
        id: 'on_fire',
        category: 'consistency',
        name: 'On Fire!',
        description: 'Maintain a 7-day solving streak',
        icon: "FaFire",
        rarity: 'uncommon',
        points: 0,
        requirement: '7-day streak',
        progress: 0,
        target: 7,
        unlocked: false,
        tips: ['Set achievable daily goals', 'Solve at least 1 problem daily', 'Use streak tracking apps']
    },
    {
        id: 'unstoppable',
        category: 'consistency',
        name: 'Unstoppable',
        description: 'Achieve a 15-day solving streak',
        icon: "FaRocket",
        rarity: 'rare',
        points: 0,
        requirement: '15-day streak',
        progress: 0,
        target: 15,
        unlocked: false,
        tips: ['Plan your solving schedule', 'Have backup easy problems ready', 'Join study groups for motivation']
    },
    {
        id: 'perfectionist',
        category: 'performance',
        name: 'Perfectionist',
        description: 'Achieve 10 perfect scores (100 points)',
        icon: "FaGem",
        rarity: 'rare',
        points: 0,
        requirement: '10 perfect scores',
        progress: 0,
        target: 10,
        unlocked: false,
        tips: ['Focus on code efficiency', 'Handle edge cases properly', 'Optimize time and space complexity']
    },
    {
        id: 'speed_demon',
        category: 'performance',
        name: 'Speed Demon',
        description: 'Solve 5 problems in a single day',
        icon: "FaBolt",
        rarity: 'rare',
        points: 0,
        requirement: '5 problems in 1 day',
        progress: 0,
        target: 5,
        unlocked: false,
        tips: ['Start early in the day', 'Choose problems you\'re comfortable with', 'Time management is key']
    },
    {
        id: 'night_owl',
        category: 'special',
        name: 'Night Owl',
        description: 'Solve 10 problems after midnight',
        icon: "FaClock",
        rarity: 'uncommon',
        points: 0,
        requirement: '10 solutions after midnight',
        progress: 0,
        target: 10,
        unlocked: false,
        tips: ['Late night coding can be peaceful', 'Maintain good sleep schedule', 'Use proper lighting']
    },
    {
        id: 'weekend_warrior',
        category: 'special',
        name: 'Weekend Warrior',
        description: 'Solve 20 problems on weekends',
        icon: "FaUsers",
        rarity: 'uncommon',
        points: 0,
        requirement: '20 weekend solutions',
        progress: 0,
        target: 20,
        unlocked: false,
        tips: ['Use weekends for practice', 'Try longer problem sessions', 'Participate in weekend contests']
    }
];

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    submissions:{
        type: [Object],
        default: [],
        required: true
    },
    achievements: {
        type: [Object],
        default: achievements,
        required: true
    },
    solvedProblems: {
        type: [Object],
        default: [],
        required: true
    },
    bio: {
        type: String,
        default: "",
    },
    profilePicture: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    website: {
        type: String,
        default: "",
    },
    github: {
        type: String,
        default: "",
    },
    linkedin: {
        type: String,
        default: "",
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'Unspecified'],
        default: 'Unspecified',
    },
  }, {timestamps: true});
  
  const UserCollection = mongoose.model("UserCollection", UserSchema);
  
  module.exports = UserCollection; 