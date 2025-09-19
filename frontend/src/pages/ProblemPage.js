import { Link, useParams } from "react-router-dom";
import { useGetProblem } from "../Hooks/useGetProblem";
import NotFound from "./NotFound";
import { FaBook, FaCheck, FaCheckCircle, FaQuestion, FaClock, FaMemory, FaTag, FaUser, FaCalendar, FaArrowDown, FaChevronDown, FaRegCopy, FaCloud, FaPlaystation, FaPlay } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from "@codemirror/lang-cpp";
import {java} from '@codemirror/lang-java';
import {vscodeDark} from '@uiw/codemirror-theme-vscode'
import React from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";

const ProblemPage = () => {
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
        // write your code here
    }
}`)
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
        <div className="flex flex-row p-2 gap-2">
            <div className="w-1/2 bg-[#262626] text-white min-h-[calc(100vh-81px)] rounded-lg border-1 border-[#333333]">
                <div className="bg-[#333333] p-2 rounded-t-lg flex flex-row gap-1">
                    <div className={`flex flex-row gap-2 items-center px-3 py-2 rounded cursor-pointer transition-all duration-200 hover:bg-[#404040] ${
                        activePage === 'description' 
                            ? 'bg-[#404040] border-b-2 border-blue-500 text-blue-400' 
                            : 'text-gray-300 hover:text-white'
                    }`}
                        onClick={() => setActivePage('description')}
                    >
                        <FaBook className={`text-lg ${
                            activePage === 'description' ? 'text-blue-400' : 'text-orange-400'
                        }`}/>
                        <span className="font-medium">Description</span>
                    </div>
                    <div className={`flex flex-row gap-2 items-center px-3 py-2 rounded cursor-pointer transition-all duration-200 hover:bg-[#404040] ${
                        activePage === 'solutions' 
                            ? 'bg-[#404040] border-b-2 border-green-500 text-green-400' 
                            : 'text-gray-300 hover:text-white'
                    }`}
                        onClick={() => setActivePage('solutions')}
                    >
                        <FaQuestion className={`text-lg ${
                            activePage === 'solutions' ? 'text-green-400' : 'text-purple-400'
                        }`}/>
                        <span className="font-medium">Solutions</span>
                    </div>
                    <div className={`flex flex-row gap-2 items-center px-3 py-2 rounded cursor-pointer transition-all duration-200 hover:bg-[#404040] ${
                        activePage === 'submissions' 
                            ? 'bg-[#404040] border-b-2 border-yellow-500 text-yellow-400' 
                            : 'text-gray-300 hover:text-white'
                    }`}
                        onClick={() => setActivePage('submissions')}
                    >
                        <FaCheckCircle className={`text-lg ${
                            activePage === 'submissions' ? 'text-yellow-400' : 'text-emerald-400'
                        }`}/>
                        <span className="font-medium">Submissions</span>
                    </div>
                </div>
                <div className="p-4 overflow-y-auto max-h-[calc(100vh-150px)]">
                    {activePage === 'description' && problem ? (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
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
                                    <div className="flex flex-wrap gap-2">
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

                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">Descriere</h2>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{problem.description}</p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">Cerința</h2>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{problem.cerinta}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h3 className="text-md font-semibold text-white">Date de intrare</h3>
                                    <div className="bg-[#1a1a1a] p-3 rounded border border-gray-700">
                                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{problem.DateDeIntrare}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-md font-semibold text-white">Date de ieșire</h3>
                                    <div className="bg-[#1a1a1a] p-3 rounded border border-gray-700">
                                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{problem.DateDeIesire}</p>
                                    </div>
                                </div>
                            </div>

                            {problem.Restrictii && (
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">Restricții</h2>
                                    <div className="bg-[#1a1a1a] p-3 rounded border border-gray-700">
                                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{problem.Restrictii}</p>
                                    </div>
                                </div>
                            )}

                            {problem.Precizari && (
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">Precizări</h2>
                                    <div className="bg-[#1a1a1a] p-3 rounded border border-gray-700">
                                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{problem.Precizari}</p>
                                    </div>
                                </div>
                            )}

                            {problem.Exemple && problem.Exemple.length > 0 && (
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">Exemple</h2>
                                    {problem.Exemple.map((example, index) => (
                                        <div key={index} className="space-y-3">
                                            <h4 className="text-md font-medium text-gray-300">Exemplul {index + 1}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h5 className="text-sm font-medium text-gray-400 mb-2">Input:</h5>
                                                    <div className="bg-[#1a1a1a] p-3 rounded border border-gray-700">
                                                        <pre className="text-green-400 text-sm whitespace-pre-wrap font-mono">
                                                            {example.input || example.intrare}
                                                        </pre>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h5 className="text-sm font-medium text-gray-400 mb-2">Output:</h5>
                                                    <div className="bg-[#1a1a1a] p-3 rounded border border-gray-700">
                                                        <pre className="text-blue-400 text-sm whitespace-pre-wrap font-mono">
                                                            {example.output || example.iesire}
                                                        </pre>
                                                    </div>
                                                </div>
                                            </div>
                                            {example.explanation && (
                                                <div>
                                                    <h5 className="text-sm font-medium text-gray-400 mb-2">Explicație:</h5>
                                                    <div className="bg-[#1a1a1a] p-3 rounded border border-gray-700">
                                                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{example.explanation}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : activePage === 'solutions' ? (
                        <div className="p-4 text-center text-gray-400">
                            <FaQuestion className="text-4xl mx-auto mb-4 opacity-50" />
                            <p>Solutions section coming soon...</p>
                        </div>
                    ) : activePage === 'submissions' ? (
                        <div className="p-4 text-center text-gray-400">
                            <FaCheckCircle className="text-4xl mx-auto mb-4 opacity-50" />
                            <p>Submissions section coming soon...</p>
                        </div>
                    ) : null}
                </div>
            </div>
            <div className="w-1/2 bg-[#262626] text-white h-[calc(100vh-81px)] rounded-lg border-1 border-[#333333] flex flex-col">
                <div className="p-2 bg-[#333333] rounded-t-lg flex-shrink-0 relative flex flex-row justify-between">
                    <div>
                        <Dropdown placement="bottom-start">
                            <DropdownTrigger>
                                <Button 
                                    variant="light" 
                                    className="text-gray-300 hover:bg-[#404040] p-2 min-w-0"
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
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="flex flex-row gap-1">
                        <Button
                            variant="ghost"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 flex 
                            items-center justify-center transition-colors duration-200 min-w-0"
                        >
                            <FaPlay size="0.8em" />
                        </Button>
                        <Button
                            variant="ghost"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 flex items-center gap-2 transition-colors duration-200"
                        >
                            <FaCloud size="0.9em" />
                            <span className="font-medium">Submit</span>
                        </Button>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden">
                    <CodeMirror
                        value={value} 
                        height="calc(100vh - 81px - 60px - 110px)"
                        width="100%"
                        extensions={getLanguage()}
                        onChange={onChange} 
                        theme={vscodeDark}
                    />
                </div>
                <div className="h-28 bg-[#151515] rounded-b-lg border-t-2 border-[#30363d] flex-shrink-0 p-2">
                    Output
                </div>
            </div>
        </div>
    );
}

export default ProblemPage;

{/* <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                    true
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-primaryCustom/20 text-primaryCustom border border-primaryCustom/30'
                }`}
            >
                'name'
            </span> */}
