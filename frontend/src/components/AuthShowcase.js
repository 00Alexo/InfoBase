import React, { useState, useEffect } from 'react';
import { FaFistRaised, FaRobot, FaTrophy, FaCode, FaUsers, FaGift } from "react-icons/fa";

const AuthShowcase = () => {
    const [currentFeature, setCurrentFeature] = useState(0);
    const [currentAlgorithm, setCurrentAlgorithm] = useState(0);
    
    const features = [
        { icon: FaFistRaised, title: "1v1 Code Duels", description: "Battle opponents in real-time coding challenges" },
        { icon: FaRobot, title: "AI Code Reviews", description: "Get instant feedback on your solutions" },
        { icon: FaTrophy, title: "Global Leaderboards", description: "Compete for top rankings and prizes" },
        { icon: FaCode, title: "Algorithm Mastery", description: "Master data structures and algorithms" },
        { icon: FaUsers, title: "Community Battles", description: "Join team competitions and tournaments" },
        { icon: FaGift, title: "Daily Rewards", description: "Earn points and unlock achievements" }
    ];

    const algorithms = [
        {
            name: "find-max.cpp",
            code: `#include <iostream>

int findMax(int arr[], int size) {
    int maxVal = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;
}`
        },
        {
            name: "reverse-string.cpp", 
            code: `#include <cstring>
#include <iostream>

void reverseString(char str[]) {
    int len = strlen(str);
    for (int i = 0; i < len / 2; i++) {
        char temp = str[i];
        str[i] = str[len - 1 - i];
        str[len - 1 - i] = temp;
    }
}`
        },
        {
            name: "sum-array.cpp",
            code: `#include <iostream>

int sumArray(int numbers[], int size) {
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += numbers[i];
    }
    return sum;
}`
        },
        {
            name: "is-palindrome.cpp",
            code: `#include <cstring>
#include <iostream>

bool isPalindrome(char word[]) {
    int len = strlen(word);
    for (int i = 0; i < len / 2; i++) {
        if (word[i] != word[len - 1 - i]) {
            return false;
        }
    }
    return true;
}`
        },
        {
            name: "count-vowels.cpp",
            code: `#include <cstring>
#include <iostream>

int countVowels(char text[]) {
    char vowels[] = "aeiouAEIOU";
    int count = 0;
    int len = strlen(text);
    
    for (int i = 0; i < len; i++) {
        if (strchr(vowels, text[i]) != nullptr) {
            count++;
        }
    }
    return count;
}`
        }
    ];    useEffect(() => {
        const featureInterval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length);
        }, 3000);

        const algorithmInterval = setInterval(() => {
            setCurrentAlgorithm((prev) => (prev + 1) % algorithms.length);
        }, 4000);

        return () => {
            clearInterval(featureInterval);
            clearInterval(algorithmInterval);
        };
    }, []);

    const renderCodeLine = (line, index) => {
        // Preserve leading whitespace for proper indentation
        const leadingSpaces = line.match(/^(\s*)/)[0];
        const trimmedLine = line.trim();
        
        if (trimmedLine.includes('#include')) {
            return (
                <div key={index} className="mb-1" style={{ paddingLeft: `${leadingSpaces.length * 8}px` }}>
                    <span className="text-purple-400">#include </span>
                    <span className="text-green-400">{trimmedLine.split('#include ')[1]}</span>
                </div>
            );
        } else if (trimmedLine.includes('using namespace')) {
            return (
                <div key={index} className="mb-1" style={{ paddingLeft: `${leadingSpaces.length * 8}px` }}>
                    <span className="text-purple-400">using namespace </span>
                    <span className="text-blue-400">{trimmedLine.split('using namespace ')[1]}</span>
                </div>
            );
        } else if (trimmedLine.includes('//')) {
            return (
                <div key={index} className="text-gray-500 mb-1" style={{ paddingLeft: `${leadingSpaces.length * 8}px` }}>
                    {trimmedLine}
                </div>
            );
        } else if (trimmedLine.match(/^(int|string|bool|void|vector<.*>)\s+\w+\s*\(/)) {
            // Function declarations
            const parts = trimmedLine.split('(');
            const beforeParen = parts[0];
            const afterParen = parts[1];
            const typeAndName = beforeParen.split(' ');
            const returnType = typeAndName[0];
            const functionName = typeAndName[typeAndName.length - 1];
            
            return (
                <div key={index} className="mb-1" style={{ paddingLeft: `${leadingSpaces.length * 8}px` }}>
                    <span className="text-blue-400">{returnType} </span>
                    <span className="text-yellow-300">{functionName}</span>
                    <span className="text-white">(</span>
                    <span className="text-orange-300">{afterParen}</span>
                </div>
            );
        } else if (trimmedLine.includes('for ') || trimmedLine.includes('while ') || trimmedLine.includes('if ')) {
            return (
                <div key={index} className="text-pink-400 mb-1" style={{ paddingLeft: `${leadingSpaces.length * 8}px` }}>
                    {trimmedLine}
                </div>
            );
        } else if (trimmedLine.includes('return')) {
            return (
                <div key={index} className="text-green-400 mb-1" style={{ paddingLeft: `${leadingSpaces.length * 8}px` }}>
                    {trimmedLine}
                </div>
            );
        } else if (trimmedLine.match(/^(int|string|bool|vector<.*>)\s+\w+/)) {
            // Variable declarations
            return (
                <div key={index} className="text-purple-400 mb-1" style={{ paddingLeft: `${leadingSpaces.length * 8}px` }}>
                    {trimmedLine}
                </div>
            );
        } else if (trimmedLine === '{' || trimmedLine === '}') {
            return (
                <div key={index} className="text-white mb-1" style={{ paddingLeft: `${leadingSpaces.length * 8}px` }}>
                    {trimmedLine}
                </div>
            );
        } else {
            return (
                <div key={index} className="text-white mb-1" style={{ paddingLeft: `${leadingSpaces.length * 8}px` }}>
                    {trimmedLine}
                </div>
            );
        }
    };

    return (
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-bgCustomPage to-bgCustomLight flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-15">
                <div className="absolute top-[8%] lg:top-[10%] left-[5%] lg:left-[8%] text-5xl lg:text-6xl text-primaryCustom font-mono">{'{'}</div>
                <div className="absolute top-[15%] lg:top-[18%] right-[8%] lg:right-[12%] text-4xl lg:text-4xl text-secondaryCustom font-mono">{'}'}</div>
                <div className="absolute bottom-[15%] lg:bottom-[18%] left-[8%] lg:left-[12%] text-5xl lg:text-5xl text-accentCustom font-mono">{'<'}</div>
                <div className="absolute bottom-[8%] lg:bottom-[10%] right-[5%] lg:right-[8%] text-3xl lg:text-3xl text-primaryCustom font-mono">{'>'}</div>
                <div className="absolute top-[35%] lg:top-[33%] left-[15%] lg:left-[20%] text-2xl lg:text-2xl text-secondaryCustom font-mono">{'[]'}</div>
                <div className="absolute top-[65%] lg:top-[67%] right-[15%] lg:right-[20%] text-4xl lg:text-4xl text-accentCustom font-mono">{'()'}</div>
            </div>
            
            <div className="relative z-10 text-center max-w-sm lg:max-w-md w-full">
                <div className="mb-6 lg:mb-8">
                    <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primaryCustom to-secondaryCustom bg-clip-text text-transparent mb-4">
                        Master Algorithms
                    </h2>
                    <p className="text-textCustomSecondary text-base lg:text-lg leading-relaxed">
                        Join thousands of developers solving challenging problems and competing in real-time battles.
                    </p>
                </div>

                <div className="mb-6 lg:mb-8">
                    <div className="bg-bgCustomCard border border-borderCustom rounded-lg p-4 lg:p-6 hover:border-primaryCustom transition-all duration-500 min-h-[100px] lg:min-h-[120px] relative overflow-hidden">
                        <div 
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentFeature * 100}%)` }}
                        >
                            {features.map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <div key={index} className="w-full flex-shrink-0 text-center">
                                        <div className="flex flex-col items-center">
                                            <IconComponent className="text-2xl lg:text-3xl text-primaryCustom mb-2 lg:mb-3" />
                                            <div className="text-lg lg:text-xl font-bold text-white mb-1 lg:mb-2">{feature.title}</div>
                                            <div className="text-xs lg:text-sm text-textCustomMuted px-2">{feature.description}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="flex justify-center gap-2 mt-4">
                            {features.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentFeature(index)}
                                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                                        index === currentFeature ? 'bg-primaryCustom' : 'bg-gray-600'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="bg-blackCustomMatte border border-borderCustom rounded-lg p-3 lg:p-4 text-left font-mono text-xs relative overflow-hidden h-[280px] lg:h-[340px]">
                    <div className="flex items-center gap-2 mb-2 lg:mb-3">
                        <div className="w-2 lg:w-3 h-2 lg:h-3 rounded-full bg-red-500"></div>
                        <div className="w-2 lg:w-3 h-2 lg:h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-2 lg:w-3 h-2 lg:h-3 rounded-full bg-green-500"></div>
                        <span className="ml-1 lg:ml-2 text-textCustomMuted text-xs">{algorithms[currentAlgorithm].name}</span>
                    </div>
                    
                    <div 
                        className="transition-opacity duration-500 h-[220px] lg:h-[260px] overflow-y-auto overflow-x-hidden flex flex-col justify-center"
                        key={currentAlgorithm}
                    >
                        {algorithms[currentAlgorithm].code.split('\n').map((line, index) => 
                            renderCodeLine(line, index)
                        )}
                    </div>
                    
                    <div className="absolute bottom-2 left-4 right-4">
                        <div className="flex gap-1">
                            {algorithms.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentAlgorithm(index)}
                                    className={`flex-1 h-1 rounded transition-colors duration-300 hover:bg-primaryCustomHover cursor-pointer ${
                                        index === currentAlgorithm ? 'bg-primaryCustom' : 'bg-gray-700'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="mt-4 lg:mt-6 text-textCustomMuted text-xs lg:text-sm">
                    Ready to level up your coding skills?
                </div>
            </div>
        </div>
    );
};

export default AuthShowcase;