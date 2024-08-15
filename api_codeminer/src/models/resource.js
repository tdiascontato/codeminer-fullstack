// codeminer/api_codeminer/src/models/resource.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    weight: { type: Number, required: true },
    amount: { type: Number, required: true },
    pilot: { type: mongoose.Schema.Types.ObjectId, ref: 'Pilot' }
},{
    timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);