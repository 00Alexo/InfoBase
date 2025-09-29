import { Link, useParams } from "react-router-dom";
import { useGetProblem } from "../Hooks/useGetProblem";
import NotFound from "./NotFound";
import {  FaChevronDown, FaCloud,  FaPlay, FaStop } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from "@codemirror/lang-cpp";
import { python } from '@codemirror/lang-python';
import {java} from '@codemirror/lang-java';
import {vscodeDark} from '@uiw/codemirror-theme-vscode'
import React from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import io from 'socket.io-client';
import { useAuthContext } from "../Hooks/useAuthContext";

const Compiler = () => {
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

    const [output, setOutput] = useState(''); 
    const [currentInput, setCurrentInput] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);
    const [socket, setSocket] = useState(null);
    const [waitingForInput, setWaitingForInput] = useState(false);
    const [anonymousId, setAnonymousId] = useState(null); // Track anonymous user ID
    const outputRef = useRef(null);
    const inputRef = useRef(null);  //variable pentru compiler, asincron cu backendu
    const isRunningRef = useRef(false); // ref pentru a urmari starea isRunning fara closure issues

    useEffect(() =>{
        const newSocket = io(`${process.env.REACT_APP_API_SOCKET || 'http://localhost:4000'}`); // conectare la socketu de la backend
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket server');
            // Associate user with socket connection if logged in
            if (user?.username) {
                newSocket.emit('associate-user', { userId: user.username });
                console.log('User associated with socket:', user.username);
                setAnonymousId(null);
            } else {
                // For anonymous users, create a temporary ID based on socket ID
                const anonymousId = 'anon_' + newSocket.id;
                newSocket.emit('associate-user', { userId: anonymousId });
                console.log('Anonymous user connected with ID:', anonymousId);
                setAnonymousId(anonymousId);
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
    }, [user]); // Re-run when user login status changes

    useEffect(() => {
        isRunningRef.current = isRunning;
    }, [isRunning]);

    useEffect(() => { // scroll la top output cand se schimba
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    const handleRunCode = async () =>{
        if (!value.trim()) { // daca nu e cod, afisam in output si nu rulam
            setOutput('Invalid code input\n\n');
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
                    userId: user?.username || anonymousId // Send real username or anonymous ID
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

    return (
        <div className="w-full bg-[#262626] text-white h-[calc(100vh-65px)] border-1 border-[#333333] flex flex-col">
            <div className="bg-gradient-to-r from-[#333333] to-[#3a3a3a] p-3 flex justify-between items-center border-b border-gray-600">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <FaCloud className="text-red-400" />
                        Compiler
                    </h1>
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30">
                        v2.0
                    </span>
                    <Dropdown placement="bottom-start">
                        <DropdownTrigger>
                            <Button 
                                variant="light" 
                                className="text-gray-300 hover:bg-[#404040] px-3 py-2 min-w-0 rounded-md transition-colors"
                            >
                                {language} <FaChevronDown size="0.75em" className="ml-2"/>
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
                <div className="flex items-center gap-2">
                    {isRunning ? (
                        <Button
                            onClick={terminateProgram}
                            variant="ghost"
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 flex 
                            items-center gap-2 transition-colors duration-200 rounded-md font-medium shadow-lg"
                        >
                            <FaStop size="0.9em" />
                            Stop
                        </Button>
                    ) : (
                        <Button
                            onClick={handleRunCode}
                            disabled={isCompiling}
                            variant="ghost"
                            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white px-4 py-2 flex 
                            items-center gap-2 transition-colors duration-200 rounded-md font-medium shadow-lg"
                        >
                            <FaPlay size="0.9em" />
                            {isCompiling ? 'Compiling...' : 'Run Code'}
                        </Button>
                    )}
                </div>
            </div>
            <div className="flex-1 overflow-hidden relative">
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
            <div className="h-52 bg-[#151515] border-t-2 border-[#30363d] flex-shrink-0 flex flex-col">
                <div className="flex justify-between items-center p-2 border-b border-[#30363d]">
                    <span className="text-gray-300 font-medium">Console</span>
                    <span
                        onClick={clearOutput}
                        variant="ghost"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-0.5 flex rounded-lg cursor-pointer
                        items-center justify-center transition-colors duration-200 min-w-0"
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
                        className="absolute inset-0 p-2 text-green-400 font-mono text-sm overflow-auto whitespace-pre-wrap outline-none"
                        tabIndex={waitingForInput ? 0 : -1}
                        onKeyDown={handleTerminalKeyDown}
                    >
                        {output}
                        {waitingForInput && (
                            <span className="inline-flex items-baseline">
                                <span className="text-green-400">{currentInput}</span>
                                <span className="animate-pulse bg-green-400 w-0.5 h-4 ml-0.5 inline-block">█</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Compiler;