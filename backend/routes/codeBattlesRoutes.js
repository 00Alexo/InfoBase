const express = require('express');
const { getQueueStats, getActiveBattles } = require('../controllers/codeBattlesController');

const router = express.Router();

router.get('/queue-stats', getQueueStats);
router.get('/active-battles', getActiveBattles);

module.exports = router;