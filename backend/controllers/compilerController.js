const { executeCpp } = require('../exec/executeFile');

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

module.exports = { 
    runCode 
};