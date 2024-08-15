// codeminer/api_codeminer/src/routes/ships.js
const express = require('express');
const router = express.Router();
const shipsController = require('../controllers/shipsController');

router.post('/', shipsController.addShip);
router.get('/', shipsController.listShips);

module.exports = router;