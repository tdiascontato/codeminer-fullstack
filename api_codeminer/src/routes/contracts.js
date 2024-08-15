// codeminer/api_codeminer/src/routes/contracts.js
const express = require('express');
const router = express.Router();
const contractsController = require('../controllers/contractsController');

router.post('/', contractsController.addContract);
router.get('/', contractsController.listContracts);
router.post('/:id/accept', contractsController.acceptContract);

module.exports = router;