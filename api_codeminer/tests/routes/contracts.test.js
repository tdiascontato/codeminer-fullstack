// codeminer/api_codeminer/tests/routes/contracts.test.js
// codeminer/api_codeminer/tests/contracts.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Contract = require('../../src/models/contract');
const Pilot = require('../../src/models/pilot');
const { describe, beforeAll, afterEach, it, expect } = require('@jest/globals');

const app = express();
app.use(express.json());

const contractsRouter = require('../../src/routes/contracts');
app.use('/contracts', contractsRouter);

describe('Contracts Routes', () => {
    beforeAll(async () => {
        await mongoose.connection.dropDatabase();
    });

    afterEach(async () => {
        await Contract.deleteMany();
        await Pilot.deleteMany();
    });

    it('should add a new contract', async () => {
        const pilot = new Pilot({
            name: 'Manoela Dia',
            age: 30,
            license: 'AB123',
            location: 'Earth',
            certification: 'ABS5932',
            credits: 1000
        });
        await pilot.save();

        const contractData = {
            description: 'Transport goods',
            payload: 500,
            origin: 'Calas',
            destination: 'Demeter',
            value: 1500,
            pilot: pilot._id
        };

        const response = await request(app)
            .post('/contracts')
            .send(contractData);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Contrato adicionado');
        expect(response.body.contract).toBeDefined();
        expect(response.body.contract.description).toBe('Transport goods');
        expect(response.body.contract.origin).toBe('Calas');
        expect(response.body.contract.destination).toBe('Demeter');
        expect(response.body.contract.value).toBe(1500);
        expect(response.body.contract.pilot).toBe(pilot._id.toString());
    });

    it('should list all contracts', async () => {
        const pilot = new Pilot({
            name: 'Tiago Dia',
            age: 35,
            license: 'CD456',
            location: 'Mars',
            certification: 'ABD5432',
            credits: 2000
        });
        await pilot.save();

        const contract1 = new Contract({
            description: 'Transport machinery',
            payload: 1000,
            origin: 'Demeter',
            destination: 'Aqua',
            value: 2000,
            pilot: pilot._id
        });
        const contract2 = new Contract({
            description: 'Deliver food supplies',
            payload: 300,
            origin: 'Aqua',
            destination: 'Calas',
            value: 1200,
            pilot: pilot._id
        });
        await contract1.save();
        await contract2.save();

        const response = await request(app).get('/contracts');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
        expect(response.body[0].description).toBe('Transport machinery');
        expect(response.body[1].description).toBe('Deliver food supplies');
    });

    it('should accept a contract', async () => {
        const pilot = new Pilot({
            name: 'Tiago Dias',
            age: 30,
            license: 'AB123',
            location: 'Earth',
            certification: 'ABS5432',
            credits: 1000
        });
        await pilot.save();

        const contract = new Contract({
            description: 'Transport goods',
            payload: 500,
            origin: 'Aqua',
            destination: 'Demeter',
            value: 1500,
            pilot: pilot._id
        });
        await contract.save();

        const response = await request(app)
            .post(`/contracts/${contract._id}/accept`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Contrato aceito');
        expect(response.body.contract.status).toBe('accepted');
    });
});
