// codeminer/api_codeminer/src/models/travel.js
const mongoose = require('mongoose');

const travelSchema = new mongoose.Schema({
    pilot: { type: mongoose.Schema.Types.ObjectId, ref: 'Pilot', required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    fuelConsumed: { type: Number, required: true },
    date: { type: Date, default: Date.now }
},{
    timestamps: true
});

module.exports = mongoose.model('Travel', travelSchema);