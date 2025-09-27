const { executeCpp, testCpp } = require('../exec/executeFile');
const problemsModel = require('../models/problemsModel');
const userModel = require('../models/userModel');

const runCode = async (req, res) =>{
    try{
        const { code, language } = req.body;
        const sessionId = Date.now().toString();

        console.log(code, language)

        if(language === "C++"){
            await executeCpp(code, sessionId);
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

    if (language !== "C++") {
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

    const results = await testCpp(code, teste, timeLimit);

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
        score: totalScore,
        results: resultsWithScore,
        solution: code
    }

    await problemsModel.findOneAndUpdate(
        { uniqueId: problemId },
        { $push: { solutions: problemSolution } }
    );

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