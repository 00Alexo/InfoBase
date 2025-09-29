const mongoose = require('mongoose');

class CodeBattleManager {
    constructor() {
        this.matchmakingQueue = new Map();
        this.activeBattles = new Map();
        this.userToBattle = new Map();
        this.socketToUser = new Map();

        this.generalQueue = new Set();
        
        this.problemProbabilities = {
            easy: 0.25,  
            medium: 0.50,  
            hard: 0.25    
        };
    }

    joinMatchmaking(socket, userData) {
        const { userId, username, skillLevel = 1000 } = userData;
        
        this.leaveMatchmaking(userId);
        
        const queueEntry = {
            socket,
            userId,
            username,
            skillLevel,
            timestamp: Date.now()
        };
        
        this.matchmakingQueue.set(userId, queueEntry);
        this.generalQueue.add(userId);
        this.socketToUser.set(socket.id, userId);
        
        console.log(`User ${username} joined general matchmaking queue`);

        socket.emit('matchmaking-joined', {
            queuePosition: this.generalQueue.size,
            estimatedWaitTime: this.getEstimatedWaitTime(),
            problemProbabilities: this.problemProbabilities
        });

        this.attemptMatching();
        
        this.broadcastQueueStats();
        
        return true;
    }

    leaveMatchmaking(userId) {
        const queueEntry = this.matchmakingQueue.get(userId);
        if (queueEntry) {
            this.matchmakingQueue.delete(userId);
            this.generalQueue.delete(userId);
            
            if (queueEntry.socket && queueEntry.socket.connected) {
                queueEntry.socket.emit('matchmaking-left');
            }
            
            console.log(`User ${queueEntry.username} left matchmaking queue`);
            this.broadcastQueueStats();
            return true;
        }
        return false;
    }
    attemptMatching() {
        const queue = Array.from(this.generalQueue)
            .map(userId => this.matchmakingQueue.get(userId))
            .filter(entry => entry && entry.socket.connected)
            .sort((a, b) => a.timestamp - b.timestamp);

        if (queue.length >= 2) {
            // TODO: Implement skill-based matching algorithm
            const player1 = queue[0];
            const player2 = queue[1];
            
            this.createBattle(player1, player2);
        }
    }

    createBattle(player1, player2) {
        const battleId = this.generateBattleId();
        const roomName = `battle_${battleId}`;
        
        const selectedDifficulty = this.selectRandomDifficulty();
        
        this.leaveMatchmaking(player1.userId);
        this.leaveMatchmaking(player2.userId);
        
        const battleData = {
            battleId,
            roomName,
            players: {
                [player1.userId]: {
                    userId: player1.userId,
                    username: player1.username,
                    socket: player1.socket,
                    ready: false,
                    code: '',
                    language: 'C++',
                    score: 0,
                    submissions: 0,
                    lastSubmission: null
                },
                [player2.userId]: {
                    userId: player2.userId,
                    username: player2.username,
                    socket: player2.socket,
                    ready: false,
                    code: '',
                    language: 'C++',
                    score: 0,
                    submissions: 0,
                    lastSubmission: null
                }
            },
            status: 'waiting', 
            difficulty: selectedDifficulty,
            problem: null, 
            startTime: null,
            endTime: null,
            duration: 15 * 60 * 1000,
            createdAt: Date.now()
        };
        
        this.activeBattles.set(battleId, battleData);
        this.userToBattle.set(player1.userId, battleId);
        this.userToBattle.set(player2.userId, battleId);

        console.log('=== BATTLE CREATION DEBUG ===');
        console.log('Created battle with ID:', battleId);
        console.log('Battle stored in activeBattles:', this.activeBattles.has(battleId));
        console.log('Player1 mapping:', { userId: player1.userId, battleId });
        console.log('Player2 mapping:', { userId: player2.userId, battleId });
        console.log('Active battles count:', this.activeBattles.size);

        player1.socket.join(roomName);
        player2.socket.join(roomName);

        const matchData = {
            battleId,
            opponent: {
                userId: player2.userId,
                username: player2.username
            },
            difficulty: battleData.difficulty,
            status: 'matched'
        };
        
        const matchData2 = {
            battleId,
            opponent: {
                userId: player1.userId,
                username: player1.username
            },
            difficulty: battleData.difficulty,
            status: 'matched'
        };
        
        player1.socket.emit('match-found', matchData);
        player2.socket.emit('match-found', matchData2);
        
        console.log(`Battle created: ${battleId} between ${player1.username} and ${player2.username} (${selectedDifficulty} difficulty)`);
        console.log(`Player1 (${player1.username}) match data:`, matchData);
        console.log(`Player2 (${player2.username}) match data:`, matchData2);
        console.log('Battle ID being sent to players:', battleId);

        this.startPreparationPhase(battleId);

        this.broadcastQueueStats();
        this.broadcastActiveBattles();
        
        return battleId;
    }

