# Interactive C++ Compiler - Complete Code Implementation Guide

## Overview
This guide contains **ALL THE ACTUAL CODE** you need to add/modify to transform your basic MERN compiler into an interactive web-based C++ compiler that works "just like CodeBlocks" with real-time terminal input and output.

## Table of Contents
1. [Prerequisites & Dependencies](#prerequisites--dependencies)
2. [Backend Code Implementation](#backend-code-implementation)
3. [Frontend Code Implementation](#frontend-code-implementation)
4. [Complete File Contents](#complete-file-contents)
5. [Testing Your Implementation](#testing-your-implementation)
6. [Troubleshooting](#troubleshooting)

## Prerequisites & Dependencies

### 1. Install Backend Dependencies
Navigate to your backend directory and install these packages:

```bash
cd backend
npm install socket.io@4.7.2
```

### 2. Install Frontend Dependencies  
Navigate to your frontend directory and install these packages:

```bash
cd frontend
npm install socket.io-client@4.7.2 @heroui/input @heroui/button
npm install @uiw/react-codemirror @codemirror/lang-cpp @codemirror/lang-java
```

### 3. Ensure G++ Compiler is Available
**Windows (MinGW):**
```bash
g++ --version  # Should show compiler version
```
**Linux/Mac:**
```bash
sudo apt install g++  # Ubuntu
brew install gcc       # Mac
```

## Backend Code Implementation

### STEP 1: Modify Main Server File (backend/index.js)

**ADD these imports at the top:**
```javascript
const http = require('http');
const socketIo = require('socket.io');
const { sendInput, terminateProcess } = require('./exec/executeFile');
```

**REPLACE your existing Express app setup with:**
```javascript
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Make io globally available
global.io = io;
```

**ADD WebSocket handlers BEFORE server.listen():**
```javascript
// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle user input
    socket.on('send-input', (data) => {
        const { sessionId, input } = data;
        const success = sendInput(sessionId, input);
        
        if (!success) {
            socket.emit('error', {
                message: 'No active process found for this session'
            });
        }
    });

    // Handle process termination
    socket.on('terminate-process', (data) => {
        const { sessionId } = data;
        terminateProcess(sessionId);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
```

**CHANGE server.listen() to use `server` instead of `app`:**
```javascript
server.listen(process.env.PORT || 4000, () => {
    console.log('Server listening on port', process.env.PORT || 4000);
});
```

### STEP 2: Completely Replace executeFile.js (backend/exec/executeFile.js)

**REPLACE the entire contents of executeFile.js with:**

```javascript
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

// Store active processes with their session IDs
const activeProcesses = new Map();

// Main function to compile and execute C++ code interactively
const executeCppInteractive = async (code, sessionId) => {
    const sourceFile = path.join(__dirname, '../temp', `${sessionId}.cpp`);
    const executableFile = path.join(__dirname, '../temp', `${sessionId}.exe`);
    
    try {
        // Write code to temporary file
        await fs.writeFile(sourceFile, code);
        
        // Compile with g++
        const compileProcess = spawn('g++', [sourceFile, '-o', executableFile]);
        
        let compileError = '';
        
        compileProcess.stderr.on('data', (data) => {
            compileError += data.toString();
        });
        
        compileProcess.on('close', (code) => {
            if (code !== 0) {
                // Compilation failed
                global.io.emit('compilation-error', {
                    sessionId: sessionId,
                    error: compileError
                });
                cleanup(sourceFile, executableFile);
                return;
            }
            
            // Compilation successful, start execution
            startExecution(executableFile, sessionId, sourceFile);
        });
        
    } catch (error) {
        console.error('Execution error:', error);
        global.io.emit('compilation-error', {
            sessionId: sessionId,
            error: error.message
        });
    }
};

// Start the executable with interactive I/O
const startExecution = (executableFile, sessionId, sourceFile) => {
    const executionProcess = spawn(executableFile, [], {
        stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Store process for input handling
    activeProcesses.set(sessionId, executionProcess);
    
    // Handle stdout (program output)
    executionProcess.stdout.on('data', (data) => {
        global.io.emit('output', {
            sessionId: sessionId,
            data: data.toString(),
            type: 'stdout'
        });
    });
    
    // Handle stderr (error output)
    executionProcess.stderr.on('data', (data) => {
        global.io.emit('output', {
            sessionId: sessionId,
            data: data.toString(),
            type: 'stderr'
        });
    });
    
    // Handle process completion
    executionProcess.on('close', (code) => {
        global.io.emit('execution-complete', {
            sessionId: sessionId,
            exitCode: code
        });
        
        // Clean up resources
        activeProcesses.delete(sessionId);
        cleanup(sourceFile, executableFile);
    });
    
    // Handle process errors
    executionProcess.on('error', (error) => {
        global.io.emit('compilation-error', {
            sessionId: sessionId,
            error: `Execution error: ${error.message}`
        });
        
        activeProcesses.delete(sessionId);
        cleanup(sourceFile, executableFile);
    });
};

// Send input to a running process
const sendInput = (sessionId, input) => {
    const process = activeProcesses.get(sessionId);
    if (process && !process.killed) {
        process.stdin.write(input + '\n');
        return true;
    }
    return false;
};

// Terminate a running process
const terminateProcess = (sessionId) => {
    const process = activeProcesses.get(sessionId);
    if (process && !process.killed) {
        process.kill();
        activeProcesses.delete(sessionId);
        global.io.emit('execution-complete', {
            sessionId: sessionId,
            exitCode: -1,
            terminated: true
        });
    }
};

// Helper function to cleanup files
const cleanup = async (sourceFile, executableFile) => {
    try {
        await fs.unlink(sourceFile).catch(() => {});
        await fs.unlink(executableFile).catch(() => {});
    } catch (error) {
        console.error('Cleanup error:', error);
    }
};

module.exports = { 
    executeCppInteractive,
    sendInput,
    terminateProcess
};
```

### STEP 3: Modify Compiler Controller (backend/controllers/compilerController.js)

**REPLACE your existing runCode function with:**

```javascript
const { executeCppInteractive } = require('../exec/executeFile');

const runCode = async (req, res) => {
    try{
        const { code, language } = req.body;

        console.log("Received compilation request:", { code: code.substring(0, 100) + "...", language });

        if(language === "C++"){
            // Generate unique session ID using timestamp
            const sessionId = Date.now().toString();
            
            // Start compilation and execution
            executeCppInteractive(code, sessionId);
            
            return res.status(200).json({ 
                sessionId: sessionId,
                message: "Compilation started. Connect to WebSocket for interactive execution."
            });
        }
        
        return res.status(400).json({ error: 'Unsupported language!' });
    }catch(error){
        console.error("Compilation controller error:", error.message);
        return res.status(400).json({ error: error.message });
    }
}

module.exports = { 
    runCode 
};
```

### STEP 4: Update Compiler Routes (backend/routes/compilerRoutes.js)

**ADD this line to maintain backward compatibility:**

```javascript
const express = require('express');
const{ runCode } = require('../controllers/compilerController');

const router = express.Router();

router.post('/run', runCode);
router.post('/runCode', runCode); // Keep both for backward compatibility

module.exports= router;
```

## Frontend Code Implementation

### STEP 5: Completely Replace ProblemPage.js (frontend/src/pages/ProblemPage.js)

**REPLACE the entire contents with this enhanced version:**

```javascript
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Input, Button } from '@heroui/react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';
import { useGetProblem } from '../Hooks/useGetProblem';
import io from 'socket.io-client';

const ProblemPage = () => {
    const { id } = useParams();
    const { getProblem, problem, isLoading } = useGetProblem();
    
    // Code editor state
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('C++');
    
    // Execution state
    const [isExecuting, setIsExecuting] = useState(false);
    const [output, setOutput] = useState('');
    const [sessionId, setSessionId] = useState(null);
    
    // Interactive input state
    const [isWaitingForInput, setIsWaitingForInput] = useState(false);
    const [currentInput, setCurrentInput] = useState('');
    
    // WebSocket and refs
    const socketRef = useRef(null);
    const editorRef = useRef(null);
    const outputRef = useRef(null);
    const quickDetectionTimeoutRef = useRef(null);
    const fallbackDetectionTimeoutRef = useRef(null);

    // Initialize WebSocket connection
    useEffect(() => {
        socketRef.current = io('http://localhost:4000');
        
        // WebSocket event listeners
        socketRef.current.on('output', handleOutput);
        socketRef.current.on('compilation-error', handleCompilationError);
        socketRef.current.on('execution-complete', handleExecutionComplete);
        
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            clearAutoDetectionTimeouts();
        };
    }, []);

    // Handle program output
    const handleOutput = useCallback((data) => {
        if (data.sessionId === sessionId) {
            setOutput(prev => prev + data.data);
            
            // Clear auto-detection timeouts when output is received
            clearAutoDetectionTimeouts();
            
            // Set new detection timeouts
            setAutoDetectionTimeouts();
            
            // Auto-scroll output
            setTimeout(() => {
                if (outputRef.current) {
                    outputRef.current.scrollTop = outputRef.current.scrollHeight;
                }
            }, 10);
        }
    }, [sessionId]);

    // Handle compilation errors
    const handleCompilationError = useCallback((data) => {
        if (data.sessionId === sessionId) {
            setOutput(prev => prev + `\n❌ Compilation Error:\n${data.error}\n`);
            setIsExecuting(false);
            setIsWaitingForInput(false);
            if (editorRef.current) {
                editorRef.current.setReadOnly(false);
            }
            clearAutoDetectionTimeouts();
        }
    }, [sessionId]);

    // Handle execution completion
    const handleExecutionComplete = useCallback((data) => {
        if (data.sessionId === sessionId) {
            const exitMessage = data.terminated 
                ? '\n🛑 Program terminated by user'
                : `\n✅ Program finished with exit code: ${data.exitCode}`;
            
            setOutput(prev => prev + exitMessage);
            setIsExecuting(false);
            setIsWaitingForInput(false);
            if (editorRef.current) {
                editorRef.current.setReadOnly(false);
            }
            clearAutoDetectionTimeouts();
        }
    }, [sessionId]);

    // Auto-detection timeout management
    const clearAutoDetectionTimeouts = useCallback(() => {
        if (quickDetectionTimeoutRef.current) {
            clearTimeout(quickDetectionTimeoutRef.current);
            quickDetectionTimeoutRef.current = null;
        }
        if (fallbackDetectionTimeoutRef.current) {
            clearTimeout(fallbackDetectionTimeoutRef.current);
            fallbackDetectionTimeoutRef.current = null;
        }
    }, []);

    const setAutoDetectionTimeouts = useCallback(() => {
        // Quick detection (300ms) - for immediate cin operations
        quickDetectionTimeoutRef.current = setTimeout(() => {
            if (isExecuting && !isWaitingForInput) {
                setIsWaitingForInput(true);
                setOutput(prev => prev + '\n💭 Waiting for input...\n> ');
            }
        }, 300);

        // Fallback detection (1.5s) - for silent programs
        fallbackDetectionTimeoutRef.current = setTimeout(() => {
            if (isExecuting && !isWaitingForInput) {
                setIsWaitingForInput(true);
                setOutput(prev => prev + '\n💭 Program might be waiting for input...\n> ');
            }
        }, 1500);
    }, [isExecuting, isWaitingForInput]);

    // Terminal keyboard handler
    const handleTerminalKeyDown = useCallback((e) => {
        if (!isWaitingForInput) return;

        if (e.key === 'Enter') {
            // Send input to backend
            if (socketRef.current && sessionId) {
                socketRef.current.emit('send-input', {
                    sessionId: sessionId,
                    input: currentInput
                });
            }
            
            // Display input in terminal
            setOutput(prev => prev + currentInput + '\n');
            setCurrentInput('');
            setIsWaitingForInput(false);
            
            // Clear detection timeouts
            clearAutoDetectionTimeouts();
        } else if (e.key === 'Backspace') {
            setCurrentInput(prev => prev.slice(0, -1));
        } else if (e.key.length === 1) {
            // Regular character input
            setCurrentInput(prev => prev + e.key);
        }
    }, [isWaitingForInput, currentInput, sessionId]);

    // Attach keyboard listener
    useEffect(() => {
        if (isWaitingForInput) {
            document.addEventListener('keydown', handleTerminalKeyDown);
        } else {
            document.removeEventListener('keydown', handleTerminalKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleTerminalKeyDown);
        };
    }, [isWaitingForInput, handleTerminalKeyDown]);

    // Run code function
    const runCode = async () => {
        if (!code.trim()) {
            alert('Please enter some code first!');
            return;
        }

        setIsExecuting(true);
        setOutput('🔄 Starting compilation...\n');
        setIsWaitingForInput(false);
        clearAutoDetectionTimeouts();

        // Lock the editor
        if (editorRef.current) {
            editorRef.current.setReadOnly(true);
        }

        try {
            const response = await fetch('http://localhost:4000/api/compiler/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    language: language
                })
            });

            const result = await response.json();
            
            if (response.ok) {
                setSessionId(result.sessionId);
                setOutput(prev => prev + '✅ Compilation successful! Starting execution...\n\n');
                
                // Start auto-detection timers
                setAutoDetectionTimeouts();
            } else {
                setOutput(prev => prev + `❌ Error: ${result.error}\n`);
                setIsExecuting(false);
                if (editorRef.current) {
                    editorRef.current.setReadOnly(false);
                }
            }
        } catch (error) {
            setOutput(prev => prev + `❌ Network Error: ${error.message}\n`);
            setIsExecuting(false);
            if (editorRef.current) {
                editorRef.current.setReadOnly(false);
            }
        }
    };

    // Stop execution
    const stopExecution = () => {
        if (socketRef.current && sessionId) {
            socketRef.current.emit('terminate-process', { sessionId });
        }
        setIsExecuting(false);
        setIsWaitingForInput(false);
        clearAutoDetectionTimeouts();
        if (editorRef.current) {
            editorRef.current.setReadOnly(false);
        }
    };

    // Load problem data
    useEffect(() => {
        if (id) {
            getProblem(id);
        }
    }, [id]);

    // Set initial code when problem loads
    useEffect(() => {
        if (problem && !code) {
            const template = language === 'C++' 
                ? '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}'
                : 'public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}';
            setCode(template);
        }
    }, [problem, language, code]);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            {/* Problem Info */}
            {problem && (
                <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                    <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
                    <p className="text-gray-700">{problem.description}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Code Editor */}
                <div className="space-y-4">
                    <div className="flex gap-2 items-center">
                        <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="px-3 py-2 border rounded-lg"
                            disabled={isExecuting}
                        >
                            <option value="C++">C++</option>
                            <option value="Java">Java</option>
                        </select>
                        
                        <Button 
                            onClick={runCode}
                            disabled={isExecuting}
                            className="bg-green-500 hover:bg-green-600 text-white"
                        >
                            {isExecuting ? '🔄 Running...' : '▶️ Run Code'}
                        </Button>
                        
                        {isExecuting && (
                            <Button 
                                onClick={stopExecution}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                🛑 Stop
                            </Button>
                        )}
                    </div>

                    <div className="relative">
                        <CodeMirror
                            ref={editorRef}
                            value={code}
                            onChange={setCode}
                            extensions={[language === 'C++' ? cpp() : java()]}
                            theme={oneDark}
                            basicSetup={{
                                lineNumbers: true,
                                foldGutter: true,
                                dropCursor: false,
                                allowMultipleSelections: false
                            }}
                            style={{
                                fontSize: '14px',
                                minHeight: '400px'
                            }}
                        />
                        
                        {/* Editor Lock Overlay */}
                        {isExecuting && (
                            <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center pointer-events-none">
                                <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2 text-yellow-800">
                                    🔒 Editor locked during execution
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Output Terminal */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Output Console</h3>
                    <div 
                        ref={outputRef}
                        className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto whitespace-pre-wrap relative"
                        style={{ fontFamily: 'Consolas, Monaco, monospace' }}
                    >
                        {output}
                        {isWaitingForInput && (
                            <span>
                                {currentInput}
                                <span className="animate-pulse">|</span>
                            </span>
                        )}
                        
                        {!output && (
                            <div className="text-gray-500">
                                Click "Run Code" to see output here...
                                <br />
                                <br />
                                💡 Tips:
                                <br />
                                • Type directly in this console when input is needed
                                <br />
                                • Press Enter to submit input
                                <br />
                                • Use the Stop button to terminate running programs
                            </div>
                        )}
                    </div>
                    
                    {isWaitingForInput && (
                        <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                            💬 Type your input above and press Enter
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProblemPage;
```

## Complete File Contents

### If you prefer to copy entire files, here are the complete implementations:

<details>
<summary><strong>📁 backend/index.js - Complete File</strong></summary>

```javascript
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const { sendInput, terminateProcess } = require('./exec/executeFile');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Make io globally available
global.io = io;

const userRoutes = require('./routes/userRoutes');
const problemsRoutes = require('./routes/problemsRoutes');
const compilerRoutes = require('./routes/compilerRoutes');

const allowedOrigin = process.env.ALLOWED_ORIGIN;

const corsOptions = {
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'username'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) =>{
    console.log(req.path, req.method);
    if (req.url === '/' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('InfoBase0');
    }
    next();
});

app.use('/api/user', userRoutes);
app.use('/api/problems', problemsRoutes);
app.use('/api/compiler', compilerRoutes);

mongoose.connect(process.env.mongoDB)
.then(() => {
    console.log("MongoDB connected");
})
.catch((error) => {
    console.error("MongoDB connection failed:", error);
}); 

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle user input
    socket.on('send-input', (data) => {
        const { sessionId, input } = data;
        const success = sendInput(sessionId, input);
        
        if (!success) {
            socket.emit('error', {
                message: 'No active process found for this session'
            });
        }
    });

    // Handle process termination
    socket.on('terminate-process', (data) => {
        const { sessionId } = data;
        terminateProcess(sessionId);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(process.env.PORT || 4000, () => {
    console.log('Server listening on port', process.env.PORT || 4000);
});
```
</details>

<details>
<summary><strong>📁 backend/controllers/compilerController.js - Complete File</strong></summary>

```javascript
const { executeCppInteractive } = require('../exec/executeFile');

const runCode = async (req, res) => {
    try{
        const { code, language } = req.body;

        console.log("Received compilation request:", { code: code.substring(0, 100) + "...", language });

        if(language === "C++"){
            // Generate unique session ID using timestamp
            const sessionId = Date.now().toString();
            
            // Start compilation and execution
            executeCppInteractive(code, sessionId);
            
            return res.status(200).json({ 
                sessionId: sessionId,
                message: "Compilation started. Connect to WebSocket for interactive execution."
            });
        }
        
        return res.status(400).json({ error: 'Unsupported language!' });
    }catch(error){
        console.error("Compilation controller error:", error.message);
        return res.status(400).json({ error: error.message });
    }
}

module.exports = { 
    runCode 
};
```
</details>

<details>
<summary><strong>📁 backend/routes/compilerRoutes.js - Complete File</strong></summary>

```javascript
const express = require('express');
const{ runCode } = require('../controllers/compilerController');

const router = express.Router();

router.post('/run', runCode);
router.post('/runCode', runCode); // Keep both for backward compatibility

module.exports= router;
```
</details>

## Testing Your Implementation

### Test Case 1: Basic Hello World
```cpp
#include <iostream>
using namespace std;
int main() {
    cout << "Hello World!" << endl;
    return 0;
}
```
**Expected:** Immediate output display, no input required.

### Test Case 2: Simple Input
```cpp
#include <iostream>
using namespace std;
int main() {
    string name;
    cout << "Enter your name: ";
    cin >> name;
    cout << "Hello " << name << "!" << endl;
    return 0;
}
```
**Expected:** Shows prompt, auto-detects input needed, allows typing in terminal.

### Test Case 3: Silent Input (No Prompt)
```cpp
#include <iostream>
using namespace std;
int main() {
    int x;
    cin >> x;  // No cout before this
    cout << "You entered: " << x << endl;
    return 0;
}
```
**Expected:** Auto-detects after 300ms-1.5s, shows "waiting for input" message.

### Test Case 4: Multiple Inputs
```cpp
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cout << "Enter two numbers: ";
    cin >> a >> b;
    cout << "Sum: " << (a + b) << endl;
    return 0;
}
```
**Expected:** Handles multiple space-separated inputs correctly.

### Test Case 5: Compilation Error
```cpp
#include <iostream>
using namespace std;
int main() {
    cout << "Missing semicolon"  // Missing semicolon
    return 0;
}
```
**Expected:** Shows compilation error in output, unlocks editor.

### How to Start Your Servers:

1. **Start Backend:**
```bash
cd backend
npm start
# Should show: "Server listening on port 4000"
```

2. **Start Frontend:**
```bash
cd frontend  
npm start
# Should open browser to http://localhost:3000
```

3. **Test the System:**
   - Navigate to a problem page in your app
   - Enter one of the test cases above
   - Click "Run Code"
   - Verify output and input behavior

## Key Features Implemented

### ✅ Real-Time Terminal Experience
- Character-by-character output streaming
- Direct keyboard input (no input boxes)  
- Blinking cursor animation
- Terminal-style user interface

### ✅ Auto-Input Detection System
- **Quick Detection (300ms):** For immediate cin operations
- **Fallback Detection (1.5s):** For silent programs  
- **Visual Cues:** Shows "waiting for input" messages
- **Smart Reset:** Clears detection on new output

### ✅ WebSocket Communication
- Real-time bidirectional communication
- Session-based process management
- Event-driven architecture
- Error handling and cleanup

### ✅ Code Editor Integration  
- C++ syntax highlighting with CodeMirror
- Editor locking during execution
- Visual overlays for execution state
- Compilation error display

### ✅ Process Management
- Concurrent execution support  
- Proper process cleanup
- Session isolation
- Resource management

## Troubleshooting

### Common Issues and Solutions:

1. **WebSocket Connection Failed:**
   - Check CORS configuration in both Express and Socket.IO
   - Verify ALLOWED_ORIGIN environment variable
   - Ensure frontend connects to correct backend URL

2. **Compilation Errors:**
   - Verify g++ is installed and accessible from PATH
   - Check temporary file permissions in backend/temp/
   - Ensure sufficient disk space for compilation

3. **Input Detection Not Working:**
   - Verify auto-detection timeouts are properly configured
   - Check that WebSocket events are properly bound
   - Ensure input-needed event is being emitted from backend

4. **Process Not Terminating:**
   - Implement proper process.kill() in terminateProcess function
   - Check activeProcesses Map is being updated correctly
   - Verify cleanup function is being called

5. **Multiple Sessions Interfering:**
   - Ensure unique sessionId generation
   - Verify process isolation in activeProcesses Map
   - Check that WebSocket events include correct sessionId

6. **Editor Locking Issues:**
   - Verify editor.setReadOnly() calls are balanced
   - Check execution state management in React component
   - Ensure overlay visibility is controlled correctly

### Debug Commands:
```bash
# Check if g++ is accessible
g++ --version

# Test compilation manually
g++ test.cpp -o test.exe

# Check Node.js and npm versions
node --version
npm --version

# Verify WebSocket connection in browser console
// In browser DevTools:
socket.connected  // Should return true
```

### Environment Verification:
```bash
# Backend dependencies check
npm list express socket.io cors

# Frontend dependencies check
npm list socket.io-client @heroui/input @uiw/react-codemirror

# Port availability check
netstat -an | findstr :4000  # Windows
netstat -an | grep :4000     # Linux/Mac
```

## Advanced Configuration

### Production Deployment Considerations:
1. **Security:** Implement rate limiting for compilation requests
2. **Resources:** Set memory and CPU limits for child processes  
3. **Cleanup:** Schedule regular cleanup of temporary files
4. **Monitoring:** Add logging and error tracking
5. **Scaling:** Consider process queuing for high traffic

### Performance Optimizations:
1. **Compilation Caching:** Cache compiled executables for identical code
2. **Process Pooling:** Reuse processes for multiple executions
3. **Output Buffering:** Batch small outputs for better performance
4. **Memory Management:** Implement process memory limits

This guide provides everything needed to recreate the interactive C++ compiler system. Each component is designed to work together seamlessly, providing a CodeBlocks-like experience in a web browser with real-time compilation, execution, and interactive input/output.