import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { FaBook, FaCheck, FaCheckCircle, FaClock, FaMemory, FaTag, FaUser, FaChevronDown, FaPlay, FaStop, FaCloud, FaEye, FaEyeSlash, FaBolt, FaTrophy, FaFire } from "react-icons/fa";
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from "@codemirror/lang-cpp";
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import React from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Avatar, Card, CardBody, Progress } from "@heroui/react";
import io from 'socket.io-client';
import { useAuthContext } from "../Hooks/useAuthContext";

const BattlePage = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { battleId } = useParams();
    
    const [battleData, setBattleData] = useState(null);
    const [problem, setProblem] = useState(null);
    const [opponent, setOpponent] = useState(null);
    const [battleStatus, setBattleStatus] = useState('waiting');
    const [battleTimer, setBattleTimer] = useState(0);
    const [maxBattleTime] = useState(1800);
    const [myProgress, setMyProgress] = useState({ score: 0, passedTests: 0, totalTests: 0, submissions: 0 });
    const [opponentProgress, setOpponentProgress] = useState({ score: 0, passedTests: 0, totalTests: 0, submissions: 0 });

    const [showOpponentView, setShowOpponentView] = useState(false);
    const [activePage, setActivePage] = useState('description');
    
    const [value, setValue] = useState(`// Online C++ Compiler, © 2025 InfoBase. All rights reserved. \n#include <iostream>

using namespace std;
                        
int main(){
  cout<<"Hello World";
                    
  return 0;
}`);
    const [language, setLanguage] = useState('C++');
    const [opponentCode, setOpponentCode] = useState('');
    const [opponentLanguage, setOpponentLanguage] = useState('C++');
    
    const [output, setOutput] = useState('');
    const [currentInput, setCurrentInput] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);
    const [socket, setSocket] = useState(null);
    const [waitingForInput, setWaitingForInput] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResults, setSubmitResults] = useState(null);
    const [showSubmitResults, setShowSubmitResults] = useState(false);
    
    const outputRef = useRef(null);
    const isRunningRef = useRef(false);

    const onChange = React.useCallback((val, viewUpdate) => {
        setValue(val);
        if (socket && battleStatus === 'active') {
            socket.emit('code-update', {
                battleId,
                code: val,
                language
            });
        }
    }, [socket, battleId, battleStatus, language]);

    const languageSetter = (lang) => {
        switch(lang){
            case 'C++':
                setLanguage('C++');
                setValue(`// Online C++ Compiler, © 2025 InfoBase. All rights reserved. \n#include <iostream>

using namespace std;
                        
int main(){
  cout<<"Hello World";
                    
  return 0;
}`);
                break;
            case 'Java':
                setLanguage('Java');
                setValue(`// Online Java Compiler, © 2025 InfoBase. All rights reserved. \nimport java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World");
    }
}`);
                break;
            case 'Python':
                setLanguage('Python');
                setValue(`# Online Python Compiler, © 2025 InfoBase. All rights reserved. \nprint("Hello, World")
`);
                break;
            default:
                setValue(`// Online C++ Compiler, © 2025 InfoBase. All rights reserved. \n#include <iostream>

using namespace std;
                        
int main(){
  cout<<"Hello World";
                    
  return 0;
}`);
                setLanguage('C++');
        }

        if (socket && battleStatus === 'active') {
            socket.emit('code-update', {
                battleId,
                code: value,
                language: lang
            });
        }
    };

    const getLanguage = () => {
        switch(language){
            case 'C++':
                return [cpp()];
            case 'Java':
                return [java()];
            case 'Python':
                return [python()];
            default:
                return [cpp()];
        }
    };

    const getOpponentLanguage = () => {
        switch(opponentLanguage){
            case 'C++':
                return [cpp()];
            case 'Java':
                return [java()];
            case 'Python':
                return [python()];
            default:
                return [cpp()];
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch(difficulty?.toLowerCase()) {
            case 'easy':
                return 'bg-green-500/20 text-green-400 border border-green-500/30';
            case 'medium':
                return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
            case 'hard':
                return 'bg-red-500/20 text-red-400 border border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
        }
    };

    useEffect(() => {
        if (!battleId) {
            console.error('No battle ID provided');
            navigate('/code-battles');
            return;
        }

        const newSocket = io(`${process.env.REACT_APP_API_SOCKET}`);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket server');
            console.log('Attempting to join battle with ID:', battleId);
            console.log('User data:', { 
                battleId,
                userId: user?.username || 'anonymous',
                username: user?.username || 'Anonymous'
            });
            
            newSocket.emit('join-battle', {
                battleId,
                userId: user?.username || 'anonymous',
                username: user?.username || 'Anonymous'
            });
        });

        newSocket.on('battle-joined', (data) => {
            console.log('Battle joined:', data);
            setBattleData(data.battle);
            setProblem(data.problem);
            setOpponent(data.opponent);
            setBattleStatus(data.battle.status);
            
            setTimeout(() => {
                newSocket.emit('set-ready', { ready: true });
                console.log('Player marked as ready');
            }, 1000);
        });

        newSocket.on('battle-error', (data) => {
            console.error('Battle error:', data.message);
            alert('Battle error: ' + data.message);
            navigate('/code-battles');
        });

        newSocket.on('battle-started', (data) => {
            console.log('Battle started:', data);
            setBattleStatus('active');
            setBattleTimer(0);
            setProblem(data.problem);
        });

        newSocket.on('opponent-code-update', (data) => {
            setOpponentCode(data.code);
            setOpponentLanguage(data.language);
        });

        newSocket.on('opponent-progress-update', (data) => {
            setOpponentProgress(data.progress);
        });

        newSocket.on('battle-finished', (data) => {
            console.log('Battle finished:', data);
            setBattleStatus('finished');
        });

        newSocket.on('compilation-error', (data) => {
            console.log('Compilation Error:', data.error);
            setOutput(`❌ Compilation Error:\n${data.error}\n\n`);
            setIsCompiling(false);
            setIsRunning(false);
            setWaitingForInput(false);
        });

        newSocket.on('program-started', (data) => {
            console.log('Program started:', data);
            setIsCompiling(false);
            setIsRunning(true);

            setTimeout(() => {
                setWaitingForInput(currentWaiting => {
                    if (!currentWaiting && isRunningRef.current) {
                        console.log('Quick auto-detection: Program likely waiting for input');
                        setTimeout(() => outputRef.current?.focus(), 50);
                        return true;
                    }
                    return currentWaiting;
                });
            }, 300);

            setTimeout(() => {
                setWaitingForInput(currentWaiting => {
                    if (!currentWaiting && isRunningRef.current) {
                        console.log('Fallback auto-detection: Program waiting for input');
                        setTimeout(() => outputRef.current?.focus(), 100);
                        return true;
                    }
                    return currentWaiting;
                });
            }, 1500);
        });

        newSocket.on('program-output', (data) => {
            console.log('Program output:', data);
            setOutput(prev => prev + data.output);

            const needsInput = data.output.includes(':') ||
                            data.output.includes('?') ||
                            data.output.includes('Enter') ||
                            data.output.includes('Input') ||
                            (data.output.endsWith(' ') && !data.output.endsWith('\n'));

            if (needsInput) {
                setWaitingForInput(true);
                setTimeout(() => outputRef.current?.focus(), 100);
            }
        });

        newSocket.on('program-error', (data) => {
            console.log('Program error:', data);
            setOutput(`⚠️ Runtime Error: ${data.error}\n`);
        });

        newSocket.on('program-finished', (data) => {
            console.log('Program finished:', data);
            setOutput(prev => prev + `\nexit code: ${data.exitCode}\n`);
            setIsRunning(false);
            setSessionId(null);
            setWaitingForInput(false);
        });

        newSocket.on('error', (error) => {
            console.log('WebSocket error:', error);
            setOutput(`❌ Connection error: ${error.message}\n`);
        });

        return () => newSocket.close();
    }, [battleId, user?.username]);

    useEffect(() => {
        let timer;
        if (battleStatus === 'active') {
            timer = setInterval(() => {
                setBattleTimer(prev => {
                    if (prev >= maxBattleTime) {
                        setBattleStatus('finished');
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [battleStatus, maxBattleTime]);

    useEffect(() => {
        isRunningRef.current = isRunning;
    }, [isRunning]);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    const handleSubmitCode = async () => {
        if (!value.trim()) {
            alert('Please enter some code first!');
            return;
        }

        setIsSubmitting(true);
        setSubmitResults(null);
        setShowSubmitResults(false);

        try {
            const response = await fetch(`${process.env.REACT_APP_API}/compiler/submitCode`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: value,
                    language: language,
                    problemId: problem?.uniqueId,
                    username: user.username,
                    battleId: battleId
                })
            });

            const json = await response.json();

            if (!response.ok) {
                console.log(json.error);
                setIsSubmitting(false);
                return;
            }

            if (response.ok) {
                setSubmitResults(json);
                setShowSubmitResults(true);

                const newProgress = {
                    score: json.score || 0,
                    passedTests: json.passedTests || 0,
                    totalTests: json.totalTests || 0,
                    submissions: myProgress.submissions + 1
                };
                setMyProgress(newProgress);

                if (socket) {
                    socket.emit('progress-update', {
                        battleId,
                        progress: newProgress
                    });
                }

                if (json.score >= 100) {
                    socket.emit('battle-win', { battleId });
                }
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert(`Network Error: ${error.message}`);
        }

        setIsSubmitting(false);
    };

    const handleRunCode = async () => {
        if (!value.trim()) {
            setOutput('Invalid code input\n\n');
            return;
        }

        if (!user?.username) {
            setOutput('❌ Error: User not authenticated. Please log in.\n\n');
            return;
        }

        setOutput('Compiling...\n');
        setIsCompiling(true);
        setIsRunning(false);
        setWaitingForInput(false);

        try {
            const response = await fetch(`${process.env.REACT_APP_API}/compiler/runCode`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: value,
                    language: language,
                    userId: user?.username
                })
            });

            const json = await response.json();

            if (!response.ok) {
                setOutput(prev => prev + `❌ Error: ${json.error}\n\n`);
                setIsCompiling(false);
                return;
            }

            if (response.ok) {
                setSessionId(json.sessionId);
                console.log('Session ID set:', json.sessionId);
            }
        } catch (error) {
            console.error('Network error:', error);
            setOutput(prev => prev + `❌ Network Error: ${error.message}\n\n`);
            setIsCompiling(false);
        }
    };

    const handleTerminalKeyDown = (e) => {
        if (!waitingForInput) return;
        
        e.preventDefault();

        if (e.key === 'Enter') {
            if (currentInput.trim()) {
                if (socket && sessionId) {
                    socket.emit('send-input', {
                        sessionId,
                        input: currentInput.trim()
                    });
                    setOutput(prev => prev + currentInput + '\n');
                    setCurrentInput('');
                    setWaitingForInput(false);
                }
            }
        } else if (e.key === 'Backspace') {
            setCurrentInput(prev => prev.slice(0, -1));
        } else if (e.key.length === 1) {
            setCurrentInput(prev => prev + e.key);
        }
    };

    const clearOutput = () => {
        setOutput('');
        setCurrentInput('');
        setWaitingForInput(false);
    };

    const terminateProgram = () => {
        if (socket && sessionId) {
            socket.emit('terminate-process', { sessionId });
            setOutput(prev => prev + '\n🛑 Program terminated by user.\n\n');
            setIsRunning(false);
            setSessionId(null);
            setWaitingForInput(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getProgressColor = (score) => {
        if (score >= 100) return 'success';
        if (score >= 50) return 'warning';
        return 'danger';
    };

    if (!battleData || !problem) {
        return (
            <div className="flex items-center justify-center min-h-[70vh] bg-light">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400 mb-2">Loading battle...</p>
                    <p className="text-sm text-gray-500">Battle ID: {battleId}</p>
                    {battleData && !problem && (
                        <p className="text-sm text-yellow-400 mt-2">Waiting for problem to load...</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col max-lg:p-1 max-sm:p-2 lg:p-2 max-lg:gap-1 max-sm:gap-2 lg:gap-2">
            <Card className="bg-[#262626] border border-[#333333]">
                <CardBody className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <FaBolt className="text-red-500 text-xl" />
                                <h1 className="text-xl font-bold text-white">Battle Arena</h1>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <FaClock />
                                <span className="font-mono text-lg">
                                    {formatTime(battleTimer)} / {formatTime(maxBattleTime)}
                                </span>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                battleStatus === 'waiting' ? 'bg-yellow-500/20 text-yellow-400' :
                                battleStatus === 'active' ? 'bg-green-500/20 text-green-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>
                                {battleStatus.toUpperCase()}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Avatar
                                    showFallback
                                    name={user?.username?.charAt(0).toUpperCase() || '?'}
                                    size="sm"
                                    className="border-2 border-blue-500"
                                />
                                <div className="text-center">
                                    <div className="text-blue-400 font-bold">{myProgress.score}</div>
                                    <div className="text-xs text-gray-400">You</div>
                                </div>
                            </div>
                            
                            <div className="text-gray-400 text-lg">VS</div>
                            
                            <div className="flex items-center gap-3">
                                <div className="text-center">
                                    <div className="text-red-400 font-bold">{opponentProgress.score}</div>
                                    <div className="text-xs text-gray-400">{opponent?.username || 'Opponent'}</div>
                                </div>
                                <Avatar
                                    showFallback
                                    name={opponent?.username?.charAt(0).toUpperCase() || '?'}
                                    size="sm"
                                    className="border-2 border-red-500"
                                />
                            </div>

                            <Button
                                size="sm"
                                onClick={() => setShowOpponentView(!showOpponentView)}
                                className={`${showOpponentView ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
                                startContent={showOpponentView ? <FaEyeSlash /> : <FaEye />}
                            >
                                {showOpponentView ? 'Hide' : 'View'} Opponent
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <div className="flex flex-col lg:flex-row lg:gap-2 max-lg:gap-1">
                <div className="w-full max-lg:h-[40vh] lg:w-1/2 bg-[#262626] text-white lg:min-h-[calc(100vh-200px)] rounded-lg border-1 border-[#333333]">
                    <div className="bg-[#333333] max-lg:p-1 max-sm:p-2 lg:p-2 rounded-t-lg flex flex-row max-lg:gap-1 lg:gap-1 max-lg:overflow-x-auto">
                        <div className={`flex flex-row max-lg:gap-1 max-sm:gap-2 lg:gap-2 items-center max-lg:px-2 max-sm:px-3 lg:px-3 max-lg:py-1 max-sm:py-2 lg:py-2 rounded cursor-pointer transition-all duration-200 hover:bg-[#404040] max-lg:whitespace-nowrap ${
                            activePage === 'description' 
                                ? 'bg-[#404040] border-b-2 border-blue-500 text-blue-400' 
                                : 'text-gray-300 hover:text-white'
                        }`}
                            onClick={() => setActivePage('description')}
                        >
                            <FaBook className={`max-lg:text-sm max-sm:text-lg lg:text-lg ${
                                activePage === 'description' ? 'text-blue-400' : 'text-orange-400'
                            }`}/>
                            <span className="font-medium max-lg:text-sm max-sm:text-base lg:text-base">Problem</span>
                        </div>
                    </div>
                    <div className="max-lg:p-2 max-sm:p-4 lg:p-4 overflow-y-auto max-lg:h-[calc(40vh-60px)] lg:max-h-[calc(100vh-260px)]">
                        <div className="max-lg:space-y-4 max-sm:space-y-6 lg:space-y-6">
                            <div className="max-lg:space-y-3 max-sm:space-y-4 lg:space-y-4">
                                <div className="flex max-lg:flex-col max-sm:flex-row max-lg:items-start max-sm:items-center lg:items-center max-lg:justify-start max-sm:justify-between lg:justify-between max-lg:gap-2 lg:gap-0">
                                    <h1 className="max-lg:text-xl max-sm:text-2xl lg:text-2xl font-bold text-white">{problem.title}</h1>
                                    <span className={`px-2 max-sm:px-3 lg:px-3 py-1 rounded-full text-xs font-medium max-lg:self-start lg:self-auto ${getDifficultyColor(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </span>
                                </div>
                            </div>

                            <div className="max-lg:space-y-3 max-sm:space-y-4 lg:space-y-4">
                                <h2 className="max-lg:text-base max-sm:text-lg lg:text-lg font-semibold text-white border-b border-gray-600 pb-2">Descriere</h2>
                                <p className="max-lg:text-sm max-sm:text-base lg:text-base text-gray-300 leading-relaxed whitespace-pre-wrap">{problem.description}</p>
                            </div>

                            <div className="max-lg:space-y-3 max-sm:space-y-4 lg:space-y-4">
                                <h2 className="max-lg:text-base max-sm:text-lg lg:text-lg font-semibold text-white border-b border-gray-600 pb-2">Cerința</h2>
                                <p className="max-lg:text-sm max-sm:text-base lg:text-base text-gray-300 leading-relaxed whitespace-pre-wrap">{problem.cerinta}</p>
                            </div>

                            <div className="grid grid-cols-1 max-lg:grid-cols-1 lg:grid-cols-2 max-lg:gap-3 max-sm:gap-4 lg:gap-4">
                                <div className="space-y-2">
                                    <h3 className="max-lg:text-sm max-sm:text-md lg:text-md font-semibold text-white">Date de intrare</h3>
                                    <div className="bg-[#1a1a1a] max-lg:p-2 max-sm:p-3 lg:p-3 rounded border border-gray-700">
                                        <p className="max-lg:text-xs max-sm:text-sm lg:text-sm text-gray-300 whitespace-pre-wrap">{problem.DateDeIntrare}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="max-lg:text-sm max-sm:text-md lg:text-md font-semibold text-white">Date de ieșire</h3>
                                    <div className="bg-[#1a1a1a] max-lg:p-2 max-sm:p-3 lg:p-3 rounded border border-gray-700">
                                        <p className="max-lg:text-xs max-sm:text-sm lg:text-sm text-gray-300 whitespace-pre-wrap">{problem.DateDeIesire}</p>
                                    </div>
                                </div>
                            </div>

                            {problem.Exemple && problem.Exemple.length > 0 && (
                                <div className="max-lg:space-y-3 max-sm:space-y-4 lg:space-y-4">
                                    <h2 className="max-lg:text-base max-sm:text-lg lg:text-lg font-semibold text-white border-b border-gray-600 pb-2">Exemple</h2>
                                    {problem.Exemple.map((example, index) => (
                                        <div key={index} className="max-lg:space-y-2 max-sm:space-y-3 lg:space-y-3">
                                            <h4 className="max-lg:text-sm max-sm:text-md lg:text-md font-medium text-gray-300">Exemplul {index + 1}</h4>
                                            <div className="grid grid-cols-1 max-lg:grid-cols-1 lg:grid-cols-2 max-lg:gap-3 max-sm:gap-4 lg:gap-4">
                                                <div>
                                                    <h5 className="max-lg:text-xs max-sm:text-sm lg:text-sm font-medium text-gray-400 mb-2">Input:</h5>
                                                    <div className="bg-[#1a1a1a] max-lg:p-2 max-sm:p-3 lg:p-3 rounded border border-gray-700">
                                                        <pre className="text-green-400 max-lg:text-xs max-sm:text-sm lg:text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                                                            {example.input || example.intrare}
                                                        </pre>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h5 className="max-lg:text-xs max-sm:text-sm lg:text-sm font-medium text-gray-400 mb-2">Output:</h5>
                                                    <div className="bg-[#1a1a1a] max-lg:p-2 max-sm:p-3 lg:p-3 rounded border border-gray-700">
                                                        <pre className="text-blue-400 max-lg:text-xs max-sm:text-sm lg:text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                                                            {example.output || example.iesire}
                                                        </pre>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-full max-lg:h-[50vh] lg:w-1/2 bg-[#262626] text-white lg:h-[calc(100vh-200px)] rounded-lg border-1 border-[#333333] flex flex-col">
                    <div className="max-lg:p-1 max-sm:p-2 lg:p-2 bg-[#333333] rounded-t-lg flex-shrink-0 relative flex max-lg:flex-col max-sm:flex-row lg:flex-row max-lg:justify-between lg:justify-between max-lg:gap-2 lg:gap-0">
                        <div className="flex items-center gap-2">
                            <Dropdown placement="bottom-start">
                                <DropdownTrigger>
                                    <Button 
                                        variant="light" 
                                        className="text-gray-300 hover:bg-[#404040] max-lg:p-1 max-sm:p-2 lg:p-2 min-w-0 max-lg:text-sm lg:text-base"
                                    >
                                        {language} <FaChevronDown size="0.75em"/>
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu 
                                    aria-label="Language Selection"
                                    onAction={(key) => languageSetter(key)}
                                >
                                    <DropdownItem key="C++">C++</DropdownItem>
                                    <DropdownItem key="Java">Java</DropdownItem>
                                    <DropdownItem key="Python">Python</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            
                            {showOpponentView && (
                                <div className="text-xs text-gray-400 bg-red-500/20 px-2 py-1 rounded">
                                    Viewing: {opponent?.username || 'Opponent'} ({opponentLanguage})
                                </div>
                            )}
                        </div>
                        
                        <div className="flex flex-row max-lg:gap-1 lg:gap-1">
                            {isRunning ? (
                                <Button
                                    onClick={terminateProgram}
                                    variant="ghost"
                                    className="bg-red-600 hover:bg-red-700 text-white max-lg:px-2 max-sm:px-3 lg:px-3 max-lg:py-1 max-sm:py-1.5 lg:py-1.5 flex 
                                    items-center justify-center transition-colors duration-200 min-w-0 max-lg:text-sm lg:text-base"
                                >
                                    <FaStop size="0.8em" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleRunCode}
                                    disabled={isCompiling || battleStatus !== 'active'}
                                    variant="ghost"
                                    className="bg-blue-600 hover:bg-blue-700 text-white max-lg:px-2 max-sm:px-3 lg:px-3 max-lg:py-1 max-sm:py-1.5 lg:py-1.5 flex 
                                    items-center justify-center transition-colors duration-200 min-w-0 disabled:bg-gray-500 max-lg:text-sm lg:text-base"
                                >
                                    <FaPlay size="0.8em" />
                                </Button>
                            )}
                            <Button
                                onClick={handleSubmitCode}
                                disabled={isCompiling || isRunning || isSubmitting || battleStatus !== 'active'}
                                variant="ghost"
                                className="bg-green-600 hover:bg-green-700 text-white max-lg:px-2 max-sm:px-4 lg:px-4 max-lg:py-1 max-sm:py-2 lg:py-2 flex items-center max-lg:gap-1 max-sm:gap-2 lg:gap-2 transition-colors duration-200 disabled:bg-gray-500 max-lg:text-sm lg:text-base"
                            >
                                <FaCloud size="0.9em" />
                                <span className="font-medium max-lg:hidden max-sm:inline lg:inline">
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </span>
                            </Button>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-hidden relative min-h-0">
                        <CodeMirror
                            value={showOpponentView ? opponentCode : value} 
                            height="calc(100vh - 200px - 60px - 203px)"
                            width="100%"
                            extensions={showOpponentView ? getOpponentLanguage() : getLanguage()}
                            onChange={showOpponentView ? undefined : onChange}
                            theme={vscodeDark}
                            editable={!showOpponentView && !isRunning && !isCompiling && battleStatus === 'active'}
                            basicSetup={{
                                ...CodeMirror.defaultProps?.basicSetup,
                                highlightActiveLine: !showOpponentView && !isRunning && !isCompiling,
                                highlightActiveLineGutter: !showOpponentView && !isRunning && !isCompiling
                            }}
                        />
                        {(isRunning || isCompiling || showOpponentView) && (
                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center pointer-events-none">
                                <div className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 flex items-center gap-2">
                                    {showOpponentView ? (
                                        <>
                                            <FaEye className="text-red-400" />
                                            <span>Viewing opponent's code</span>
                                        </>
                                    ) : (isCompiling || isRunning) && (
                                        <>
                                            <div className="animate-spin w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="max-lg:h-32 max-sm:h-52 lg:h-52 bg-[#151515] rounded-b-lg border-t-2 border-[#30363d] flex-shrink-0 flex flex-col">
                        <div className="flex justify-between items-center max-lg:p-1 max-sm:p-2 lg:p-2 border-b border-[#30363d]">
                            <span className="text-gray-300 font-medium max-lg:text-sm lg:text-base">Console</span>
                            <span
                                onClick={clearOutput}
                                variant="ghost"
                                className="bg-gray-600 hover:bg-gray-700 text-white max-lg:px-2 max-sm:px-3 lg:px-3 py-0.5 flex rounded-lg cursor-pointer
                                items-center justify-center transition-colors duration-200 min-w-0 max-lg:text-sm lg:text-base"
                            >
                                Clear
                            </span>
                        </div>
                        <div 
                            className="flex-1 relative cursor-text"
                            onClick={() => waitingForInput && outputRef.current?.focus()}
                        >
                            <div
                                ref={outputRef}
                                className="absolute inset-0 max-lg:p-1 max-sm:p-2 lg:p-2 text-green-400 font-mono max-lg:text-xs max-sm:text-sm lg:text-sm overflow-auto whitespace-pre-wrap outline-none"
                                tabIndex={waitingForInput ? 0 : -1}
                                onKeyDown={handleTerminalKeyDown}
                            >
                                {output}
                                {waitingForInput && (
                                    <span className="inline-flex items-baseline">
                                        <span className="text-green-400">{currentInput}</span>
                                        <span className="animate-pulse bg-green-400 w-0.5 max-lg:h-3 max-sm:h-4 lg:h-4 ml-0.5 inline-block">█</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BattlePage;