    startPreparationPhase(battleId) {
        const battle = this.activeBattles.get(battleId);
        if (!battle) return;

        setTimeout(() => {
            this.checkBattleReadiness(battleId);
        }, 30000);
    }

    setPlayerReady(userId, ready = true) {
        const battleId = this.userToBattle.get(userId);
        if (!battleId) return false;
        
        const battle = this.activeBattles.get(battleId);
        if (!battle || !battle.players[userId]) return false;
        
        battle.players[userId].ready = ready;
        
        const io = global.io;
        io.to(battle.roomName).emit('player-ready-status', {
            userId,
            ready,
            allReady: Object.values(battle.players).every(p => p.ready)
        });

        if (Object.values(battle.players).every(p => p.ready)) {
            this.startBattle(battleId);
        }
        
        return true;
    }

    checkBattleReadiness(battleId) {
        const battle = this.activeBattles.get(battleId);
        if (!battle) return;
        
        const readyPlayers = Object.values(battle.players).filter(p => p.ready);
        
        if (readyPlayers.length === 0) {
            this.cancelBattle(battleId, 'No players ready');
        } else if (readyPlayers.length === 1) {
            this.endBattle(battleId, readyPlayers[0].userId, 'opponent_not_ready');
        } else {
            this.startBattle(battleId);
        }
    }

    async startBattle(battleId) {
        const battle = this.activeBattles.get(battleId);
        if (!battle) return;
        
        const problem = await this.getRandomProblem(battle.difficulty);
        
        battle.problem = problem;
        battle.status = 'active';
        battle.startTime = Date.now();
        battle.endTime = battle.startTime + battle.duration;
        
        const io = global.io;
        io.to(battle.roomName).emit('battle-started', {
            battleId,
            problem,
            duration: battle.duration,
            startTime: battle.startTime,
            endTime: battle.endTime
        });
        
        console.log(`Battle ${battleId} started`);
        
        setTimeout(() => {
            this.endBattleByTimeout(battleId);
        }, battle.duration);
        
        this.broadcastActiveBattles();
    }

    submitCode(userId, submissionData) {
        const battleId = this.userToBattle.get(userId);
        if (!battleId) return { success: false, error: 'Not in a battle' };
        
        const battle = this.activeBattles.get(battleId);
        if (!battle || battle.status !== 'active') {
            return { success: false, error: 'Battle not active' };
        }
        
        const player = battle.players[userId];
        if (!player) return { success: false, error: 'Player not found' };
        
        const { code, language } = submissionData;
        
        player.code = code;
        player.language = language;
        player.submissions++;
        player.lastSubmission = Date.now();
        
        const mockScore = Math.floor(Math.random() * 100);
        player.score = Math.max(player.score, mockScore);
        
        const io = global.io;
        io.to(battle.roomName).emit('submission-result', {
            userId,
            score: mockScore,
            totalScore: player.score,
            submissions: player.submissions,
            timestamp: player.lastSubmission
        });
        
        if (mockScore === 100) {
            this.endBattle(battleId, userId, 'perfect_score');
        }
        
        return { success: true, score: mockScore };
    }

