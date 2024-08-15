// codeminer/api_codeminer/src/controllers/resourcesController.js
const mongoose = require("mongoose");
const Pilot = require('../models/pilot');
const Resource = require('../models/resource');

exports.addResourceToPilot = async (req, res) => {
    try {
        const { pilotId, contractId, name, weight, amount } = req.body;

        if (!mongoose.Types.ObjectId.isValid(pilotId) || !mongoose.Types.ObjectId.isValid(contractId)) {
            return res.status(400).json({ error: 'IDs inválidos' });
        }
        if (!name || weight <= 0 || amount <= 0) {
            return res.status(400).json({ error: 'Dados inválidos para o recurso' });
        }

        const pilot = await Pilot.findById(pilotId);
        if (!pilot) {
            return res.status(404).json({ error: 'Piloto não encontrado' });
        }

        const resource = new Resource({ name, weight, amount });
        await resource.save();

        pilot.resources.push({ resource: resource._id, contract: contractId });

        // Atualize o piloto e trate a possível versão do documento
        const updatedPilot = await Pilot.findByIdAndUpdate(
            pilotId,
            { resources: pilot.resources },
            { new: true, runValidators: true } // Atualiza o documento e executa as validações
        );

        if (!updatedPilot) {
            return res.status(404).json({ error: 'Piloto não encontrado ao atualizar' });
        }
        res.status(201).json({ message: 'Recurso adicionado ao piloto', resource });
    } catch (error) {
        console.error('Erro ao adicionar recurso ao piloto:', error);
        res.status(500).send('Erro ao adicionar recurso ao piloto');
    }
};

exports.generatePilotReport = async (req, res) => {
    try {
        const { pilotId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(pilotId)) {
            return res.status(400).json({ error: 'ID do piloto inválido' });
        }

        const pilot = await Pilot.findById(pilotId);

        if (!pilot) {
            return res.status(404).json({ error: 'Piloto não encontrado' });
        }

        const resources = await Resource.find({ pilot: pilotId });

        const report = {
            pilot: {
                id: pilot._id,
                name: pilot.name,
                resources: resources.map(resource => ({
                    id: resource._id,
                    name: resource.name,
                    weight: resource.weight,
                    amount: resource.amount
                }))
            }
        };

        res.status(200).json(report);
    } catch (error) {
        console.error('Erro ao gerar relatório do piloto:', error);
        res.status(500).send('Erro ao gerar relatório do piloto');
    }
};

