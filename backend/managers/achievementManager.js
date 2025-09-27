class AchievementManager {
    constructor(user) {
        this.user = user;
        this.achievements = user.achievements || [];
    }
    
    unlockAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);

        if (!achievement)
            return {success: false, error: 'Achievement not found!'};

        if (achievement.unlocked)
            return {success: false, error: 'Achievement already unlocked!'};

        achievement.unlocked = true;

        this.user.markModified('achievements');
        // Save deferred to onProblemSolved() to avoid ParallelSaveError

        return {success: true, achievement};
    }

    addProgress(achievementId, progress) {
        const achievement = this.achievements.find(a => a.id === achievementId);

        if (!achievement)
            return {success: false, error: 'Achievement not found!'};

        if (achievement.progress >= achievement.target)
            return {success: false, error: 'Achievement already completed!'};

        achievement.progress += progress;

        if (achievement.progress >= achievement.target) {
            achievement.unlocked = true;
        }

        this.user.markModified('achievements');
        // Remove immediate save - will be saved at the end

        return {success: true, achievement};
    }

    weekendWarrior() {
        const date = new Date();
        const day = date.getDay();
        if(day === 0 || day === 6) {
            return this.addProgress('weekend_warrior', 1);
        }
    }

    nightOwl() {
        const date = new Date();
        const hour = date.getHours();
        if(hour >= 0 && hour < 6) {
            return this.addProgress('night_owl', 1);
        }
    }

    speedDemon(){
        const achievement = this.achievements.find(a => a.id === 'speed_demon');
        if (!achievement || achievement.unlocked) {
            return {success: false, error: 'Achievement not found or already unlocked'};
        }

        const today = new Date();
        const todayStr = today.toDateString();
        
        const solvedProblems = this.user.solvedProblems || [];
        const todaysSolvedProblems = solvedProblems.filter(problem => {
            const problemDate = new Date(problem.solvedAt || problem.date);
            return problemDate.toDateString() === todayStr;
        });
        
        const todaysCount = todaysSolvedProblems.length;
        
        const lastUpdateDate = achievement.lastUpdateDate;
        if (lastUpdateDate && new Date(lastUpdateDate).toDateString() !== todayStr) {
            achievement.progress = todaysCount;
        } else {
            achievement.progress = todaysCount;
        }
        
        achievement.lastUpdateDate = today;
        
        if (achievement.progress >= achievement.target) {
            achievement.unlocked = true;
        }
        
        this.user.markModified('achievements');
        // Save deferred to onProblemSolved() to avoid ParallelSaveError
        
        return {
            success: true, 
            achievement, 
            todaysProgress: todaysCount,
            unlocked: achievement.unlocked
        };
    }

    perfectionist(){
        const achievement = this.achievements.find(a => a.id === 'perfectionist');
        if (!achievement || achievement.unlocked) {
            return {success: false, error: 'Achievement not found or already unlocked'};
        }

        return this.addProgress('perfectionist', 1);
    }

    unstoppable() {
        const achievement = this.achievements.find(a => a.id === 'unstoppable');
        if (!achievement || achievement.unlocked) {
            return {success: false, error: 'Achievement not found or already unlocked'};
        }

        const solvedProblems = this.user.solvedProblems || [];
        if (solvedProblems.length === 0) {
            achievement.progress = 0;
            this.user.markModified('achievements');
            // Save deferred to onProblemSolved() to avoid ParallelSaveError
            return {success: true, achievement, currentStreak: 0};
        }

        const sortedProblems = solvedProblems.sort((a, b) => 
            new Date(b.solvedAt || b.date) - new Date(a.solvedAt || a.date)
        );

        let currentStreak = 0;
        const today = new Date();
        const uniqueDays = new Set();

        sortedProblems.forEach(problem => {
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
                currentStreak++;
            } else if (i === 0 && dayDate.toDateString() === new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString()) {
                currentStreak++;
            } else {
                break;
            }
        }

        achievement.progress = currentStreak;
        achievement.lastUpdateDate = today;

        if (achievement.progress >= achievement.target) {
            achievement.unlocked = true;
        }

        this.user.markModified('achievements');
        // Save deferred to onProblemSolved() to avoid ParallelSaveError

        return {
            success: true,
            achievement,
            currentStreak,
            unlocked: achievement.unlocked
        };
    }

    onfire() {
        const achievement = this.achievements.find(a => a.id === 'on_fire');
        if (!achievement || achievement.unlocked) {
            return {success: false, error: 'Achievement not found or already unlocked'};
        }

        const solvedProblems = this.user.solvedProblems || [];
        if (solvedProblems.length === 0) {
            achievement.progress = 0;
            this.user.markModified('achievements');
            // Save deferred to onProblemSolved() to avoid ParallelSaveError
            return {success: true, achievement, currentStreak: 0};
        }

        const sortedProblems = solvedProblems.sort((a, b) => 
            new Date(b.solvedAt || b.date) - new Date(a.solvedAt || a.date)
        );

        let currentStreak = 0;
        const today = new Date();
        const uniqueDays = new Set();

        sortedProblems.forEach(problem => {
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
                currentStreak++;
            } else if (i === 0 && dayDate.toDateString() === new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString()) {
                currentStreak++;
            } else {
                break;
            }
        }

        achievement.progress = currentStreak;
        achievement.lastUpdateDate = today;

        if (achievement.progress >= achievement.target) {
            achievement.unlocked = true;
        }

        this.user.markModified('achievements');
        // Save deferred to onProblemSolved() to avoid ParallelSaveError

        return {
            success: true,
            achievement,
            currentStreak,
            unlocked: achievement.unlocked
        };
    }

    centuryClub() {
        const achievement = this.achievements.find(a => a.id === 'century_club');
        if (!achievement || achievement.unlocked) {
            return {success: false, error: 'Achievement not found or already unlocked'};
        }

        return this.addProgress('century_club', 1);
    }

    halfCentury(){
        const achievement = this.achievements.find(a => a.id === 'half_century');
        if (!achievement || achievement.unlocked) {
            return {success: false, error: 'Achievement not found or already unlocked'};
        }

        return this.addProgress('half_century', 1);
    }

    problemCrusher(){
        const achievement = this.achievements.find(a => a.id === 'problem_crusher');
        if (!achievement || achievement.unlocked) {
            return {success: false, error: 'Achievement not found or already unlocked'};
        }

        return this.addProgress('problem_crusher', 1);
    }

    gettingStarted() {
        const achievement = this.achievements.find(a => a.id === 'getting_started');
        if (!achievement || achievement.unlocked) {
            return {success: false, error: 'Achievement not found or already unlocked'};
        }

        return this.addProgress('getting_started', 1);
    }

    firstBlood() {
        const achievement = this.achievements.find(a => a.id === 'first_blood');
        if (!achievement || achievement.unlocked) {
            return {success: false, error: 'Achievement not found or already unlocked'};
        }

        return this.addProgress('first_blood', 1);
    }

    dedicatedLearner() {
        const achievement = this.achievements.find(a => a.id === 'dedicated_learner');
        if (!achievement || achievement.unlocked) {
            return {success: false, error: 'Achievement not found or already unlocked'};
        }

        const solvedProblems = this.user.solvedProblems || [];
        if (solvedProblems.length === 0) {
            achievement.progress = 0;
            this.user.markModified('achievements');
            // Save deferred to onProblemSolved() to avoid ParallelSaveError
            return {success: true, achievement, currentStreak: 0};
        }

        const sortedProblems = solvedProblems.sort((a, b) => 
            new Date(b.solvedAt || b.date) - new Date(a.solvedAt || a.date)
        );

        let currentStreak = 0;
        const today = new Date();
        const uniqueDays = new Set();

        sortedProblems.forEach(problem => {
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
                currentStreak++;
            } else if (i === 0 && dayDate.toDateString() === new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString()) {
                currentStreak++;
            } else {
                break;
            }
        }

        achievement.progress = currentStreak;
        achievement.lastUpdateDate = today;

        if (achievement.progress >= achievement.target) {
            achievement.unlocked = true;
        }

        this.user.markModified('achievements');
        // Save deferred to onProblemSolved() to avoid ParallelSaveError

        return {
            success: true,
            achievement,
            currentStreak,
            unlocked: achievement.unlocked
        };
    }

    async onProblemSolved() {
        const results = {};
        
        try {
            results.firstBlood = this.firstBlood();
        } catch (error) {
            results.firstBlood = {success: false, error: error.message};
        }
        
        try {
            results.gettingStarted = this.gettingStarted();
        } catch (error) {
            results.gettingStarted = {success: false, error: error.message};
        }
        
        try {
            results.problemCrusher = this.problemCrusher();
        } catch (error) {
            results.problemCrusher = {success: false, error: error.message};
        }
        
        try {
            results.halfCentury = this.halfCentury();
        } catch (error) {
            results.halfCentury = {success: false, error: error.message};
        }
        
        try {
            results.centuryClub = this.centuryClub();
        } catch (error) {
            results.centuryClub = {success: false, error: error.message};
        }

        try {
            results.dedicatedLearner = this.dedicatedLearner();
        } catch (error) {
            results.dedicatedLearner = {success: false, error: error.message};
        }
        
        try {
            results.onfire = this.onfire();
        } catch (error) {
            results.onfire = {success: false, error: error.message};
        }
        
        try {
            results.unstoppable = this.unstoppable();
        } catch (error) {
            results.unstoppable = {success: false, error: error.message};
        }
        
        try {
            results.weekendWarrior = this.weekendWarrior();
        } catch (error) {
            results.weekendWarrior = {success: false, error: error.message};
        }
        
        try {
            results.nightOwl = this.nightOwl();
        } catch (error) {
            results.nightOwl = {success: false, error: error.message};
        }
        
        try {
            results.speedDemon = this.speedDemon();
        } catch (error) {
            results.speedDemon = {success: false, error: error.message};
        }
        
        try {
            results.perfectionist = this.perfectionist();
        } catch (error) {
            results.perfectionist = {success: false, error: error.message};
        }
        
        // Single save operation to avoid ParallelSaveError
        try {
            await this.user.save();
        } catch (error) {
            console.error('Failed to save user achievements:', error);
        }
        
        return results;
    }
}

module.exports = AchievementManager;