const express = require('express');
const{
    runCode,
    submitCode
} = require('../controllers/compilerController');

const router = express.Router();

router.post('/runCode', runCode);
router.post('/submitCode', submitCode);

module.exports= router;