    endBattle(battleId, winnerId, reason = 'completed') {
        const battle = this.activeBattles.get(battleId);
        if (!battle) return;
        
        battle.status = 'finished';
        battle.endTime = Date.now();
        battle.winner = winnerId;
        battle.endReason = reason;
        
        const io = global.io;
        io.to(battle.roomName).emit('battle-ended', {
            battleId,
            winner: battle.players[winnerId],
            reason,
            finalScores: Object.fromEntries(
                Object.entries(battle.players).map(([id, player]) => [id, {
                    userId: id,
                    username: player.username,
                    score: player.score,
                    submissions: player.submissions
                }])
            ),
            duration: battle.endTime - battle.startTime
        });
        
        console.log(`Battle ${battleId} ended. Winner: ${battle.players[winnerId]?.username}`);
        
        this.cleanupBattle(battleId);
    }

    endBattleByTimeout(battleId) {
        const battle = this.activeBattles.get(battleId);
        if (!battle || battle.status !== 'active') return;

        const players = Object.values(battle.players);
        const winner = players.reduce((prev, current) => 
            (prev.score > current.score) ? prev : current
        );
        
        this.endBattle(battleId, winner.userId, 'timeout');
    }

    cancelBattle(battleId, reason) {
        const battle = this.activeBattles.get(battleId);
        if (!battle) return;
        
        const io = global.io;
        io.to(battle.roomName).emit('battle-cancelled', {
            battleId,
            reason
        });
        
        console.log(`Battle ${battleId} cancelled: ${reason}`);
        this.cleanupBattle(battleId);
    }

    cleanupBattle(battleId) {
        const battle = this.activeBattles.get(battleId);
        if (!battle) return;

        Object.keys(battle.players).forEach(userId => {
            this.userToBattle.delete(userId);
        });
        this.activeBattles.delete(battleId);
        
        this.broadcastActiveBattles();
    }

    handleDisconnect(socket) {
        const userId = this.socketToUser.get(socket.id);
        if (!userId) return;
        
        this.socketToUser.delete(socket.id);
        
        this.leaveMatchmaking(userId);

        const battleId = this.userToBattle.get(userId);
        if (battleId) {
            const battle = this.activeBattles.get(battleId);
            if (battle && battle.status === 'active') {
                const otherPlayerId = Object.keys(battle.players).find(id => id !== userId);
                if (otherPlayerId) {
                    this.endBattle(battleId, otherPlayerId, 'opponent_disconnected');
                } else {
                    this.cancelBattle(battleId, 'player_disconnected');
                }
            } else {
                this.cancelBattle(battleId, 'player_disconnected');
            }
        }
    }

    getQueueStats() {
        return {
            total: this.matchmakingQueue.size,
            inQueue: this.generalQueue.size,
            activeBattles: this.activeBattles.size,
            problemProbabilities: this.problemProbabilities
        };
    }

    getActiveBattles() {
        return Array.from(this.activeBattles.values()).map(battle => ({
            battleId: battle.battleId,
            players: Object.values(battle.players).map(p => ({
                username: p.username,
                score: p.score,
                submissions: p.submissions
            })),
            difficulty: battle.difficulty,
            status: battle.status,
            timeRemaining: battle.status === 'active' ? 
                Math.max(0, battle.endTime - Date.now()) : null,
            startTime: battle.startTime
        }));
    }

    broadcastQueueStats() {
        const io = global.io;
        if (io) {
            io.emit('queue-stats', this.getQueueStats());
        }
    }

    broadcastActiveBattles() {
        const io = global.io;
        if (io) {
            io.emit('active-battles', this.getActiveBattles());
        }
    }

