// codeminer/api_codeminer/src/controllers/shipsController.js
const Ship = require('../models/ship')
exports.addShip = async (req, res) => {
    try {
        const { name, type, registrationNumber, capacity, fuelLevel, weightCapacity } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        if (!type) {
            return res.status(400).json({ error: 'Type is required' });
        }
        if (!registrationNumber) {
            return res.status(400).json({ error: 'Registration number is required' });
        }
        if (capacity === undefined || capacity <= 0) {
            return res.status(400).json({ error: 'Capacity must be a positive number' });
        }
        if (fuelLevel === undefined || fuelLevel < 0) {
            return res.status(400).json({ error: 'Fuel level must be a non-negative number' });
        }
        if (weightCapacity === undefined || weightCapacity <= 0) {
            return res.status(400).json({ error: 'Weight capacity must be a positive number' });
        }

        const ship = new Ship({ name, type, registrationNumber, capacity, fuelLevel, weightCapacity });
        await ship.save();

        res.status(201).json({ message: 'Nave adicionada', ship });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.listShips =  async(req, res) => {
    try {
        const ships = await Ship.find();
        res.status(200).json(ships);
    } catch (error) {
        res.status(400).send(error.message);
    }
};