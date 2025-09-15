const express = require('express');
const{
    createProblem,
    getProblem
} = require('../controllers/problemsController');

const router = express.Router();

router.post('/createProblem', createProblem);
router.get('/getProblem/:uniqueId', getProblem);

module.exports= router;