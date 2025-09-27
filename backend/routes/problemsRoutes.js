const express = require('express');
const{
    createProblem,
    getProblem,
    getSubmissions,
    getSolutions,
    getProblems,
    acceptAllProblems
} = require('../controllers/problemsController');

const router = express.Router();

router.post('/createProblem', createProblem);
router.get('/getProblem/:uniqueId', getProblem);
router.get('/getSubmissions', getSubmissions);
router.get('/getSolutions', getSolutions);
router.get('/getProblems', getProblems);
router.post('/acceptAllProblems', acceptAllProblems);

module.exports= router;