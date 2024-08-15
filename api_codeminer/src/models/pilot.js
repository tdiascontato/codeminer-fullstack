// codeminer/api_codeminer/src/models/pilot.js
const mongoose = require('mongoose');

const pilotSchema = new mongoose.Schema({
    certification: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true, min: 18 },
    credits: { type: Number, default: 0 },
    location: { type: String, required: true },
    ship: { type: mongoose.Schema.Types.ObjectId, ref: 'Ship' },
    resources: [{ resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }, contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' } }],
    contracts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }]
},{
    timestamps: true
});

module.exports = mongoose.model('Pilot', pilotSchema);