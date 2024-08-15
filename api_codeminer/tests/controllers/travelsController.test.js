// codeminer/api_codeminer/tests/controllers/travelsController.test.js
// codeminer/api_codeminer/tests/travelsController.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Travel = require('../../src/models/travel');
const Pilot = require('../../src/models/pilot');
const Ship = require('../../src/models/ship');
const Contract = require('../../src/models/contract');
const { describe, beforeAll, afterEach, it, expect } = require('@jest/globals');

const app = express();
app.use(express.json());

const travelsController = require('../../src/controllers/travelsController');
app.post('/travels', travelsController.addTravel);
app.get('/travels', travelsController.listTravels);
app.post('/travels/refuel', travelsController.refuelShip);
app.post('/travels/complete/:pilotId', travelsController.completeContract);

describe('Travels Controller', () => {
    beforeAll(async () => {
        await mongoose.connection.dropDatabase();
    });

    afterEach(async () => {
        await Travel.deleteMany();
        await Pilot.deleteMany();
        await Ship.deleteMany();
        await Contract.deleteMany();
    });

    it('should add a new travel', async () => {
        const ship = new Ship({
            name: 'Falcon',
            type: 'Freighter',
            registrationNumber: 'F123',
            capacity: 5000,
            fuelLevel: 75,
            weightCapacity: 10000
        });
        await ship.save();

        const pilot = new Pilot({
            name: 'Tiago Dias',
            age: 34,
            license: 'AB123',
            location: 'Earth',
            certification: '13445',
            credits: 1000,
            ship: ship._id
        });
        await pilot.save();

        const travelData = {
            pilot: pilot._id,
            origin: 'Aqua',
            destination: 'Demeter'
        };

        const response = await request(app)
            .post('/travels')
            .send(travelData);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Viagem adicionada');
        expect(response.body.travel).toBeDefined();
        expect(response.body.travel.origin).toBe('Aqua');
        expect(response.body.travel.destination).toBe('Demeter');

        const travels = await Travel.find();
        expect(travels.length).toBe(1);
        expect(travels[0].origin).toBe('Aqua');
        expect(travels[0].destination).toBe('Demeter');
    });

    it('should list all travels', async () => {
        const ship = new Ship({
            name: 'Falcon',
            type: 'Freighter',
            registrationNumber: 'F123',
            capacity: 5000,
            fuelLevel: 75,
            weightCapacity: 10000
        });
        await ship.save();

        const pilot = new Pilot({
            name: 'Tiago Dias',
            age: 34,
            license: 'AB123',
            location: 'Earth',
            certification: '13445',
            credits: 1000,
            ship: ship._id
        });
        await pilot.save();

        const travel1 = new Travel({
            pilot: pilot._id,
            origin: 'Aqua',
            destination: 'Demeter',
            fuelConsumed: 20
        });
        const travel2 = new Travel({
            pilot: pilot._id,
            origin: 'Aqua',
            destination: 'Demeter',
            fuelConsumed: 15
        });
        await travel1.save();
        await travel2.save();

        const response = await request(app).get('/travels');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
        expect(response.body[0].origin).toBe('Aqua');
        expect(response.body[1].origin).toBe('Aqua');
    });

    it('should refuel a ship', async () => {
        const ship = new Ship({
            name: 'Falcon',
            type: 'Freighter',
            registrationNumber: 'F123',
            capacity: 5000,
            fuelLevel: 75,
            weightCapacity: 10000
        });
        await ship.save();

        const pilot = new Pilot({
            name: 'Tiago Dia',
            age: 34,
            license: 'AB123',
            location: 'Earth',
            certification: '10445',
            credits: 1000,
            ship: ship._id
        });
        await pilot.save();

        const refuelData = {
            planet: 'Earth',
            pilotId: pilot._id,
            amount: 50
        };

        const response = await request(app)
            .post('/travels/refuel')
            .send(refuelData);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Reabastecimento realizado');
        expect(response.body.ship).toBeDefined();
        expect(response.body.ship.fuelLevel).toBe(125);

        const updatedPilot = await Pilot.findById(pilot._id);
        expect(updatedPilot.credits).toBe(650);
    });

    it('should complete a contract and add credits to the pilot', async () => {
        const ship = new Ship({
            name: 'Falcon',
            type: 'Freighter',
            registrationNumber: 'F123',
            capacity: 5000,
            fuelLevel: 75,
            weightCapacity: 10000
        });
        await ship.save();

        const pilot = new Pilot({
            name: 'Manoela Dias',
            age: 34,
            license: 'AB123',
            location: 'Earth',
            certification: '11445',
            credits: 1000,
            ship: ship._id
        });
        await pilot.save();

        const contract = new Contract({
            description: 'Deliver supplies',
            payload: 1000,
            origin: 'Earth',
            destination: 'Calas',
            pilot: pilot._id,
            value: 500,
            status: 'open'
        });
        await contract.save();

        const completeContractData = {
            contractId: contract._id,
            arrivalDate: new Date()
        };

        const response = await request(app)
            .post(`/travels/complete/${pilot._id}`)
            .send(completeContractData);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Contrato concluído e créditos adicionados');

        const updatedContract = await Contract.findById(contract._id);
        expect(updatedContract.status).toBe('closed');

        const updatedPilot = await Pilot.findById(pilot._id);
        expect(updatedPilot.credits).toBe(1500);
    });
});
