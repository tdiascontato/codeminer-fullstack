// codeminer/api_codeminer/src/routes/index.js
const express = require('express');
const router = express.Router();
const pilotsRoutes = require('./pilots');
const shipsRoutes = require('./ships');
const contractsRoutes = require('./contracts');
const travelsRoutes = require('./travels');
const resourcesRoutes = require('./resources');

router.use('/pilots', pilotsRoutes);
router.use('/ships', shipsRoutes);
router.use('/contracts', contractsRoutes);
router.use('/travels', travelsRoutes);
router.use('/resources', resourcesRoutes);

module.exports = router;