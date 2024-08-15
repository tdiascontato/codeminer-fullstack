// codeminer/api_codeminer/tests/controllers/contractsController.test.js
const { describe, it, expect, beforeAll, afterEach} = require('@jest/globals');
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());
const Contract = require('../../src/models/contract');
const Pilot = require('../../src/models/pilot');
const contractsController = require('../../src/controllers/contractsController');

const router = express.Router();
app.use('/contracts', router);
router.post('/', contractsController.addContract);
router.get('/', contractsController.listContracts);
router.put('/:id/accept', contractsController.acceptContract);


describe('Contracts Controller', () => {
    let contractId;
    let pilotId;

    beforeAll(async () => {
        const pilot = await Pilot.create({
            name: 'Tiago Dias',
            age: 26,
            license: '12345ABC',
            location: 'Earth',
            certification: `Pilot Certified ${Date.now()}`,
            isTestData: true
        });
        pilotId = pilot._id.toString();
    });

    afterEach(async () => {
        await Contract.deleteMany({});
    });


    it('should add a new contract', async () => {
        const response = await request(app)
            .post('/contracts')
            .send({
                destination: "Mars",
                payload: 500,
                origin: "Earth",
                description: "New Contract",
                value: 1000,
                pilot: pilotId,
                isTestData: true
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Contrato adicionado');
        expect(response.body.contract).toBeDefined();
    });

    it('should list all contracts', async () => {
        await Contract.create({
            pilot: pilotId,
            payload: 500,
            value: 1000,
            destination: 'Mars',
            origin: 'Earth',
            description: 'Another Contract',
            isTestData: true
        });

        const response = await request(app).get('/contracts');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should accept a contract', async () => {
        const newContract = await Contract.create({
            pilot: pilotId,
            payload: 500,
            value: 1000,
            destination: 'Mars',
            origin: 'Earth',
            description: 'Contract to Accept',
            isTestData: true
        });

        contractId = newContract._id;

        const response = await request(app)
            .put(`/contracts/${contractId}/accept`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Contrato aceito');

        const updatedContract = await Contract.findById(contractId);
        expect(updatedContract.status).toBe('accepted');
        expect(updatedContract.pilot.toString()).toBe(pilotId);
    });

});
