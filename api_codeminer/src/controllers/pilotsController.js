// codeminer/api_codeminer/src/controllers/pilotsController.js
const Pilot = require('../models/pilot');
const mongoose = require("mongoose");
exports.addPilot = async (req, res) => {
    const { certification, name, age, credits, location, ship } = req.body;

    if (!certification) {
        return res.status(400).json({ error: 'Certification is required' });
    }
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    if (!age || age < 18) {
        return res.status(400).json({ error: 'Age is required and must be at least 18' });
    }
    if (credits !== undefined && credits < 0) {
        return res.status(400).json({ error: 'Credits must be a non-negative number' });
    }
    if (!location) {
        return res.status(400).json({ error: 'Location is required' });
    }
    if (ship && !mongoose.Types.ObjectId.isValid(ship)) {
        return res.status(400).json({ error: 'Ship must be a valid MongoDB ID' });
    }

    try {
        const pilot = new Pilot({ certification, name, age, credits, location, ship });
        await pilot.save();
        res.status(201).send({message:'Piloto adicionado', pilot});
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.listPilots = async (req, res) => {
    try {
        const pilots = await Pilot.find().populate('ship');
        res.status(200).json(pilots);
    } catch (error) {
        res.status(400).send(error.message);
    }
};