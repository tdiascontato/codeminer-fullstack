// codeminer/api_codeminer/tests/models/contract.test.js
const request = require('supertest');
const express = require('express');
const Contract = require('../../src/models/contract');
const Pilot = require('../../src/models/pilot');
const { describe, it, expect, beforeAll } = require('@jest/globals');
const app = express();
const contractsController = require('../../src/controllers/contractsController');

app.use(express.json());
app.post('/contracts', contractsController.addContract);
app.get('/contracts', contractsController.listContracts);
app.put('/contracts/:id/accept', contractsController.acceptContract);

describe('Contract Controller', () => {
    let pilotId;

    beforeAll(async () => {
        const pilot = await Pilot.create({
            certification: 'Certified Pilot',
            name: 'Tiago Dias',
            age: 30,
            location: 'Space Station',
            isTestData: true
        });
        pilotId = pilot._id.toString();
    });

    it('should add a new contract', async () => {
        const contractData = {
            pilot: pilotId,
            description: 'Contract details',
            payload: 500,
            origin: 'Earth',
            destination: 'Mars',
            value: 1000,
            isTestData: true
        };

        const response = await request(app)
            .post('/contracts')
            .send(contractData);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Contrato adicionado');

        const contracts = await Contract.find();
        expect(contracts.length).toBe(1);
        expect(contracts[0].description).toBe('Contract details');
    });

    it('should list all contracts', async () => {
        const contract2 = new Contract({
            pilot: pilotId,
            description: 'Another contract details',
            payload: 500,
            origin: 'Mars',
            destination: 'Jupiter',
            value: 2000,
            isTestData: true
        });
        await contract2.save();

        const response = await request(app).get('/contracts');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
        expect(response.body[0].description).toBe('Contract details');
        expect(response.body[1].description).toBe('Another contract details');
    });

    it('should accept a contract', async () => {
        const contract = await Contract.create({
            pilot: pilotId,
            description: 'Contract details',
            payload: 500,
            origin: 'Earth',
            destination: 'Mars',
            value: 1000,
        });

        const response = await request(app)
            .put(`/contracts/${contract._id}/accept`)
            .send({ pilot: pilotId });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Contrato aceito');

        const updatedContract = await Contract.findById(contract._id);
        expect(updatedContract.status).toBe('accepted');
        expect(updatedContract.pilot.toString()).toBe(pilotId);
    });
});
