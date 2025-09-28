const express = require('express');
const{
    createProblem,
    getProblem,
    getSubmissions,
    getSolutions,
    getProblems,
    acceptAllProblems,
    addProblemToCalendar,
    getCalendar
} = require('../controllers/problemsController');

const router = express.Router();

router.post('/createProblem', createProblem);
router.get('/getProblem/:uniqueId', getProblem);
router.get('/getSubmissions', getSubmissions);
router.get('/getSolutions', getSolutions);
router.get('/getProblems', getProblems);
router.post('/acceptAllProblems', acceptAllProblems);
router.post('/addProblemToCalendar', addProblemToCalendar);
router.get('/getCalendar', getCalendar);

module.exports= router;