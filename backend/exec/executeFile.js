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

            activeProcesses.set(sessionId, {
                process: runProcess,
                sourceFile,
                executableFile
            }); // salvam procesu activ cu fisieru sursa si executabilu

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
                global.io.emit('program-finished', {
                    sessionId,
                    exitCode: code
                }); // emit la client ca programu s-a terminat
                
                activeProcesses.delete(sessionId);
                cleanup(sourceFile, executableFile);
            });

            runProcess.on('error', (error) => {
                global.io.emit('program-error', { // emit la client eroarea de runtime
                    sessionId,
                    error: error.message
                });
                
                activeProcesses.delete(sessionId); // scoatem procesu din lista de active
                cleanup(sourceFile, executableFile); // stergem fisierele temporare
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
        processData.process.kill(); // terminam procesu
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
    terminateProcess
};