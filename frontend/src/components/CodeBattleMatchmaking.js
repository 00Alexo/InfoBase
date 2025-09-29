import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Spinner, Card } from '@heroui/react';
import { useAuthContext } from '../Hooks/useAuthContext';
import io from 'socket.io-client';

const MATCHMAKING_STATES = {
    IDLE: 'idle',
    SEARCHING: 'searching', 
    MATCH_FOUND: 'match_found',
    PREPARING: 'preparing'
};

const COUNTDOWN_DURATION = 5;

const CodeBattleMatchmaking = ({ difficulty = 'medium', onCancel }) => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const socketRef = useRef(null);
    
    const [matchmakingState, setMatchmakingState] = useState(MATCHMAKING_STATES.IDLE);
    const [searchDuration, setSearchDuration] = useState(0);
    const [queuePosition, setQueuePosition] = useState(0);
    const [estimatedWaitTime, setEstimatedWaitTime] = useState(0);
    const [opponentData, setOpponentData] = useState(null);
    const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
    const [battleId, setBattleId] = useState(null);

    const searchTimerRef = useRef(null);
    const countdownTimerRef = useRef(null);
    const redirectTimeoutRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        const socket = io(`${process.env.REACT_APP_API_SOCKET || 'http://localhost:4000'}`);
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to battle server');
        });

        socket.on('matchmaking-joined', (data) => {
            setQueuePosition(data.queuePosition);
            setEstimatedWaitTime(data.estimatedWaitTime);
            setMatchmakingState(MATCHMAKING_STATES.SEARCHING);
            startSearchTimer();
        });

        socket.on('match-found', (data) => {
            setOpponentData(data.opponent);
            setBattleId(data.battleId);
            setMatchmakingState(MATCHMAKING_STATES.MATCH_FOUND);
            stopSearchTimer();
            startCountdown();
        });

        socket.on('battle-cancelled', (data) => {
            console.log('Battle cancelled:', data.reason);
            resetMatchmaking();
        });

        socket.on('error', (error) => {
            console.error('Matchmaking error:', error);
            resetMatchmaking();
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from battle server');
            resetMatchmaking();
        });

        return () => {
            cleanup();
            socket.disconnect();
        };
    }, [user]);

    const startSearchTimer = useCallback(() => {
        searchTimerRef.current = setInterval(() => {
            setSearchDuration(prev => prev + 1);
        }, 1000);
    }, []);

    const stopSearchTimer = useCallback(() => {
        if (searchTimerRef.current) {
            clearInterval(searchTimerRef.current);
            searchTimerRef.current = null;
        }
    }, []);

    const startCountdown = useCallback(() => {
        setCountdown(COUNTDOWN_DURATION);
        setMatchmakingState(MATCHMAKING_STATES.PREPARING);
        
        countdownTimerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownTimerRef.current);
                    redirectTimeoutRef.current = setTimeout(() => {
                        navigate(`/battle/${battleId}`);
                    }, 500);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [battleId, navigate]);

    const startMatchmaking = useCallback(() => {
        if (!socketRef.current || !user) return;
        
        setSearchDuration(0);
        socketRef.current.emit('join-matchmaking', {
            userId: user.username,
            username: user.username,
            difficulty,
            skillLevel: user.ELO || 1000
        });
    }, [difficulty, user]);

    const cancelMatchmaking = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.emit('leave-matchmaking');
        }
        resetMatchmaking();
    }, []);

    const resetMatchmaking = useCallback(() => {
        setMatchmakingState(MATCHMAKING_STATES.IDLE);
        setSearchDuration(0);
        setQueuePosition(0);
        setEstimatedWaitTime(0);
        setOpponentData(null);
        setCountdown(COUNTDOWN_DURATION);
        setBattleId(null);
        cleanup();
    }, []);

    const cleanup = useCallback(() => {
        if (searchTimerRef.current) {
            clearInterval(searchTimerRef.current);
            searchTimerRef.current = null;
        }
        if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
        }
        if (redirectTimeoutRef.current) {
            clearTimeout(redirectTimeoutRef.current);
            redirectTimeoutRef.current = null;
        }
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const backgroundAnimation = matchmakingState !== MATCHMAKING_STATES.IDLE 
        ? "animate-pulse bg-gradient-to-br from-red-900/10 via-gray-900 to-red-900/10" 
        : "bg-gray-900";

    if (matchmakingState === MATCHMAKING_STATES.IDLE) {
        return (
            <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
                <Card className="bg-gray-800/90 backdrop-blur-xl border border-gray-700 p-8 max-w-md w-full mx-4">
                    <div className="text-center space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Ready to Battle?</h2>
                            <p className="text-gray-400">Find an opponent and test your coding skills</p>
                        </div>
                        
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <div className="text-sm text-gray-300 mb-2">Difficulty Level</div>
                            <div className={`text-lg font-semibold ${
                                difficulty === 'easy' ? 'text-green-400' :
                                difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button 
                                onClick={startMatchmaking}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-base"
                                size="lg"
                            >
                                Find Opponent
                            </Button>
                            
                            {onCancel && (
                                <Button 
                                    onClick={onCancel}
                                    variant="ghost"
                                    className="w-full text-gray-400 hover:text-white"
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    if (matchmakingState === MATCHMAKING_STATES.SEARCHING) {
        return (
            <div className={`fixed inset-0 ${backgroundAnimation} flex items-center justify-center z-50`}>
                <div className="text-center space-y-8 max-w-md mx-4">
                    <div className="space-y-6">
                        <div className="relative">
                            <Spinner 
                                size="lg" 
                                color="danger"
                                className="w-16 h-16"
                            />
                            <div className="absolute inset-0 border-4 border-red-500/20 rounded-full animate-ping"></div>
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Searching for Opponent</h2>
                            <p className="text-gray-400">Finding a worthy challenger...</p>
                        </div>
                    </div>

                    <Card className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-red-400">{formatTime(searchDuration)}</div>
                                <div className="text-sm text-gray-400">Search Time</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-400">#{queuePosition}</div>
                                <div className="text-sm text-gray-400">Position in Queue</div>
                            </div>
                        </div>
                        
                        {estimatedWaitTime > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <div className="text-sm text-gray-400">
                                    Estimated wait: ~{Math.ceil(estimatedWaitTime / 60)} minutes
                                </div>
                            </div>
                        )}
                    </Card>

                    <Button 
                        onClick={cancelMatchmaking}
                        variant="ghost"
                        className="text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500"
                    >
                        Cancel Search
                    </Button>
                </div>
            </div>
        );
    }

    if (matchmakingState === MATCHMAKING_STATES.MATCH_FOUND || matchmakingState === MATCHMAKING_STATES.PREPARING) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-red-900/20 via-gray-900 to-red-900/20 flex items-center justify-center z-50">
                <div className="text-center space-y-8 max-w-lg mx-4">
                    <div className="space-y-4">
                        <div className="text-green-400 text-lg font-semibold animate-pulse">
                            ⚡ MATCH FOUND!
                        </div>
                        <h2 className="text-3xl font-bold text-white">Preparing Your Battle</h2>
                    </div>

                    {opponentData && (
                        <Card className="bg-gray-800/90 backdrop-blur-xl border border-red-500/30 p-6">
                            <div className="flex items-center justify-center space-x-4">
                                <div className="text-center">
                                    <Avatar
                                        src={user?.profilePicture}
                                        name={user?.username?.charAt(0)?.toUpperCase()}
                                        size="lg"
                                        className="border-2 border-blue-500"
                                    />
                                    <div className="mt-2 text-sm font-medium text-white">{user?.username}</div>
                                    <div className="text-xs text-gray-400">You</div>
                                </div>
                                
                                <div className="text-red-400 text-2xl font-bold animate-pulse">VS</div>
                                
                                <div className="text-center">
                                    <Avatar
                                        src={opponentData.profilePicture}
                                        name={opponentData.username?.charAt(0)?.toUpperCase()}
                                        size="lg"
                                        className="border-2 border-red-500"
                                    />
                                    <div className="mt-2 text-sm font-medium text-white">{opponentData.username}</div>
                                    <div className="text-xs text-gray-400">Opponent</div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {matchmakingState === MATCHMAKING_STATES.PREPARING && (
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className={`text-6xl font-bold transition-all duration-300 ${
                                    countdown <= 3 ? 'text-red-400 animate-pulse scale-110' : 'text-white'
                                }`}>
                                    {countdown}
                                </div>
                                <div className="text-gray-400 mt-2">Starting battle...</div>
                            </div>
                        
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                    className="bg-red-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                                    style={{ 
                                        width: `${((COUNTDOWN_DURATION - countdown) / COUNTDOWN_DURATION) * 100}%` 
                                    }}
                                ></div>
                            </div>
                        </div>
                    )}

                    <div className="text-center">
                        <div className="inline-flex items-center space-x-2 bg-gray-800/50 rounded-full px-4 py-2 border border-gray-600">
                            <div className={`w-2 h-2 rounded-full ${
                                difficulty === 'easy' ? 'bg-green-400' :
                                difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                            }`}></div>
                            <span className="text-sm text-gray-300">{difficulty.toUpperCase()} DIFFICULTY</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default CodeBattleMatchmaking;