    generateBattleId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        const battleId = `battle_${timestamp}_${random}`;
        console.log('Generated battleId:', battleId);
        return battleId;
    }

    getEstimatedWaitTime() {
        const queueSize = this.generalQueue.size;
        return Math.max(30, queueSize * 30);
    }

    selectRandomDifficulty() {
        const rand = Math.random();
        let cumulative = 0;
        
        for (const [difficulty, probability] of Object.entries(this.problemProbabilities)) {
            cumulative += probability;
            if (rand <= cumulative) {
                return difficulty;
            }
        }

        return 'medium';
    }

    async getRandomProblem(difficulty) {
        return {
            id: 'mock_problem_' + Date.now(),
            title: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Problem`,
            description: 'This is a mock problem for code battles.',
            difficulty,
            timeLimit: 5000,
            memoryLimit: 256,
            examples: [
                {
                    input: '5\n1 2 3 4 5',
                    output: '15'
                }
            ],
            testCases: [
                { input: '5\n1 2 3 4 5', output: '15' },
                { input: '3\n10 20 30', output: '60' }
            ]
        };
    }
}

const battleManager = new CodeBattleManager();

const getQueueStats = (req, res) => {
    try {
        const stats = battleManager.getQueueStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error getting queue stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getActiveBattles = (req, res) => {
    try {
        const battles = battleManager.getActiveBattles();
        res.status(200).json(battles);
    } catch (error) {
        console.error('Error getting active battles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const handleSocketEvents = (io) => {
    io.on('connection', (socket) => {

        socket.on('join-battle', (data) => {
            try {
                const { battleId, userId, username } = data;
                console.log('=== JOIN BATTLE DEBUG ===');
                console.log('Received join-battle request:', { battleId, userId, username });
                console.log('Active battles:', Array.from(battleManager.activeBattles.keys()));
                console.log('Battle exists:', battleManager.activeBattles.has(battleId));
                
                const battle = battleManager.activeBattles.get(battleId);
                
                if (!battle) {
                    console.log('Battle not found for ID:', battleId);
                    console.log('Available battle IDs:', Array.from(battleManager.activeBattles.keys()));
                    socket.emit('battle-error', { message: 'Battle not found' });
                    return;
                }
                
                console.log('Found battle:', {
                    battleId: battle.battleId,
                    status: battle.status,
                    playerIds: Object.keys(battle.players)
                });

                const player = battle.players[userId];
                if (!player) {
                    console.log('Player not found in battle. Player IDs in battle:', Object.keys(battle.players));
                    console.log('Requested userId:', userId);
                    socket.emit('battle-error', { message: 'You are not a participant in this battle' });
                    return;
                }
                
                console.log('Player found in battle:', player.username);
                
                battle.players[userId].socket = socket;
                socket.join(battle.roomName);
                battleManager.socketToUser.set(socket.id, userId);

                const opponentId = Object.keys(battle.players).find(id => id !== userId);
                const opponent = battle.players[opponentId];
                
                console.log('Opponent data:', opponent ? opponent.username : 'No opponent');

                socket.emit('battle-joined', {
                    battle: {
                        battleId: battle.battleId,
                        status: battle.status,
                        difficulty: battle.difficulty,
                        startTime: battle.startTime,
                        duration: battle.duration
                    },
                    problem: battle.problem,
                    opponent: opponent ? {
                        userId: opponent.userId,
                        username: opponent.username,
                        score: opponent.score,
                        submissions: opponent.submissions
                    } : null,
                    myData: {
                        score: player.score,
                        submissions: player.submissions,
                        code: player.code,
                        language: player.language
                    }
                });
                
                console.log(`Player ${username} successfully joined battle ${battleId}`);
                
                if (opponent && opponent.socket && opponent.socket.connected) {
                    opponent.socket.emit('opponent-joined', {
                        userId: player.userId,
                        username: player.username
                    });
                }
                
            } catch (error) {
                console.error('Error joining battle:', error);
                socket.emit('battle-error', { message: 'Failed to join battle' });
            }
        });

        socket.on('code-update', (data) => {
            try {
                const { battleId, code, language } = data;
                const userId = battleManager.socketToUser.get(socket.id);
                
                if (!userId) return;
                
                const battle = battleManager.activeBattles.get(battleId);
                if (!battle || !battle.players[userId]) return;
                
                battle.players[userId].code = code;
                battle.players[userId].language = language;
                
                const opponentId = Object.keys(battle.players).find(id => id !== userId);
                const opponent = battle.players[opponentId];
                
                if (opponent && opponent.socket && opponent.socket.connected) {
                    opponent.socket.emit('opponent-code-update', {
                        code,
                        language
                    });
                }
                
            } catch (error) {
                console.error('Error updating code:', error);
            }
        });

        socket.on('progress-update', (data) => {
            try {
                const { battleId, progress } = data;
                const userId = battleManager.socketToUser.get(socket.id);
                
                if (!userId) return;
                
                const battle = battleManager.activeBattles.get(battleId);
                if (!battle || !battle.players[userId]) return;

                battle.players[userId].score = progress.score;
                battle.players[userId].submissions = progress.submissions;
                
                const opponentId = Object.keys(battle.players).find(id => id !== userId);
                const opponent = battle.players[opponentId];
                
                if (opponent && opponent.socket && opponent.socket.connected) {
                    opponent.socket.emit('opponent-progress-update', {
                        progress
                    });
                }
                
            } catch (error) {
                console.error('Error updating progress:', error);
            }
        });

        socket.on('battle-win', (data) => {
            try {
                const { battleId } = data;
                const userId = battleManager.socketToUser.get(socket.id);
                
                if (!userId) return;
                
                const battle = battleManager.activeBattles.get(battleId);
                if (!battle || !battle.players[userId]) return;
                
                battle.status = 'finished';
                battle.endTime = Date.now();
                battle.winner = userId;

                Object.values(battle.players).forEach(player => {
                    if (player.socket && player.socket.connected) {
                        player.socket.emit('battle-finished', {
                            winner: userId,
                            winnerUsername: battle.players[userId].username,
                            finalScores: {
                                [battle.players[Object.keys(battle.players)[0]].userId]: battle.players[Object.keys(battle.players)[0]].score,
                                [battle.players[Object.keys(battle.players)[1]].userId]: battle.players[Object.keys(battle.players)[1]].score
                            }
                        });
                    }
                });
                
                console.log(`Battle ${battleId} finished, winner: ${battle.players[userId].username}`);
                
            } catch (error) {
                console.error('Error handling battle win:', error);
            }
        });

        socket.on('join-matchmaking', (data) => {
            try {
                battleManager.joinMatchmaking(socket, data);
            } catch (error) {
                console.error('Error joining matchmaking:', error);
                socket.emit('error', { message: 'Failed to join matchmaking' });
            }
        });

        socket.on('leave-matchmaking', () => {
            try {
                const userId = battleManager.socketToUser.get(socket.id);
                if (userId) {
                    battleManager.leaveMatchmaking(userId);
                }
            } catch (error) {
                console.error('Error leaving matchmaking:', error);
            }
        });

        socket.on('set-ready', (data) => {
            try {
                const userId = battleManager.socketToUser.get(socket.id);
                if (userId) {
                    battleManager.setPlayerReady(userId, data.ready);
                }
            } catch (error) {
                console.error('Error setting ready status:', error);
                socket.emit('error', { message: 'Failed to set ready status' });
            }
        });

        socket.on('submit-battle-code', (data) => {
            try {
                const userId = battleManager.socketToUser.get(socket.id);
                if (userId) {
                    const result = battleManager.submitCode(userId, data);
                    socket.emit('submission-response', result);
                }
            } catch (error) {
                console.error('Error submitting battle code:', error);
                socket.emit('error', { message: 'Failed to submit code' });
            }
        });

        socket.on('request-stats', () => {
            try {
                socket.emit('queue-stats', battleManager.getQueueStats());
                socket.emit('active-battles', battleManager.getActiveBattles());
            } catch (error) {
                console.error('Error sending stats:', error);
            }
        });

        socket.on('disconnect', () => {
            try {
                battleManager.handleDisconnect(socket);
            } catch (error) {
                console.error('Error handling disconnect:', error);
            }
        });
    });
};

module.exports = {
    getQueueStats,
    getActiveBattles,
    handleSocketEvents,
    battleManager
};
