import { Link, useParams } from "react-router-dom";
import { useGetProblem } from "../Hooks/useGetProblem";
import NotFound from "./NotFound";
import { FaBook, FaCheck, FaCheckCircle, FaQuestion, FaClock, FaMemory, FaTag, FaUser, FaChevronLeft, FaChevronRight,
    FaCalendar, FaArrowDown, FaChevronDown, FaRegCopy, FaCloud, FaPlaystation, FaPlay, FaStop, FaCoins } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from "@codemirror/lang-cpp";
import {java} from '@codemirror/lang-java';
import {python} from '@codemirror/lang-python';
import {vscodeDark} from '@uiw/codemirror-theme-vscode'
import React from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Avatar } from "@heroui/react";
import io from 'socket.io-client';
import { useAuthContext } from "../Hooks/useAuthContext";

const ProblemPage = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const { getProblem, refetchProblem, error, isLoading, problem } = useGetProblem(uniqueId);
    const [activePage, setActivePage] = useState('description');
    
    const [value, setValue] = useState(`// Online C++ Compiler, © 2025 InfoBase. All rights reserved. \n#include <iostream>

using namespace std;
                        
int main(){
  cout<<"Hello World";
                    
  return 0;
}`);
    const [language, setLanguage] = useState('C++');

    const onChange = React.useCallback((val, viewUpdate) => {
        setValue(val);
    }, []);

    const languageSetter = (lang) =>{
        switch(lang){
            case 'C++':
                setLanguage('C++');
                setValue(`// Online C++ Compiler, © 2025 InfoBase. All rights reserved. \n#include <iostream>

using namespace std;
                        
int main(){
  cout<<"Hello World";
                    
  return 0;
}`)
                break;
            case 'Java':
                setLanguage('Java');
                setValue(`// Online Java Compiler, © 2025 InfoBase. All rights reserved. \nimport java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World");
    }
}`)
                break;
            case 'Python':
                setLanguage('Python');
                setValue(`# Online Python Compiler, © 2025 InfoBase. All rights reserved. \nprint("Hello, World")
`)
                break;
            default:
                setValue(`// Online C++ Compiler, © 2025 InfoBase. All rights reserved. \n#include <iostream>

using namespace std;
                        
int main(){
  cout<<"Hello World";
                    
  return 0;
}`)
                setLanguage('C++');
        }
    }

    const getLanguage = () =>{
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
    }

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

    const [output, setOutput] = useState(''); 
    const [currentInput, setCurrentInput] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);
    const [socket, setSocket] = useState(null);
    const [waitingForInput, setWaitingForInput] = useState(false);
    const outputRef = useRef(null);
    const inputRef = useRef(null);  //variable pentru compiler, asincron cu backendu
    const isRunningRef = useRef(false); // ref pentru a urmari starea isRunning fara closure issues

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResults, setSubmitResults] = useState(null);
    const [showSubmitResults, setShowSubmitResults] = useState(false);

    useEffect(() =>{
        const newSocket = io(`${process.env.REACT_APP_API_SOCKET || 'http://localhost:4000'}`); // conectare la socketu de la backend
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket server');
            // Associate user with socket connection if logged in
            if (user?.username) {
                newSocket.emit('associate-user', { userId: user.username });
                console.log('User associated with socket:', user.username);
            } else {
                // For anonymous users, create a temporary ID based on socket ID
                const anonymousId = 'anon_' + newSocket.id;
                newSocket.emit('associate-user', { userId: anonymousId });
                console.log('Anonymous user connected with ID:', anonymousId);
            }
        })

        newSocket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server'); // setOutput la deconectare
        })

        newSocket.on('compilation-error', (data) =>{
            console.log('Compilation Error:', data.error); //afisam eroarea primita de la index.js si executeFile.js
            setOutput(`❌ Compilation Error:\n${data.error}\n\n`);
            setIsCompiling(false);
            setIsRunning(false);
            setWaitingForInput(false);
        })

        newSocket.on('program-started', (data) =>{
            console.log('Program started:', data);

            setIsCompiling(false);
            setIsRunning(true); //activam statusu de running

            setTimeout(() =>{ // incercari automate de detectare a inputului, daca programul cere input
                setWaitingForInput(currentWaiting => { // setam waitingForInput pe true daca programul cere input
                    if(!currentWaiting && isRunningRef.current){ // verifica daca programul inca ruleaza
                        console.log('Quick auto-detection: Program likely waiting for input');
                        setTimeout(() => outputRef.current?.focus(), 50); // focus la output dupa 50ms
                        return true;
                    }
                    return currentWaiting;
                })
            }, 300)

            setTimeout(() =>{ // incercari automate de detectare a inputului, daca programul cere input
                setWaitingForInput(currentWaiting => {
                    if(!currentWaiting && isRunningRef.current){ // verifica daca programul inca ruleaza
                        console.log('Fallback auto-detection: Program waiting for input');
                        setTimeout(() => outputRef.current?.focus(), 100); // focus la output dupa 100ms
                        return true;
                    }
                    return currentWaiting;
                })
            }, 1500)
        });

        newSocket.on('program-output', (data) =>{
            console.log('Program output:', data);
            setOutput(prev=> prev + data.output); // adaugam outputu la ce era deja in output

            const needsInput = data.output.includes(':') || // cautam semne pt detectarea de input
                            data.output.includes('?') || 
                            data.output.includes('Enter') ||
                            data.output.includes('Input') ||
                            (data.output.endsWith(' ') && !data.output.endsWith('\n'));

            if (needsInput) {
                setWaitingForInput(true);
                setTimeout(() => outputRef.current?.focus(), 100); // focus la output dupa 100ms
            }
        });

        newSocket.on('program-error', (data) => { // runtime error
            console.log('Program error:', data);
            setOutput(`⚠️ Runtime Error: ${data.error}\n`); // adaugam eroarea la output
        });

        newSocket.on('program-finished', (data) => {
            console.log('Program finished:', data);
            setOutput(prev => prev + `\nexit code: ${data.exitCode}\n`); // adaugam la output ca programu s-a terminat
            setIsRunning(false); // dezactivam statusu de running
            setSessionId(null); // resetam sessionId
            setWaitingForInput(false); // dezactivam asteptarea de input
        });

        newSocket.on('error', (error) => { // eroare la websocket
            console.log('WebSocket error:', error);
            setOutput(`❌ Connection error: ${error.message}\n`); // adaugam eroarea la output
        });

        return () => newSocket.close();
    }, [user?.username]); // Re-run when user changes

    // Actualizeaza ref-ul cand se schimba isRunning
    useEffect(() => {
        isRunningRef.current = isRunning;
    }, [isRunning]);

    useEffect(() => { // scroll la top output cand se schimba
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    const [submissions, setSubmissions] = useState([]);

    const getSubmissions = async () =>{
        if(!user) return;

        const response = await fetch(`${process.env.REACT_APP_API}/problems/getSubmissions?username=${user.username}&problemId=${uniqueId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const json = await response.json();

        if(!response.ok){
            console.log(json.error);
        }

        if(response.ok){
            console.log(json.submissions);
            setSubmissions(json.submissions.reverse());
        }
    }

    const [solutions, setSolutions] = useState([]);
    
    // Solutions pagination state
    const [solutionsCurrentPage, setSolutionsCurrentPage] = useState(1);
    const [solutionsTotalPages, setSolutionsTotalPages] = useState(1);
    const [totalSolutions, setTotalSolutions] = useState(0);
    const solutionsPerPage = 5;

    const getSolutions = async (page = 1) =>{
        if(!user) return;

        const response = await fetch(`${process.env.REACT_APP_API}/problems/getSolutions?problemId=${uniqueId}&page=${page}&limit=${solutionsPerPage}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const json = await response.json();

        if(!response.ok){
            console.log(json.error);
        }

        if(response.ok){
            console.log(json.solutions);
            setSolutions(json.solutions || []);
            // Handle pagination if backend provides it
            if (json.pagination) {
                setSolutionsTotalPages(json.pagination.totalPages);
                setSolutionsCurrentPage(json.pagination.currentPage);
                setTotalSolutions(json.pagination.totalSolutions);
            } else {
                // Fallback for when backend doesn't provide pagination
                setTotalSolutions(json.solutions ? json.solutions.length : 0);
                setSolutionsTotalPages(1);
                setSolutionsCurrentPage(1);
            }
        }
    }

    const handleSubmitCode = async () =>{
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
                    problemId: uniqueId,
                    username: user.username
                })
            });

            const json = await response.json();

            if (!response.ok) {
                console.log(json.error);
                setIsSubmitting(false);
                getSubmissions();
                getSolutions(solutionsCurrentPage);
                return;
            }

            if(response.ok){
                getSubmissions();
                getSolutions(solutionsCurrentPage);
                setSubmitResults(json);
                setShowSubmitResults(true);
            }


        } catch (error) {
            console.error('Submit error:', error);
            alert(`Network Error: ${error.message}`);
        }

        setIsSubmitting(false);
    }

    const handleRunCode = async () =>{
        if (!value.trim()) { // daca nu e cod, afisam in output si nu rulam
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

        try{
            const response = await fetch(`${process.env.REACT_APP_API}/compiler/runCode`, { //apelam ruta din backend pt runCode
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    code: value, 
                    language: language,
                    userId: user?.username // Add userId to request
                })
            });

            const json = await response.json();

            if (!response.ok) { //daca nu e ok semnalu, afisam eroarea in output
                setOutput(prev => prev + `❌ Error: ${json.error}\n\n`);
                setIsCompiling(false);
                return;
            }

            if (response.ok) { // daca e ok semnalu, setam sessionId si afisam in output
                setSessionId(json.sessionId);
                console.log('Session ID set:', json.sessionId);
            }
        }catch(error){
            console.error('Network error:', error);
            setOutput(prev => prev + `❌ Network Error: ${error.message}\n\n`);
            setIsCompiling(false);
        }
    }

    const handleTerminalKeyDown = (e) =>{
        if (!waitingForInput) return; // daca nu asteptam input, nu facem nimic
        
        e.preventDefault();

        if(e.key === 'Enter'){ // trimitem la backend daca utilizatorul apasa enter
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
        }else if (e.key === 'Backspace'){
            setCurrentInput(prev => prev.slice(0, -1));
        }else if (e.key.length === 1){
            setCurrentInput(prev => prev + e.key);
        }
    }

    const clearOutput = () => {
        setOutput('');
        setCurrentInput('');
        setWaitingForInput(false);
    };

    const terminateProgram = () => { // terminam programu daca utilizatorul apasa pe stop
        if (socket && sessionId) {
            socket.emit('terminate-process', { sessionId });
            setOutput(prev => prev + '\n🛑 Program terminated by user.\n\n');
            setIsRunning(false);
            setSessionId(null);
            setWaitingForInput(false);
        }
    };

     const getStatusColor = (status) => {
        switch (status) {
            case 'ACCEPTED':
                return 'text-green-400 bg-green-500/20 border-green-500/30';
            case 'WRONG_ANSWER':
                return 'text-red-400 bg-red-500/20 border-red-500/30';
            case 'TIME_LIMIT_EXCEEDED':
                return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
            case 'COMPILATION_ERROR':
            case 'RUNTIME_ERROR':
            case 'SYSTEM_ERROR':
                return 'text-red-400 bg-red-500/20 border-red-500/30';
            default:
                return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        }
    };

    if(error == "Problem not found!"){
        return (
            <main className="min-h-[70vh] flex flex-col items-center justify-center bg-light p-4 z-30 relative">
            <div className="flex flex-col items-center space-y-4">
                <h1 className="bi bi-link-45deg text-6xl"></h1>
                <h1 className="text-5xl">404</h1>
                <h2 className="text-4xl font-bold text-slate-300">Oops, problem not found.</h2>
                <p className="text-slate-300">
                The problem you are looking for does not exist. It might have been moved or deleted.
                </p>
                <button className="bg-white text-black py-2 px-4 border rounded border-gray-300 hover:bg-gray-200">
                <Link className='no-underline text-black' to="/">
                    Go back home
                </Link>
                </button>
            </div>
            </main>
        );
    }

    return (
        <div className="flex flex-col max-lg:p-1 max-sm:p-2 lg:flex-row lg:p-2 max-lg:gap-1 max-sm:gap-2 lg:gap-2">
            <div className="w-full max-lg:h-[50vh] lg:w-1/2 bg-[#262626] text-white lg:min-h-[calc(100vh-81px)] rounded-lg border-1 border-[#333333]">
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
                        <span className="font-medium max-lg:text-sm max-sm:text-base lg:text-base">Description</span>
                    </div>
                    <div className={`flex flex-row max-lg:gap-1 max-sm:gap-2 lg:gap-2 items-center max-lg:px-2 max-sm:px-3 lg:px-3 max-lg:py-1 max-sm:py-2 lg:py-2 rounded cursor-pointer transition-all duration-200 hover:bg-[#404040] max-lg:whitespace-nowrap ${
                        activePage === 'solutions' 
                            ? 'bg-[#404040] border-b-2 border-green-500 text-green-400' 
                            : 'text-gray-300 hover:text-white'
                    }`}
                        onClick={() => {
                            setActivePage('solutions')
                            setSolutionsCurrentPage(1); // Reset to first page when switching tabs
                            getSolutions(1);
                        }}
                    >
                        <FaQuestion className={`max-lg:text-sm max-sm:text-lg lg:text-lg ${
                            activePage === 'solutions' ? 'text-green-400' : 'text-purple-400'
                        }`}/>
                        <span className="font-medium max-lg:text-sm max-sm:text-base lg:text-base">Solutions</span>
                    </div>
                    <div className={`flex flex-row max-lg:gap-1 max-sm:gap-2 lg:gap-2 items-center max-lg:px-2 max-sm:px-3 lg:px-3 max-lg:py-1 max-sm:py-2 lg:py-2 rounded cursor-pointer transition-all duration-200 hover:bg-[#404040] max-lg:whitespace-nowrap ${
                        activePage === 'submissions' 
                            ? 'bg-[#404040] border-b-2 border-yellow-500 text-yellow-400' 
                            : 'text-gray-300 hover:text-white'
                    }`}
                        onClick={() => {
                            setActivePage('submissions')
                            getSubmissions();
                        }}
                    >
                        <FaCheckCircle className={`max-lg:text-sm max-sm:text-lg lg:text-lg ${
                            activePage === 'submissions' ? 'text-yellow-400' : 'text-emerald-400'
                        }`}/>
                        <span className="font-medium max-lg:text-sm max-sm:text-base lg:text-base">Submissions</span>
                    </div>
                </div>
                <div className="max-lg:p-2 max-sm:p-4 lg:p-4 overflow-y-auto max-lg:h-[calc(50vh-60px)] lg:max-h-[calc(100vh-150px)]">
                    {activePage === 'description' && problem ? (
                        <div className="max-lg:space-y-4 max-sm:space-y-6 lg:space-y-6">
                            <div className="max-lg:space-y-3 max-sm:space-y-4 lg:space-y-4">
                                <div className="flex max-lg:flex-col max-sm:flex-row max-lg:items-start max-sm:items-center lg:items-center max-lg:justify-start max-sm:justify-between lg:justify-between max-lg:gap-2 lg:gap-0">
                                    <h1 className="max-lg:text-xl max-sm:text-2xl lg:text-2xl font-bold text-white">{problem.title}</h1>
                                    <span className={`px-2 max-sm:px-3 lg:px-3 py-1 rounded-full text-xs font-medium max-lg:self-start lg:self-auto ${getDifficultyColor(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </span>
                                </div>
                                
                                <div className="flex flex-wrap max-lg:gap-2 max-sm:gap-3 lg:gap-3 max-lg:text-xs max-sm:text-sm lg:text-sm text-gray-400">
                                    <div className="flex items-center gap-1 cursor-pointer" 
                                    onClick={() => navigate(`/profile/${problem.creator}`)}>
                                        <FaUser />
                                        <span>{problem.creator}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FaCalendar />
                                        <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {problem.official && (
                                        <div className="flex items-center gap-1">
                                            <FaCheck />
                                            <span className="text-blue-400">Official</span>
                                        </div>
                                    )}
                                </div>

                                {problem.tags && problem.tags.length > 0 && (
                                    <div className="flex flex-wrap max-lg:gap-1 max-sm:gap-2 lg:gap-2">
                                        {problem.tags.map((tag, index) => (
                                            <span key={index} className={` ${tag.class ? 'bg-green-600 border-green-600' : 'bg-primaryCustom border-primaryCustom'}
                                            border px-2 py-1 rounded text-xs flex items-center gap-1`}>
                                                <FaTag className="text-xs" />
                                                {tag.name || tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
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

                            {problem.Restrictii && (
                                <div className="max-lg:space-y-3 max-sm:space-y-4 lg:space-y-4">
                                    <h2 className="max-lg:text-base max-sm:text-lg lg:text-lg font-semibold text-white border-b border-gray-600 pb-2">Restricții</h2>
                                    <div className="bg-[#1a1a1a] max-lg:p-2 max-sm:p-3 lg:p-3 rounded border border-gray-700">
                                        <p className="max-lg:text-xs max-sm:text-sm lg:text-sm text-gray-300 whitespace-pre-wrap">{problem.Restrictii}</p>
                                    </div>
                                </div>
                            )}

                            {problem.Precizari && (
                                <div className="max-lg:space-y-3 max-sm:space-y-4 lg:space-y-4">
                                    <h2 className="max-lg:text-base max-sm:text-lg lg:text-lg font-semibold text-white border-b border-gray-600 pb-2">Precizări</h2>
                                    <div className="bg-[#1a1a1a] max-lg:p-2 max-sm:p-3 lg:p-3 rounded border border-gray-700">
                                        <p className="max-lg:text-xs max-sm:text-sm lg:text-sm text-gray-300 whitespace-pre-wrap">{problem.Precizari}</p>
                                    </div>
                                </div>
                            )}

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
                                            {example.explanation && (
                                                <div>
                                                    <h5 className="max-lg:text-xs max-sm:text-sm lg:text-sm font-medium text-gray-400 mb-2">Explicație:</h5>
                                                    <div className="bg-[#1a1a1a] max-lg:p-2 max-sm:p-3 lg:p-3 rounded border border-gray-700">
                                                        <p className="max-lg:text-xs max-sm:text-sm lg:text-sm text-gray-300 whitespace-pre-wrap">{example.explanation}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : activePage === 'solutions' ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Community Solutions</h2>
                                <span className="text-sm text-gray-400">
                                    {totalSolutions > 0 ? `Showing ${solutions.length} of ${totalSolutions} solutions` : `${solutions.length} solutions`}
                                </span>
                            </div>
                            
                            {solutions.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        {solutions.map((solution, index) => {
                                            const passedTests = solution.results ? solution.results.filter(r => r.status === 'ACCEPTED').length : 0;
                                            const totalTests = solution.results ? solution.results.length : 0;
                                            
                                            return (
                                                <div key={index} className="bg-[#1a1a1a] rounded-lg border border-gray-700 hover:border-gray-600 transition-colors p-3">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar
                                                                showFallback
                                                                name={solution.username ? solution.username.charAt(0).toUpperCase() : '?'}
                                                                size="sm"
                                                                className="border-2 border-red-700 hover:border-red-500 rounded-full"
                                                                src=""
                                                            />
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-white font-medium">
                                                                    {solution.username || 'Anonymous'}
                                                                </span>
                                                                <span className={`px-2 py-1 rounded text-xs font-medium border ${
                                                                    solution.score >= 100 
                                                                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                                                        : solution.score > 0
                                                                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                                                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                                                                }`}>
                                                                    {solution.score || 0} pts
                                                                </span>
                                                                <span className="text-gray-400 text-sm">
                                                                    {passedTests}/{totalTests} tests
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="text-sm text-gray-400">
                                                            {solution.date ? new Date(solution.date).toLocaleString('ro-RO', {
                                                                year: 'numeric',
                                                                month: '2-digit',
                                                                day: '2-digit',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            }) : 'Unknown date'}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Solutions Pagination */}
                                    {solutionsTotalPages > 1 && (
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-700/50">
                                            <div className="text-sm text-gray-400">
                                                Page {solutionsCurrentPage} of {solutionsTotalPages} • {totalSolutions} total solutions
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        const newPage = solutionsCurrentPage - 1;
                                                        setSolutionsCurrentPage(newPage);
                                                        getSolutions(newPage);
                                                    }}
                                                    disabled={solutionsCurrentPage === 1}
                                                    className="bg-[#1a1a1a] border border-gray-600 hover:border-red-500/50 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    startContent={<FaChevronLeft className="text-xs" />}
                                                >
                                                    Previous
                                                </Button>
                                                
                                                <div className="flex items-center gap-1">
                                                    {/* Show page numbers */}
                                                    {(() => {
                                                        const pages = [];
                                                        const showPages = 3; // Show 3 page numbers max for solutions
                                                        let startPage = Math.max(1, solutionsCurrentPage - Math.floor(showPages / 2));
                                                        let endPage = Math.min(solutionsTotalPages, startPage + showPages - 1);
                                                        
                                                        // Adjust start if we're near the end
                                                        if (endPage - startPage < showPages - 1) {
                                                            startPage = Math.max(1, endPage - showPages + 1);
                                                        }
                                                        
                                                        // Add page numbers
                                                        for (let i = startPage; i <= endPage; i++) {
                                                            pages.push(
                                                                <Button
                                                                    key={i}
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSolutionsCurrentPage(i);
                                                                        getSolutions(i);
                                                                    }}
                                                                    className={`min-w-8 h-8 ${
                                                                        i === solutionsCurrentPage
                                                                            ? "bg-red-600 text-white"
                                                                            : "bg-[#1a1a1a] border border-gray-600 hover:border-red-500/50 text-gray-300"
                                                                    }`}
                                                                >
                                                                    {i}
                                                                </Button>
                                                            );
                                                        }
                                                        
                                                        return pages;
                                                    })()}
                                                </div>
                                                
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        const newPage = solutionsCurrentPage + 1;
                                                        setSolutionsCurrentPage(newPage);
                                                        getSolutions(newPage);
                                                    }}
                                                    disabled={solutionsCurrentPage === solutionsTotalPages}
                                                    className="bg-[#1a1a1a] border border-gray-600 hover:border-red-500/50 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    endContent={<FaChevronRight className="text-xs" />}
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FaUser className="text-6xl mx-auto mb-4 text-gray-600" />
                                    <h3 className="text-xl font-medium text-gray-400 mb-2">No solutions yet</h3>
                                    <p className="text-gray-500 mb-4">
                                        Be the first to share a successful solution with the community!
                                    </p>
                                    <Button
                                        onClick={handleSubmitCode}
                                        disabled={isCompiling || isRunning || isSubmitting}
                                        className="bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        <FaCloud className="mr-2" />
                                        Submit Your Solution
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : activePage === 'submissions' ? (
                        <div>
                            {submissions.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    {submissions.map((submission, index) => {
                                    const passedTests = submission.results ? submission.results.filter(r => r.status === 'ACCEPTED').length : 0;
                                    const totalTests = submission.results ? submission.results.length : 0;
                                    
                                    return (
                                        <div key={index} className="bg-[#1a1a1a] rounded-lg border border-gray-700 hover:border-gray-600 transition-colors p-3">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium border ${
                                                        submission.score >= 100 
                                                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                                            : submission.score > 0
                                                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                                                    }`}>
                                                        {submission.score || 0} pts
                                                    </span>
                                                    <span className="text-white font-medium">
                                                        {passedTests}/{totalTests} tests
                                                    </span>
                                                </div>

                                                <div className="text-sm text-gray-400">
                                                    {submission.date ? new Date(submission.date).toLocaleString('ro-RO', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : 'Unknown date'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-gray-400">
                                    <FaCheckCircle className="text-4xl mx-auto mb-4 opacity-50" />
                                    <p>You haven't submitted any solutions...</p>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
            <div className="w-full max-lg:h-[50vh] lg:w-1/2 bg-[#262626] text-white lg:h-[calc(100vh-81px)] rounded-lg border-1 border-[#333333] flex flex-col">
                <div className="max-lg:p-1 max-sm:p-2 lg:p-2 bg-[#333333] rounded-t-lg flex-shrink-0 relative flex max-lg:flex-col max-sm:flex-row lg:flex-row max-lg:justify-between lg:justify-between max-lg:gap-2 lg:gap-0">
                    <div>
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
                    </div>
                    <div className="flex flex-row max-lg:gap-1 lg:gap-1">
                        {isRunning ? (
                            <>
                                <Button
                                    onClick={terminateProgram}
                                    variant="ghost"
                                    className="bg-red-600 hover:bg-red-700 text-white max-lg:px-2 max-sm:px-3 lg:px-3 max-lg:py-1 max-sm:py-1.5 lg:py-1.5 flex 
                                    items-center justify-center transition-colors duration-200 min-w-0 max-lg:text-sm lg:text-base"
                                >
                                    <FaStop size="0.8em" />
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={handleRunCode}
                                disabled={isCompiling}
                                variant="ghost"
                                className="bg-blue-600 hover:bg-blue-700 text-white max-lg:px-2 max-sm:px-3 lg:px-3 max-lg:py-1 max-sm:py-1.5 lg:py-1.5 flex 
                                items-center justify-center transition-colors duration-200 min-w-0 disabled:bg-gray-500 max-lg:text-sm lg:text-base"
                            >
                                <FaPlay size="0.8em" />
                            </Button>
                        )}
                        <Button
                            onClick={handleSubmitCode}
                            disabled={isCompiling || isRunning || isSubmitting}
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
                        value={value} 
                        height="calc(100vh - 81px - 60px - 203px)"
                        width="100%"
                        extensions={getLanguage()}
                        onChange={onChange} 
                        theme={vscodeDark}
                        editable={!isRunning && !isCompiling}
                        basicSetup={{
                            ...CodeMirror.defaultProps?.basicSetup,
                            highlightActiveLine: !isRunning && !isCompiling,    // dezactivam highlightu daca e running sau compiling
                            highlightActiveLineGutter: !isRunning && !isCompiling // dezactivam highlightu daca e running sau compiling
                        }}
                    />
                    {(isRunning || isCompiling) && (
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center pointer-events-none">
                            <div className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 flex items-center gap-2">
                                {(isCompiling || isRunning) && (
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
            {showSubmitResults && submitResults && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 max-lg:p-2 max-sm:p-4 lg:p-4">
                    <div className="bg-[#262626] text-white rounded-lg max-w-4xl w-full max-lg:max-h-[95vh] max-sm:max-h-[90vh] lg:max-h-[90vh] overflow-hidden">
                        <div className="max-lg:p-3 max-sm:p-4 lg:p-4 border-b border-gray-600 flex justify-between items-center">
                            <h2 className="max-lg:text-lg max-sm:text-xl lg:text-xl font-bold">Submission Results</h2>
                            <button
                                onClick={() => setShowSubmitResults(false)}
                                className="text-gray-400 hover:text-white text-xl min-w-8 min-h-8 flex items-center justify-center"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="max-lg:p-3 max-sm:p-4 lg:p-4 overflow-y-auto max-lg:max-h-[calc(95vh-80px)] max-sm:max-h-[calc(90vh-120px)] lg:max-h-[calc(90vh-120px)]">
                            <div className="max-lg:mb-4 max-sm:mb-6 lg:mb-6 max-lg:p-3 max-sm:p-4 lg:p-4 bg-[#1a1a1a] rounded border border-gray-700">
                                <div className="grid grid-cols-2 max-lg:grid-cols-2 lg:grid-cols-4 max-lg:gap-3 max-sm:gap-4 lg:gap-4 text-center justify-items-center">
                                    <div>
                                        <div className="max-lg:text-xl max-sm:text-2xl lg:text-2xl font-bold text-white">{submitResults.score}</div>
                                        <div className="max-lg:text-xs max-sm:text-sm lg:text-sm text-gray-400">Score</div>
                                    </div>
                                    <div>
                                        <div className="max-lg:text-xl max-sm:text-2xl lg:text-2xl font-bold text-green-400">{submitResults.passedTests}</div>
                                        <div className="max-lg:text-xs max-sm:text-sm lg:text-sm text-gray-400">Passed</div>
                                    </div>
                                    <div>
                                        <div className="max-lg:text-xl max-sm:text-2xl lg:text-2xl font-bold text-red-400">{submitResults.totalTests - submitResults.passedTests}</div>
                                        <div className="max-lg:text-xs max-sm:text-sm lg:text-sm text-gray-400">Failed</div>
                                    </div>
                                    <div>
                                        <div className="max-lg:text-xl max-sm:text-2xl lg:text-2xl font-bold text-blue-400">{submitResults.totalTests}</div>
                                        <div className="max-lg:text-xs max-sm:text-sm lg:text-sm text-gray-400">Total</div>
                                    </div>
                                </div>
                            </div>

                            <div className="max-lg:space-y-3 max-sm:space-y-4 lg:space-y-4">
                                <h3 className="max-lg:text-base max-sm:text-lg lg:text-lg font-semibold text-white">Test Cases</h3>
                                {submitResults.results.map((result, index) => (
                                    <div key={index} className="bg-[#1a1a1a] rounded border border-gray-700 overflow-hidden">
                                        <div className="max-lg:p-2 max-sm:p-3 lg:p-3 bg-[#2a2a2a] flex max-lg:flex-col max-sm:flex-row lg:flex-row max-lg:justify-start max-sm:justify-between lg:justify-between max-lg:items-start max-sm:items-center lg:items-center max-lg:gap-2 lg:gap-0">
                                            <span className="font-medium max-lg:text-sm max-sm:text-base lg:text-base">Test Case {result.testCase}</span>
                                            <div className="flex flex-wrap items-center max-lg:gap-2 max-sm:gap-3 lg:gap-3">
                                                <span className="max-lg:text-xs max-sm:text-sm lg:text-sm text-gray-400">{result.executionTime}ms</span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(result.status)}`}>
                                                    {result.status.replace('_', ' ')}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium border ${
                                                    (result.scorePerTest || 0) === 0 
                                                        ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                                                        : 'bg-green-500/20 text-green-400 border-green-500/30'
                                                }`}>
                                                    {result.scorePerTest || 0} pts
                                                </span>
                                            </div>
                                        </div>
                                        {result.error && (
                                            <div className="max-lg:p-2 max-sm:p-3 lg:p-3 max-lg:space-y-2 max-sm:space-y-3 lg:space-y-3">
                                                <div>
                                                    <h5 className="max-lg:text-xs max-sm:text-sm lg:text-sm font-medium text-red-400 mb-1">Error:</h5>
                                                    <div className="bg-[#151515] p-2 rounded text-xs font-mono text-red-400 whitespace-pre-wrap overflow-x-auto">
                                                        {result.error}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProblemPage;
