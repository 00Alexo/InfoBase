const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema
.is().min(7)
.has().uppercase()
.has().lowercase()
.has().digits(2)

const createToken = (_id) =>{
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

const signup = async (req, res) => {
    try{
        const {username, password, confirmPassword, email} = req.body;
        const saltRounds = 12; let errorFields = [];

        if (!username) errorFields.push({field: "username", error: "This field is required!"});
        if (!password) errorFields.push({field: "pass", error: "This field is required!"});
        if (!confirmPassword) errorFields.push({field: "cpass", error: "This field is required!"});
        if (!email) errorFields.push({field: "email", error: "This field is required!"});

        if (errorFields.length > 0) {
            return res.status(400).json({error: 'All fields are required!', errorFields: errorFields});
        }

        if(!schema.validate(password)){
            errorFields.push({field: "pass", error: "Requires 7 characters, 1 uppercase letter and 2 digits!"});
            errorFields.push({field: "cpass", error: ""});
            return res.status(400).json({error: 'Requires 7 characters, 1 uppercase letter and 2 digits!', errorFields: errorFields})
        }

        if(password !== confirmPassword){
            errorFields.push({field: "pass", error: "Passwords do not match!"});
            errorFields.push({field: "cpass", error: ""});
            return res.status(400).json({error:"Passwords do not match", errorFields: errorFields});
        }

        const existingUser = await userModel.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
        if(existingUser){
            errorFields.push({field: "username", error: "Username is already taken!"});
            return res.status(400).json({ error: 'Username is already taken!', errorFields: errorFields});
        }

        if(!email.includes('@') && !email.includes('+') && !email.includes('%')){
            errorFields.push({field: "email", error: "Invalid email!"});
            return res.status(400).json({error:"Invalid email!", errorFields: errorFields});
        }

        if(!/^[a-zA-Z0-9.]*$/.test(username)){
            errorFields.push({field: "username", error: "Username can only contain English alphabet letters!"});
            return res.status(400).json({error: 'Username can only contain English alphabet letters!', errorFields: errorFields});
        }

        const existingEmail = await userModel.findOne({email})
        if(existingEmail){
            errorFields.push({field: "email", error: "Email is already in use!"});
            return res.status(400).json({error:'Email is already in use!', errorFields: errorFields})
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userData = {
            username: username.toLowerCase(),
            email,
            password: hashedPassword,
        }

        const user = await userModel.create(userData);
        const token = createToken(user._id);
        res.status(200).json({username:userData.username, token});
    }catch(error){
        console.error(error.message);
        return res.status(400).json(error.message);
    }
}

const signin = async (req, res) => {
    try{
        const {username, password} = req.body;
        let errorFields = [];

        if (!username) errorFields.push({field: "username", error: "This field is required!"});
        if (!password) errorFields.push({field: "pass", error: "This field is required!"});
    
        if (errorFields.length > 0) {
            return res.status(400).json({error: 'All fields are required!', errorFields: errorFields});
        }

        let emailValidator = req.body.username.split("");
        let isEmail = false;
        for (let i =0; i < emailValidator.length; i++) {
            if(emailValidator[i] == '@' || emailValidator[i] == '+' || emailValidator[i] == '%'){
                isEmail = true;
                break;
            }
        }

        let user;
        if(isEmail)
            user = await userModel.findOne({email: username});
        else
            user = await userModel.findOne({username: username.toLowerCase()});

        if(user){
            const passMatch = await bcrypt.compare(password, user.password);

            if(passMatch){
                const token = createToken(user._id)

                res.status(200).json({username:user.username, token});
            }
            else{
                errorFields.push({field: "pass", error: "Invalid password!"});
                return res.status(400).json({error: 'Invalid password!', errorFields});
            }
        }
        else
            return res.status(400).json({error: 'Account does not exist!', errorFields: [{field:"username", error:"This account does not exist!"}]} );
    }catch(error){
        console.error(error.message);
        return res.status(400).json(error.message);        
    }
}

const getProfile = async (req, res) => {
    try{
        const { username } = req.params;

        if (!username) { 
            return res.status(400).json({ error: 'Invalid User.' });
        }

        const user = await userModel.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } }).select('-password -email');

        if(!user){
            res.status(400).json({ error: "Invalid User."});
        }

        res.status(200).json(user);

    }catch(error){
        console.error(error.message);
        return res.status(400).json(error.message);       
    }
}

const editProfile = async (req, res) =>{
    try{
        const { username } = req.params;
        const { bio, location, website, github, linkedin, gender } = req.body;

        const user = await userModel.findOneAndUpdate(
            { username: { $regex: new RegExp(`^${username}$`, 'i') } },
            { bio, location, website, github, linkedin, gender },
            { new: true }
        );

        if (!user) {
            return res.status(400).json({ error: "Invalid User." });
        }

        res.status(200).json(user);

    }catch(error){
        console.error(error.message);
        return res.status(400).json(error.message);          
    }
}

const editProfilePicture = async (req, res) => {
    try{
        const { username, profilePicture } = req.body;

        if(!username)
            return res.status(400).json({ error: "Invalid User." });

        if(!profilePicture)
            return res.status(400).json({error: 'Invalid profile picture'});
        const user = await userModel.findOneAndUpdate(
            { username: { $regex: new RegExp(`^${username}$`, 'i') } },
            { profilePicture },
            { new: true }
        );

        if (!user) {
            return res.status(400).json({ error: "Invalid User." });
        }

        res.status(200).json(user);
    }catch(error){
        console.error(error.message);
        return res.status(400).json(error.message);    
    }
}

module.exports = {
    signup,
    signin,
    getProfile,
    editProfile,
    editProfilePicture
}