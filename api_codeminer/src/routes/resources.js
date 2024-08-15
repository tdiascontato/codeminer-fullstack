// codeminer/api_codeminer/src/routes/resources.js
const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/resourcesController');

router.post('/add-resource', resourcesController.addResourceToPilot);
router.get('/report/:pilotId', resourcesController.generatePilotReport);

module.exports = router;