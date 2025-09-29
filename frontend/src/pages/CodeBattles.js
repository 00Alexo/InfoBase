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

const CodeBattles = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [queueStats, setQueueStats] = useState(null);
    const [activeBattles, setActiveBattles] = useState([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState('medium');

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

        const newSocket = io(`${process.env.REACT_APP_API_SOCKET || 'http://localhost:4000'}`);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to CodeBattles server');
            newSocket.emit('request-stats', {});
        });

        newSocket.on('queue-stats', (stats) => {
            setQueueStats(stats);
        });

        newSocket.on('active-battles', (battles) => {
            setActiveBattles(battles);
        });

        newSocket.on('matchmaking-joined', (data) => {
            console.log('Joined matchmaking:', data);
            setQueuePosition(data?.queuePosition || 0);
            setEstimatedWaitTime(data?.estimatedWaitTime || 0);
            setMatchmakingState(MATCHMAKING_STATES.SEARCHING);
            startSearchTimer();
        });

        newSocket.on('matchmaking-left', () => {
            console.log('Left matchmaking');
            resetMatchmaking();
        });

        newSocket.on('match-found', (data) => {
            console.log('Match found - Full data received:', JSON.stringify(data, null, 2));
            console.log('Received battleId:', data?.battleId);
            console.log('BattleId type:', typeof data?.battleId);
            
            if (!data?.battleId || data.battleId === 'null' || data.battleId === null || data.battleId === undefined) {
                console.error('Invalid battleId received:', data?.battleId);
                console.error('Full data object:', data);
                resetMatchmaking();
                return;
            }

            const opponentWithDifficulty = {
                ...data?.opponent,
                difficulty: data?.difficulty 
            };
            
            console.log('Setting battleId to:', data.battleId);
            setOpponentData(opponentWithDifficulty || null);
            setBattleId(data.battleId);
            setMatchmakingState(MATCHMAKING_STATES.MATCH_FOUND);
            stopSearchTimer();
            
            setTimeout(() => {
                console.log('Starting countdown with battleId:', data.battleId);
                startCountdown(data.battleId); 
            }, 100);
        });

        newSocket.on('battle-cancelled', (data) => {
            console.log('Battle cancelled:', data?.reason || 'Unknown reason');
            resetMatchmaking();
        });

        newSocket.on('error', (error) => {
            console.error('Matchmaking error:', error);
            resetMatchmaking();
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from battle server');
            resetMatchmaking();
        });

        return () => {
            cleanup();
            newSocket.disconnect();
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

    const resetMatchmaking = useCallback(() => {
        setMatchmakingState(MATCHMAKING_STATES.IDLE);
        setSearchDuration(0);
        setQueuePosition(0);
        setEstimatedWaitTime(0);
        setOpponentData(null);
        setCountdown(COUNTDOWN_DURATION);
        setBattleId(null);
        cleanup();
    }, [cleanup]);

    const startCountdown = useCallback((receivedBattleId) => {
        console.log('startCountdown called with receivedBattleId:', receivedBattleId);
        setCountdown(COUNTDOWN_DURATION);
        setMatchmakingState(MATCHMAKING_STATES.PREPARING);
        
        countdownTimerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownTimerRef.current);
                    redirectTimeoutRef.current = setTimeout(() => {
                        console.log('Attempting navigation with battleId:', receivedBattleId);
                        if (receivedBattleId && receivedBattleId !== 'null' && receivedBattleId !== null) {
                            console.log('Navigating to battle:', receivedBattleId);
                            navigate(`/battle/${receivedBattleId}`);
                        } else {
                            console.error('Invalid battleId for navigation:', receivedBattleId);
                            resetMatchmaking();
                        }
                    }, 500);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [navigate, resetMatchmaking]);

    const startMatchmaking = useCallback(() => {
        if (!socket || !user) return;
        
        setSearchDuration(0);

        const matchmakingData = {
            userId: String(user.username || user.id || ''),
            username: String(user.username || ''),
            skillLevel: Number(user.ELO || user.elo || 1000)
        };
        
        console.log('Sending matchmaking data:', matchmakingData);
        socket.emit('join-matchmaking', matchmakingData);
    }, [socket, user]);

    const cancelMatchmaking = useCallback(() => {
        if (socket) {
            console.log('Leaving matchmaking');
            socket.emit('leave-matchmaking', {}); 
        }
        resetMatchmaking();
    }, [socket, resetMatchmaking]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <Card className="bg-gray-800 border border-gray-700 p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Login Required</h2>
                    <p className="text-gray-400 mb-6">You need to be logged in to participate in code battles.</p>
                    <Button 
                        onClick={() => window.location.href = '/signin'}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Sign In
                    </Button>
                </Card>
            </div>
        );
    }

    const backgroundAnimation = matchmakingState !== MATCHMAKING_STATES.IDLE 
        ? "animate-pulse bg-gradient-to-br from-red-900/10 via-gray-900 to-red-900/10" 
        : "bg-gray-900";

    // if (matchmakingState === MATCHMAKING_STATES.SEARCHING) {
    //     return (
    //         <div className={`fixed inset-0 ${backgroundAnimation} flex items-center justify-center z-50`}>
    //             <div className="text-center space-y-8 max-w-md mx-4">
    //                 <div className="space-y-6">
    //                     <div className="relative">
    //                         <Spinner 
    //                             size="lg" 
    //                             color="danger"
    //                             className="w-16 h-16"
    //                         />
    //                         <div className="absolute inset-0 border-4 border-red-500/20 rounded-full animate-ping"></div>
    //                     </div>
                        
    //                     <div className="space-y-2">
    //                         <h2 className="text-2xl font-bold text-white">Searching for Opponent</h2>
    //                         <p className="text-gray-400">Finding a worthy challenger...</p>
    //                     </div>
    //                 </div>

    //                 <Card className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-6">
    //                     <div className="grid grid-cols-2 gap-4 text-center">
    //                         <div>
    //                             <div className="text-2xl font-bold text-red-400">{formatTime(searchDuration)}</div>
    //                             <div className="text-sm text-gray-400">Search Time</div>
    //                         </div>
    //                         <div>
    //                             <div className="text-2xl font-bold text-blue-400">#{queuePosition}</div>
    //                             <div className="text-sm text-gray-400">Position in Queue</div>
    //                         </div>
    //                     </div>
                        
    //                     {estimatedWaitTime > 0 && (
    //                         <div className="mt-4 pt-4 border-t border-gray-700">
    //                             <div className="text-sm text-gray-400">
    //                                 Estimated wait: ~{Math.ceil(estimatedWaitTime / 60)} minutes
    //                             </div>
    //                         </div>
    //                     )}
    //                 </Card>

    //                 <Button 
    //                     onClick={cancelMatchmaking}
    //                     variant="ghost"
    //                     className="text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500"
    //                 >
    //                     Cancel Search
    //                 </Button>
    //             </div>
    //         </div>
    //     );
    // }

    // if (matchmakingState === MATCHMAKING_STATES.MATCH_FOUND || matchmakingState === MATCHMAKING_STATES.PREPARING) {
    //     return (
    //         <div className="fixed inset-0 bg-gradient-to-br from-red-900/20 via-gray-900 to-red-900/20 flex items-center justify-center z-50">
    //             <div className="text-center space-y-8 max-w-lg mx-4">
    //                 <div className="space-y-4">
    //                     <div className="text-green-400 text-lg font-semibold animate-pulse">
    //                         ⚡ MATCH FOUND!
    //                     </div>
    //                     <h2 className="text-3xl font-bold text-white">Preparing Your Battle</h2>
    //                 </div>

    //                 {opponentData && (
    //                     <Card className="bg-gray-800/90 backdrop-blur-xl border border-red-500/30 p-6">
    //                         <div className="flex items-center justify-center space-x-4">
    //                             <div className="text-center">
    //                                 <Avatar
    //                                     src={user?.profilePicture}
    //                                     name={user?.username?.charAt(0)?.toUpperCase()}
    //                                     size="lg"
    //                                     className="border-2 border-blue-500"
    //                                 />
    //                                 <div className="mt-2 text-sm font-medium text-white">{user?.username}</div>
    //                                 <div className="text-xs text-gray-400">You</div>
    //                             </div>
                                
    //                             <div className="text-red-400 text-2xl font-bold animate-pulse">VS</div>
                                
    //                             <div className="text-center">
    //                                 <Avatar
    //                                     src={opponentData.profilePicture}
    //                                     name={opponentData.username?.charAt(0)?.toUpperCase()}
    //                                     size="lg"
    //                                     className="border-2 border-red-500"
    //                                 />
    //                                 <div className="mt-2 text-sm font-medium text-white">{opponentData.username}</div>
    //                                 <div className="text-xs text-gray-400">Opponent</div>
    //                             </div>
    //                         </div>
    //                     </Card>
    //                 )}

    //                 {matchmakingState === MATCHMAKING_STATES.PREPARING && (
    //                     <div className="space-y-4">
    //                         <div className="text-center">
    //                             <div className={`text-6xl font-bold transition-all duration-300 ${
    //                                 countdown <= 3 ? 'text-red-400 animate-pulse scale-110' : 'text-white'
    //                             }`}>
    //                                 {countdown}
    //                             </div>
    //                             <div className="text-gray-400 mt-2">Starting battle...</div>
    //                         </div>

    //                         <div className="w-full bg-gray-700 rounded-full h-2">
    //                             <div 
    //                                 className="bg-red-500 h-2 rounded-full transition-all duration-1000 ease-linear"
    //                                 style={{ 
    //                                     width: `${((COUNTDOWN_DURATION - countdown) / COUNTDOWN_DURATION) * 100}%` 
    //                                 }}
    //                             ></div>
    //                         </div>
    //                     </div>
    //                 )}

    //                 <div className="text-center">
    //                     <div className="inline-flex items-center space-x-2 bg-gray-800/50 rounded-full px-4 py-2 border border-gray-600">
    //                         <div className={`w-3 h-3 rounded-full ${
    //                             opponentData?.difficulty === 'easy' ? 'bg-green-400' :
    //                             opponentData?.difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
    //                         }`}></div>
    //                         <span className="text-sm text-gray-300">
    //                             {(opponentData?.difficulty || 'UNKNOWN').toUpperCase()} DIFFICULTY
    //                         </span>
    //                         <span className="text-xs text-gray-500">• Randomly Selected</span>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        // <div className="min-h-screen bg-gray-900 text-white p-6">
        //     <div className="max-w-4xl mx-auto">
        //         <div className="text-center mb-12">
        //             <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
        //                 Code Battles
        //             </h1>
        //             <p className="text-gray-400 text-lg max-w-2xl mx-auto">
        //                 Challenge other programmers in real-time coding duels. Battle difficulty is randomly determined for fair matchmaking - may the best coder win!
        //             </p>
        //         </div>

        //         <Card className="bg-gray-800/90 backdrop-blur border border-gray-700 p-6 mb-8">
        //             <div className="flex items-center justify-between">
        //                 <div>
        //                     <h3 className="text-xl font-semibold text-white mb-2">Welcome back, {user.username}!</h3>
        //                     <p className="text-gray-400">Ready to battle? Click below to join the queue and get matched!</p>
        //                 </div>
        //                 <div className="text-center">
        //                     <div className="text-2xl font-bold text-red-400">{user.ELO || 1000}</div>
        //                     <div className="text-sm text-gray-400">ELO Rating</div>
        //                 </div>
        //             </div>
        //         </Card>

        //         <Card className="bg-gray-800/90 backdrop-blur border border-gray-700 p-6 mb-8">
        //             <div className="text-center mb-6">
        //                 <h3 className="text-xl font-semibold text-white mb-2">Problem Difficulty Distribution</h3>
        //                 <p className="text-gray-400">Each battle randomly selects a problem based on these chances</p>
        //             </div>
                    
        //             <div className="grid grid-cols-3 gap-4 mb-6">
        //                 <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
        //                     <div className="text-2xl font-bold text-green-400 mb-1">25%</div>
        //                     <div className="text-sm text-green-300">Easy</div>
        //                     <div className="text-xs text-gray-400 mt-1">Basic algorithms</div>
        //                 </div>
        //                 <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
        //                     <div className="text-2xl font-bold text-yellow-400 mb-1">50%</div>
        //                     <div className="text-sm text-yellow-300">Medium</div>
        //                     <div className="text-xs text-gray-400 mt-1">Most common</div>
        //                 </div>
        //                 <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
        //                     <div className="text-2xl font-bold text-red-400 mb-1">25%</div>
        //                     <div className="text-sm text-red-300">Hard</div>
        //                     <div className="text-xs text-gray-400 mt-1">Expert challenges</div>
        //                 </div>
        //             </div>

        //             <Button 
        //                 onClick={startMatchmaking}
        //                 className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-lg py-4 transition-all duration-300"
        //                 size="lg"
        //             >
        //                 Find Battle
        //             </Button>
        //         </Card>

        //         <div className="grid md:grid-cols-2 gap-6 mb-8">
        //             <Card className="bg-gray-800/50 border border-gray-700 p-6">
        //                 <h4 className="text-lg font-semibold text-white mb-3">How It Works</h4>
        //                 <ul className="space-y-2 text-gray-400 text-sm">
        //                     <li className="flex items-start space-x-2">
        //                         <span className="text-red-400 mt-1">•</span>
        //                         <span>Choose your difficulty level</span>
        //                     </li>
        //                     <li className="flex items-start space-x-2">
        //                         <span className="text-red-400 mt-1">•</span>
        //                         <span>Get matched with a player of similar skill</span>
        //                     </li>
        //                     <li className="flex items-start space-x-2">
        //                         <span className="text-red-400 mt-1">•</span>
        //                         <span>Solve the same problem simultaneously</span>
        //                     </li>
        //                     <li className="flex items-start space-x-2">
        //                         <span className="text-red-400 mt-1">•</span>
        //                         <span>First to pass all test cases wins!</span>
        //                     </li>
        //                 </ul>
        //             </Card>

        //             <Card className="bg-gray-800/50 border border-gray-700 p-6">
        //                 <h4 className="text-lg font-semibold text-white mb-3">Battle Stats</h4>
        //                 <div className="space-y-3">
        //                     <div className="flex justify-between items-center">
        //                         <span className="text-gray-400 text-sm">Battles Won</span>
        //                         <span className="text-green-400 font-semibold">{user.battlesWon || 0}</span>
        //                     </div>
        //                     <div className="flex justify-between items-center">
        //                         <span className="text-gray-400 text-sm">Total Battles</span>
        //                         <span className="text-white font-semibold">{user.totalBattles || 0}</span>
        //                     </div>
        //                     <div className="flex justify-between items-center">
        //                         <span className="text-gray-400 text-sm">Win Rate</span>
        //                         <span className="text-red-400 font-semibold">
        //                             {user.totalBattles ? Math.round((user.battlesWon || 0) / user.totalBattles * 100) : 0}%
        //                         </span>
        //                     </div>
        //                 </div>
        //             </Card>
        //         </div>

        //         {queueStats && (
        //             <Card className="bg-gray-800/50 border border-gray-700 p-6 mb-8">
        //                 <h4 className="text-lg font-semibold text-white mb-4">Live Queue Statistics</h4>
        //                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        //                     <div className="text-center">
        //                         <div className="text-2xl font-bold text-blue-400">{queueStats.inQueue || 0}</div>
        //                         <div className="text-sm text-gray-400">Players in Queue</div>
        //                     </div>
        //                     <div className="text-center">
        //                         <div className="text-2xl font-bold text-green-400">{queueStats.activeBattles || 0}</div>
        //                         <div className="text-sm text-gray-400">Active Battles</div>
        //                     </div>
        //                     <div className="text-center">
        //                         <div className="text-2xl font-bold text-purple-400">{Math.round(((queueStats.inQueue || 0) + (queueStats.activeBattles || 0) * 2) / 60 * 100) / 100}</div>
        //                         <div className="text-sm text-gray-400">Players/Min</div>
        //                     </div>
        //                 </div>
                        
        //                 <div className="mt-4 pt-4 border-t border-gray-700">
        //                     <div className="text-sm text-gray-400 text-center">
        //                         Next battle difficulty will be randomly selected based on the probability distribution above
        //                     </div>
        //                 </div>
        //             </Card>
        //         )}

        //         {activeBattles.length > 0 && (
        //             <Card className="bg-gray-800/50 border border-gray-700 p-6">
        //                 <h4 className="text-lg font-semibold text-white mb-4">Active Battles ({activeBattles.length})</h4>
        //                 <div className="space-y-4">
        //                     {activeBattles.map((battle, index) => (
        //                         <div key={battle.battleId || index} className="bg-gray-700/50 rounded p-4">
        //                             <div className="flex justify-between items-start">
        //                                 <div>
        //                                     <div className="font-semibold text-white">
        //                                         {battle.players?.map(p => p.username).join(' vs ') || 'Battle in Progress'}
        //                                     </div>
        //                                     <div className="text-sm text-gray-400">
        //                                         Difficulty: {battle.difficulty} | Status: {battle.status}
        //                                     </div>
        //                                 </div>
        //                                 <div className="text-right">
        //                                     {battle.timeRemaining && (
        //                                         <div className="text-sm text-blue-400">
        //                                             {Math.floor(battle.timeRemaining / 60000)}:
        //                                             {String(Math.floor((battle.timeRemaining % 60000) / 1000)).padStart(2, '0')} remaining
        //                                         </div>
        //                                     )}
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     ))}
        //                 </div>
        //             </Card>
        //         )}
        //     </div>
        // </div>
        <div className="p-12 text-3xl">
            Section still under construction...!
        </div>
    );
};

export default CodeBattles;