// codeminer/api_codeminer/src/controllers/contractsController.js
const Contract = require('../models/contract');
const mongoose = require("mongoose");

exports.addContract = async (req, res) => {
    try {
        const { description, payload, origin, destination, value, pilot } = req.body;
        if (!description || !origin || !destination || !value || !mongoose.Types.ObjectId.isValid(pilot)) {
            return res.status(400).send('Dados inválidos');
        }
        const contract = new Contract({ description, payload, origin, destination, value, pilot });
        await contract.save();
        res.status(201).send({ message: 'Contrato adicionado', contract });
    } catch(error) {
        console.error('Erro ao adicionar contrato:', error);
        res.status(500).send('Erro ao adicionar contrato');
    }
};

exports.listContracts = async (req, res) => {
    try {
        const contracts = await Contract.find().populate('pilot');
        res.status(200).json(contracts);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.acceptContract = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({message: "ID inválido"});
        }
        const contract = await Contract.findById(id);
        if (!contract) {
            return res.status(404).send('Contrato não encontrado');
        }
        contract.status = "accepted";
        await contract.save();
        res.status(200).send({ message: 'Contrato aceito', contract });
    } catch (error) {
        console.error('Error accepting contract:');
        res.status(400).send({message: 'Erro ao aceitar contrato', error});
    }
};