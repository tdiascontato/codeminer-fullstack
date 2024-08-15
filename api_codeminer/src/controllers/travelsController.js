// codeminer/api_codeminer/src/controllers/travelsController.js
const mongoose = require("mongoose");
const Travel = require('../models/travel');
const Pilot = require('../models/pilot')
const Ship = require('../models/ship')
const Contract = require('../models/contract')

const routeMap = {
    Andvari: { Demeter: Infinity, Aqua: 13, Calas: 23 },
    Demeter: { Andvari: Infinity, Aqua: 22, Calas: 25 },
    Aqua: { Andvari: Infinity, Demeter: 30, Calas: 12 },
    Calas: { Andvari: 20, Demeter: 25, Aqua: 15 }
};

const calculateFuel = (origin, destination) => {
    const route = routeMap[origin];
    if (!route || route[destination] === undefined) {
        throw new Error('Rota não encontrada ou bloqueada');
    }
    return route[destination];
};

exports.addTravel = async (req, res) => {
    try {
        const { pilot, origin, destination } = req.body;

        if (!pilot || !origin || !destination) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const fuelConsumed = calculateFuel(origin, destination);

        if (fuelConsumed === Infinity) {
            return res.status(400).json({ error: 'Rota bloqueada entre os planetas' });
        }

        const travel = new Travel({ pilot, origin, destination, fuelConsumed });
        await travel.save();

        res.status(201).json({ message: 'Viagem adicionada', travel });
    } catch (error) {
        console.error('Erro ao adicionar viagem:', error);
        res.status(500).send('Erro ao adicionar viagem');
    }
};

exports.listTravels = async (req, res) => {
    try {
        const travels = await Travel.find().populate('pilot');
        res.status(200).json(travels);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.refuelShip = async (req, res) => {
    try {
        const { planet, pilotId, amount } = req.body;

        if (!mongoose.Types.ObjectId.isValid(pilotId)) {
            return res.status(400).json({ error: 'ID do piloto inválido' });
        }
        if (amount <= 0) {
            return res.status(400).json({ error: 'Quantidade de combustível deve ser positiva' });
        }

        const pilot = await Pilot.findById(pilotId);

        if (!pilot) {
            return res.status(404).json({ error: 'Piloto não encontrado' });
        }
        if(!planet){
            return res.status(400).json({error: "Planeta não enviado."})
        }

        pilot.location = planet;
        const ship = await Ship.findById(pilot.ship);

        if (!ship) {
            return res.status(404).json({ error: 'Nave não encontrada no planeta especificado' });
        }


        const totalCost = amount * 7;
        if (pilot.credits < totalCost) {
            return res.status(400).json({ error: 'Créditos insuficientes para o reabastecimento' });
        }

        ship.fuelLevel = (ship.fuelLevel || 0) + amount;
        pilot.credits -= totalCost;

        await ship.save();
        await pilot.save();

        res.status(200).json({ message: 'Reabastecimento realizado', ship, pilot });
    } catch (error) {
        res.status(500).send('Erro ao registrar reabastecimento');
    }
};
exports.completeContract = async (req, res) => {
    try {
        const { contractId, arrivalDate } = req.body;
        const pilotId = req.params.pilotId;

        if (!mongoose.Types.ObjectId.isValid(contractId) || !mongoose.Types.ObjectId.isValid(pilotId)) {
            return res.status(400).json({ error: 'IDs inválidos' });
        }
        if (!arrivalDate) {
            return res.status(400).json({ error: 'Data de chegada é obrigatória' });
        }

        const contract = await Contract.findById(contractId);
        const pilot = await Pilot.findById(pilotId);

        if (!contract) {
            return res.status(404).json({ error: 'Contrato não encontrado' });
        }
        if (!pilot) {
            return res.status(404).json({ error: 'Piloto não encontrado' });
        }

        contract.status = 'closed';
        await contract.save();

        pilot.credits += contract.value;
        await pilot.save();

        res.status(200).json({ message: 'Contrato concluído e créditos adicionados', contract, pilot });
    } catch (error) {
        res.status(500).send('Erro ao concluir contrato');
    }
};