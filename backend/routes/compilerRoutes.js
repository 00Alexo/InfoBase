const express = require('express');
const{
    runCode
} = require('../controllers/compilerController');

const router = express.Router();

router.post('/runCode', runCode);

module.exports= router;