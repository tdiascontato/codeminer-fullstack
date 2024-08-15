// codeminer/api_codeminer/src/models/contract.js
const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    description: { type: String, required: true },
    payload: { type: Number, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    value: { type: Number, required: true },
    status: { type: String},
    pilot: { type: mongoose.Schema.Types.ObjectId, ref: 'Pilot' }
},{
    timestamps: true
});

module.exports = mongoose.model('Contract', contractSchema);