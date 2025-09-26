const express = require('express');
const{
    createProblem,
    getProblem,
    getSubmissions,
    getSolutions
} = require('../controllers/problemsController');

const router = express.Router();

router.post('/createProblem', createProblem);
router.get('/getProblem/:uniqueId', getProblem);
router.get('/getSubmissions', getSubmissions);
router.get('/getSolutions', getSolutions);

module.exports= router;