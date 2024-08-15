// codeminer/api_codeminer/src/routes/pilots.js
const express = require('express');
const router = express.Router();
const pilotsController = require('../controllers/pilotsController');

router.post('/', pilotsController.addPilot);
router.get('/', pilotsController.listPilots);

module.exports = router;