const { executeCpp, testCpp, executeJava, testJava, executePython, testPython } = require('../exec/executeFile');
const problemsModel = require('../models/problemsModel');
const userModel = require('../models/userModel');
const achievementManager = require('../managers/achievementManager');

const runCode = async (req, res) =>{
    try{
        const { code, language, userId } = req.body;
        const sessionId = Date.now().toString() + '_' + Math.random().toString(36).substring(2, 15);

        let targetSocket = null;

        if (userId) {
            targetSocket = global.userSockets.get(userId);
        }

        if (!targetSocket) {
            return res.status(400).json({ error: 'WebSocket connection not found. Please refresh the page.' });
        }

        global.socketSessions.set(sessionId, targetSocket.id);

        console.log(code, language)

        if(language === "C++"){
            await executeCpp(code, sessionId, targetSocket);
            return res.status(200).json({ sessionId: sessionId });
        }else if(language === "Java"){
            await executeJava(code, sessionId, targetSocket);
            return res.status(200).json({ sessionId: sessionId });
        }else if(language === "Python"){
            await executePython(code, sessionId, targetSocket);
            return res.status(200).json({ sessionId: sessionId });
        }
        
        return res.status(400).json({ error: 'Unsupported language!' });
    }catch(error){
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
}  

const submitCode = async (req, res) =>{
    const { code, language, problemId, username } = req.body;

    if (language !== "C++" && language !== "Java" && language !== "Python") {
        return res.status(400).json({ error: 'Unsupported language!' });
    }

    if(!username){
        return res.status(400).json({ error: 'User not authenticated!' });
    }

    const user = await userModel.findOne({username: username.toLowerCase()});

    if(!user){
        return res.status(400).json({ error: 'User not found!' });
    }

    const problemData = await problemsModel.findOne({ uniqueId: problemId });

    if(!problemData){
        return res.status(400).json({ error: 'Invalid problem' });
    }

    const teste = problemData.Teste;

    if(!teste || teste.length === 0){
        return res.status(400).json({ error: 'No test cases available for this problem' });
    }

    console.log(`${teste.length} for: ${problemId}`);

    const timeLimit = problemData.timeout || 5000;

    let results

    if(language === "C++"){
        results = await testCpp(code, teste, timeLimit);
    }else if(language === "Java"){
        results = await testJava(code, teste, timeLimit);
    }else if(language === "Python"){
        results = await testPython(code, teste, timeLimit);
    }

    const totalTests = results.length;
    const passedTests = results.filter(r => r.status === 'ACCEPTED').length;
    const scorePerTest = Math.round(100 / totalTests);
    const totalScore = Math.round(passedTests * scorePerTest);

    const resultsWithScore = results.map(result => ({
        ...result,
        scorePerTest: result.status === 'ACCEPTED' ? scorePerTest : 0
    }));

    const userSubmission = {
        problemId: problemId,
        date: new Date(),
        score: totalScore,
        difficulty: problemData.difficulty,
        language: language,
        results: resultsWithScore,
        solution: code
    }

    await userModel.findOneAndUpdate(
        {username: username.toLowerCase()}, 
        { $push: { submissions: userSubmission } }
    );

    const problemSolution = {
        username: username.toLowerCase(),
        date: new Date(),
        difficulty: problemData.difficulty,
        score: totalScore,
        results: resultsWithScore,
        language: language,
        solution: code
    }

    await problemsModel.findOneAndUpdate(
        { uniqueId: problemId },
        { $push: { solutions: problemSolution } }
    );

    const problemSolved = user.solvedProblems.find(p => p.problemId === problemId);

    if(!problemSolved && totalScore === 100){
        user.solvedProblems.push({ problemId: problemId, date: new Date(), tags: problemData.tags, language: language });
        await user.save();
    }

    const achievementMgr = new achievementManager(user);

    if(!problemSolved && totalScore === 100){
        await achievementMgr.onProblemSolved();  
    }

    return res.status(200).json({
        success: true,
        totalTests: totalTests,
        passedTests: passedTests,
        score: totalScore,
        scorePerTest: scorePerTest,
        results: resultsWithScore,
        message: `Passed ${passedTests}/${totalTests} test cases`
    });
}

module.exports = { 
    runCode,
    submitCode 
};