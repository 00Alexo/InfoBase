const express = require('express');
const{
    signup,
    signin,
    getProfile,
    editProfile,
    editProfilePicture
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/getProfile/:username', getProfile);
router.put('/editProfile/:username', editProfile);
router.put('/editProfilePicture', editProfilePicture);

module.exports= router;