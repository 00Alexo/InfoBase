const userModel = require('../models/userModel');
const problemsModel = require('../models/problemsModel');

const createProblem = async (req, res) => {
    try{
        let errorFields = [];
        const {title, creator, description, difficulty, tags, cerinta, DateDeIntrare, DateDeIesire, 
            Restrictii, Precizari, Exemple, Teste, timeout} = req.body;

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
        if(!timeout || timeout < 50 || timeout > 20000){
            console.log(timeout);
            errorFields.push('timeout');
            return res.status(400).json({error: 'A valid timeout is required!', errorFields});
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
            timeout,
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

const getSubmissions = async (req, res) => {
    try{
        const { username, problemId } = req.query;

        if(!username){
            return res.status(400).json({ error: 'Username is required!' });
        }
        if(!problemId){
            return res.status(400).json({ error: 'Problem ID is required!' });
        }

        const user = await userModel.findOne({ username: username.toLowerCase() });

        if(!user){
            return res.status(400).json({ error: 'User not found!' });
        }

        const submissions = user.submissions.filter(sub => sub.problemId.toString() === problemId.toString());

        return res.status(200).json({ submissions });
    }catch(error){
        console.error(error.message);
        return res.status(400).json(error.message);
    }
}

const getSolutions = async (req, res) =>{
    try{
        const { problemId } = req.query;

        if(!problemId){
            return res.status(400).json({ error: 'Problem ID is required!' });
        }

        const problem = await problemsModel.findOne({ uniqueId: problemId });

        if(!problem){
            return res.status(400).json({ error: 'Problem not found!' });
        }

        const solutions = problem.solutions || [];

        return res.status(200).json({ solutions });
    }catch(error){
        console.error(error.message);
        return res.status(400).json(error.message);        
    }
}

const getProblems = async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1; // current page, default to 1
        const limit = parseInt(req.query.limit) || 20; // problems per page, default to 20
        const skip = (page - 1) * limit; // calculate how many to skip

        // Extract filter parameters from query
        const { search, tags, classes, difficulty, sortBy } = req.query;
        
        // Build MongoDB filter object (start with accepted: true)
        let filter = { accepted: true };
        
        // Search filter (title, description, creator)
        if (search && search.trim()) {
            filter.$or = [
                { title: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } },
                { creator: { $regex: search.trim(), $options: 'i' } }
            ];
        }
        
        // Difficulty filter
        if (difficulty && difficulty.trim()) {
            filter.difficulty = difficulty.trim();
        }
        
        // Tags and classes filter
        const tagFilters = [];
        
        // Handle topic tags (non-class tags)
        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : [tags];
            tagArray.forEach(tag => {
                if (tag.trim()) {
                    tagFilters.push({
                        "tags": {
                            $elemMatch: {
                                "name": tag.trim(),
                                "class": { $ne: true }
                            }
                        }
                    });
                }
            });
        }
        
        // Handle class tags
        if (classes) {
            const classArray = Array.isArray(classes) ? classes : [classes];
            classArray.forEach(className => {
                if (className.trim()) {
                    tagFilters.push({
                        "tags": {
                            $elemMatch: {
                                "name": className.trim(),
                                "class": true
                            }
                        }
                    });
                }
            });
        }
        
        // Add tag filters to main filter
        if (tagFilters.length > 0) {
            filter.$and = tagFilters;
        }

        // Build sort object
        let sort = { createdAt: -1 }; // Default: newest first
        
        if (sortBy) {
            switch (sortBy) {
                case 'oldest':
                    sort = { createdAt: 1 };
                    break;
                case 'title':
                    sort = { title: 1 };
                    break;
                case 'difficulty':
                    // Custom sort: Easy, Medium, Hard
                    sort = { difficulty: 1, createdAt: -1 };
                    break;
                case 'newest':
                default:
                    sort = { createdAt: -1 };
                    break;
            }
        }

        console.log("Applied filter:", JSON.stringify(filter, null, 2));
        console.log("Applied sort:", JSON.stringify(sort, null, 2));

        // Get total count for pagination info with filters applied
        const totalProblems = await problemsModel.countDocuments(filter);
        const totalPages = Math.ceil(totalProblems / limit);

        // Get paginated problems with filters and sorting
        const problems = await problemsModel.find(filter)
            .select('-Teste -solutions')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        return res.status(200).json({ 
            problems,
            pagination: {
                currentPage: page,
                totalPages,
                totalProblems,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                limit
            },
            filters: {
                search,
                tags,
                classes,
                difficulty,
                sortBy
            }
        });
    }catch(error){
        console.error(error.message);
        return res.status(400).json(error.message);
    }
}

const acceptAllProblems = async (req, res) => {
    try{
        const { creator } = req.body;

        if(creator !== "alex")
            return res.status(400).json({ error: 'Unauthorized!' });

        await problemsModel.updateMany({ accepted: false }, { $set: { accepted: true } });

        res.status(200).json({ message: 'All problems accepted successfully!' });
    }catch(error){
        console.error(error.message);
        return res.status(400).json(error.message);  
    }
}

module.exports= {
    createProblem,
    getProblem,
    getSubmissions,
    getSolutions,
    getProblems,
    acceptAllProblems
};