// codeminer/api_codeminer/src/models/ship.js
const mongoose = require('mongoose');

const shipSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    capacity: { type: Number, required: true },
    fuelLevel: { type: Number, required: true },
    weightCapacity: { type: Number, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Ship', shipSchema);