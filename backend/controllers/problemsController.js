const userModel = require('../models/userModel');
const problemsModel = require('../models/problemsModel');

const createProblem = async (req, res) => {
    try{
        let errorFields = [];
        const {title, creator, description, difficulty, tags, cerinta, DateDeIntrare, DateDeIesire, Restrictii, Precizari, Exemple, Teste} = req.body;

        if(!title){
            errorFields.push('title');
            return res.status(400).json({error: 'Title is required!', errorFields});
        }
        if(!description){
            errorFields.push('description');
            return res.status(400).json({error: 'Description is required!', errorFields});
        }
        if(!difficulty){
            errorFields.push('difficulty');
            return res.status(400).json({error: 'Difficulty is required!', errorFields});
        }
        if(!tags || tags.length === 0){
            errorFields.push('tags');
            return res.status(400).json({error: 'At least one tag is required!', errorFields});
        }
        if(!cerinta){
            errorFields.push('cerinta');
            return res.status(400).json({error: 'Cerinta is required!', errorFields});
        }
        if(!DateDeIntrare){
            errorFields.push('DateDeIntrare');
            return res.status(400).json({error: 'DateDeIntrare is required!', errorFields});
        }
        if(!DateDeIesire){
            errorFields.push('DateDeIesire');
            return res.status(400).json({error: 'DateDeIesire is required!', errorFields});
        }
        console.log(Exemple)
        if(!Exemple || Exemple.length === 0){
            errorFields.push('Exemple');
            return res.status(400).json({error: 'At least one example is required!', errorFields});
        }
        if(!Teste || Teste.length < 3){
            errorFields.push('Teste');
            return res.status(400).json({error: 'At least 3 tests are required!', errorFields});
        }

        const checkProblem = await problemsModel.findOne({title});

        if(checkProblem){
            return res.status(400).json({error: 'A problem with this title already exists!'});
        }

        const username = await userModel.findOne({username: creator.toLowerCase()});

        if(!username){
            return res.status(400).json({error: 'Invalid username!'});
        }
        
        const lastProblem = await problemsModel.findOne().sort({ _id: -1 });

        let uniqueId = 0;
        if(lastProblem){
            uniqueId = lastProblem.uniqueId + 1;
        }

        const newProblem = new problemsModel({
            title,
            creator,
            description,
            uniqueId,
            difficulty,
            tags,
            cerinta,
            DateDeIntrare,
            DateDeIesire,
            Restrictii,
            Precizari,
            Exemple,
            Teste,
            official: false,
            accepted: false
        });

        await newProblem.save();

        return res.status(201).json(newProblem);
    }catch(error){
        console.error(error.message);
        return res.status(400).json(error.message);
    }
}

const getProblem = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        const problem = await problemsModel.findOne({ uniqueId });

        if (!problem) {
            return res.status(404).json({ error: 'Problem not found!' });
        }

        return res.status(200).json(problem);
    } catch (error) {
        console.error(error.message);
        return res.status(400).json(error.message);
    }
}

module.exports= {
    createProblem,
    getProblem
};