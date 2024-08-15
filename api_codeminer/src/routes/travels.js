// codeminer/api_codeminer/src/routes/travels.js
const express = require('express');
const router = express.Router();
const travelsController = require('../controllers/travelsController');

router.post('/', travelsController.addTravel);
router.get('/', travelsController.listTravels);
router.post('/complete-contract/:pilotId', travelsController.completeContract);
router.post('/refuel', travelsController.refuelShip);

module.exports = router;
