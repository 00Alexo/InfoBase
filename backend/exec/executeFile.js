const { execSync, exec, spawn } = require("child_process");
const fs = require('fs').promises;
const path = require('path');

const activeProcesses = new Map(); // map pentru procesele active

const executeCpp = async (code, sessionId) => {
    const tempDir = path.join(__dirname, '../temp'); // gasim folderu temp
    const sourceFile = path.join(tempDir, `${sessionId}.cpp`); // calea catre viitoru fisier.cpp
    const executableFile = path.join(tempDir, `${sessionId}.exe`); // calea catre viitoru fisier.exe

    try {
        await fs.mkdir(tempDir, { recursive: true }); //facem folderu temp

        await fs.writeFile(sourceFile, code); //scriem codu in fisier

        const compileProcess = spawn('g++', [sourceFile, '-o', executableFile, '-std=c++17']); // compilam codu si salvam procesu

        let compileError = '';
        compileProcess.stderr.on('data', (data) => {
            compileError += data.toString();
        }); // prindem eroarea de compilare in cazul in care exista

        compileProcess.on('close', (code) => {
            if(code !== 0){
                global.io.emit('compilation-error', { // emit la client eroarea de compilare
                    sessionId,
                    error: compileError || 'Compilation failed'
                });
                cleanup(sourceFile, executableFile);
                return; // iesim daca a fost eroare la compilare
            }

            const runProcess = spawn(executableFile, [], {
                stdio: ['pipe', 'pipe', 'pipe']
            }); // rulam codu compilat

            let programFinished = false; // flag pentru a urmari daca programu s-a terminat

            activeProcesses.set(sessionId, {
                process: runProcess,
                sourceFile,
                executableFile
            }); // salvam procesu activ cu fisieru sursa si executabilu

            // Timeout de 20 secunde
            const timeoutId = setTimeout(() => {
                if (!programFinished) {
                    programFinished = true;
                    runProcess.kill('SIGKILL'); // terminam fortat procesu
                    
                    global.io.emit('program-error', {
                        sessionId,
                        error: 'TIME_LIMIT_EXCEEDED: Program terminated after 20 seconds'
                    }); // emit timeout error la client
                    
                    global.io.emit('program-finished', {
                        sessionId,
                        exitCode: -1
                    }); // emit la client ca programu s-a terminat
                    
                    activeProcesses.delete(sessionId);
                    cleanup(sourceFile, executableFile);
                }
            }, 20000); // 20 secunde timeout

            runProcess.stdout.on('data', (data) => {
                global.io.emit('program-output', {
                    sessionId,
                    output: data.toString()
                });
            }); // prindem outputu normal si il trimitem pe frontend

            runProcess.stderr.on('data', (data) => {
                global.io.emit('program-error', { // emit la client eroarea de runtime
                    sessionId,
                    error: data.toString()
                });
            });

            runProcess.on('close', (code) => {
                if (!programFinished) {
                    programFinished = true;
                    clearTimeout(timeoutId); // clear timeout daca programu se termina normal
                    
                    global.io.emit('program-finished', {
                        sessionId,
                        exitCode: code
                    }); // emit la client ca programu s-a terminat
                    
                    activeProcesses.delete(sessionId);
                    cleanup(sourceFile, executableFile);
                }
            });

            runProcess.on('error', (error) => {
                if (!programFinished) {
                    programFinished = true;
                    clearTimeout(timeoutId); // clear timeout daca e eroare
                    
                    global.io.emit('program-error', { // emit la client eroarea de runtime
                        sessionId,
                        error: error.message
                    });
                    
                    activeProcesses.delete(sessionId); // scoatem procesu din lista de active
                    cleanup(sourceFile, executableFile); // stergem fisierele temporare
                }
            });

            global.io.emit('program-started', { // emit la client ca programu a pornit si poate trimite input
                sessionId,
                message: 'Program is running. You can now provide input.'
            });
        })
        
    } catch (error) {
        global.io.emit('compilation-error', { // emit la client eroarea de compilare
            sessionId,
            error: error.message
        });
        cleanup(sourceFile, executableFile); // stergem fisierele temporare
    }
}

const testCpp = async (code, tests, timeLimit) => {
    const results = [];

    for(let i = 0; i<tests.length; i++){
        const test = tests[i];
        const sessionId = Date.now().toString() + '_test_' + i;
        const tempDir = path.join(__dirname, '../temp');
        const sourceFile = path.join(tempDir, `${sessionId}.cpp`);
        const executableFile = path.join(tempDir, `${sessionId}.exe`);

        try{
            await fs.mkdir(tempDir, { recursive: true });
            await fs.writeFile(sourceFile, code);

            const compileResult = await new Promise((resolve) =>{
                const compileProcess = spawn('g++', [sourceFile, '-o', executableFile, '-std=c++17']);
                let compileError = '';

                compileProcess.stderr.on('data', (data) => {
                    compileError += data.toString();
                });

                compileProcess.on('close', (code) => {
                    resolve({
                        success: code === 0,
                        error: compileError
                    });
                });
            });

            if (!compileResult.success) {
                results.push({
                    testCase: i + 1,
                    status: 'COMPILATION_ERROR',
                    error: compileResult.error,
                    executionTime: 0
                });
                cleanup(sourceFile, executableFile);
                continue;
            }

            const startTime = Date.now();
            const executionResult = await new Promise((resolve) =>{
                const runProcess = spawn(executableFile, [], {
                    stdio: ['pipe', 'pipe', 'pipe']
                });

                let output = '';
                let error = '';
                let finished = false;

                const timeout = setTimeout(() => {
                    if (!finished) {
                        runProcess.kill();
                        resolve({
                            output: output,
                            error: 'Time Limit Exceeded',
                            exitCode: -1,
                            timeout: true
                        });
                    }
                }, timeLimit);

                runProcess.stdout.on('data', (data) =>{
                    output += data.toString();
                })

                runProcess.stderr.on('data', (data) =>{
                    error += data.toString();
                })

                runProcess.on('close', (code) =>{
                    finished = true;
                    clearTimeout(timeout);
                    resolve({
                        output: output,
                        error: error,
                        exitCode: code,
                        timeout: false
                    });
                })

                runProcess.on('error', (err) => {
                    finished = true;
                    clearTimeout(timeout);
                    resolve({
                        output: output,
                        error: err.message,
                        exitCode: -1,
                        timeout: false
                    });
                });

                if(test.input || test.intrare){
                    runProcess.stdin.write((test.input || test.intrare) + '\n');
                }

                runProcess.stdin.end();
            });

            const executionTime = Date.now() - startTime;
            const expectedOutput = (test.output || test.iesire).trim();
            const actualOutput = executionResult.output.trim();
            
            let status;
            if (executionResult.timeout) {
                status = 'TIME_LIMIT_EXCEEDED';
            } else if (executionResult.exitCode !== 0) {
                status = 'RUNTIME_ERROR';
            } else if (actualOutput === expectedOutput) {
                status = 'ACCEPTED';
            } else {
                status = 'WRONG_ANSWER';
            }

            console.log(`Test Case ${i + 1}: Expected "${expectedOutput}", Got "${actualOutput}", Status: ${status}`);
            results.push({
                testCase: i + 1,
                status: status,
                error: executionResult.error || null,
                executionTime: executionTime
            });

            cleanup(sourceFile, executableFile);
        }catch(error){
            results.push({
                testCase: i + 1,
                status: 'SYSTEM_ERROR',
                error: error.message,
                executionTime: 0
            });
            cleanup(sourceFile, executableFile);
        }
    }
    
    return results;
}

const sendInput = async (sessionId, input) => {
    const processData = activeProcesses.get(sessionId); // luam procesu activ dupa sessionId
    if(processData && processData.process){ // daca procesu exista
        processData.process.stdin.write(input + '\n'); // trimitem inputu la proces
        return true; // returnam true la index.js
    }
    return false; // returnam false la index.js
}

const terminateProcess = (sessionId) => {
    const processData = activeProcesses.get(sessionId); // luam procesu activ dupa sessionId   
    if (processData) {
        processData.process.kill('SIGKILL'); // terminam procesu cu force kill
        activeProcesses.delete(sessionId); // scoatem procesu din lista de active
        cleanup(processData.sourceFile, processData.executableFile); // stergem fisierele temporare
        return true; // returnam true la index.js
    }
    return false; // returnam false la index.js
}

const cleanup = async (sourceFile, executableFile) => {
    try{
        await fs.unlink(sourceFile).catch(() => {}); // stergem fisieru sursa
        await fs.unlink(executableFile).catch(() => {}); // stergem fisieru executabil
    }catch(error){
        console.error('Cleanup error:', error);
    }
}

module.exports = {
    executeCpp,
    cleanup,
    sendInput,
    terminateProcess,
    testCpp
};