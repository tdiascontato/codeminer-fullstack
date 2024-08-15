// codeminer/api_codeminer/tests/controllers/resourcesController.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Pilot = require('../../src/models/pilot');
const Resource = require('../../src/models/resource');
const Contract = require('../../src/models/contract');
const { describe, beforeAll, afterEach, it, expect } = require('@jest/globals');

const app = express();
app.use(express.json());

const resourcesController = require('../../src/controllers/resourcesController');
app.post('/resources', resourcesController.addResourceToPilot);
app.get('/resources/report/:pilotId', resourcesController.generatePilotReport);

describe('Resources Controller', () => {
    beforeAll(async () => {
        await mongoose.connection.dropDatabase();
    });

    afterEach(async () => {
        await Pilot.deleteMany();
        await Resource.deleteMany();
        await Contract.deleteMany();
    });

    it('should add a resource to a pilot', async () => {
        const pilot = new Pilot({
            name: 'Tiago Dias',
            age: 28,
            license: 'XY163',
            location: 'Mars',
            certification: '13475',
            credits: 800
        });
        await pilot.save();

        const contract = new Contract({
            description: 'Deliver machinery',
            payload: 2000,
            origin: 'Mars',
            destination: 'Jupiter',
            pilot: pilot._id,
            value: 1200,
            status: 'open'
        });
        await contract.save();

        const resourceData = {
            pilotId: pilot._id,
            contractId: contract._id,
            name: 'Food Supplies',
            weight: 300,
            amount: 20
        };

        const response = await request(app)
            .post('/resources')
            .send(resourceData);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Recurso adicionado ao piloto');
        expect(response.body.resource).toBeDefined();
        expect(response.body.resource.name).toBe('Food Supplies');
        expect(response.body.resource.weight).toBe(300);
        expect(response.body.resource.amount).toBe(20);

        const updatedPilot = await Pilot.findById(pilot._id).populate('resources.resource');
        expect(updatedPilot.resources.length).toBe(1);
        expect(updatedPilot.resources[0].resource.name).toBe('Food Supplies');
    });

    it('should generate a pilot report', async () => {
        const pilot = new Pilot({
            name: 'Manoela Dias',
            age: 28,
            license: 'XY223',
            location: 'Mars',
            certification: '12475',
            credits: 800
        });
        await pilot.save();

        const resource1 = new Resource({
            name: 'Food Supplies',
            weight: 300,
            amount: 20,
            pilot: pilot._id
        });
        const resource2 = new Resource({
            name: 'Medical Supplies',
            weight: 150,
            amount: 10,
            pilot: pilot._id
        });
        await resource1.save();
        await resource2.save();

        pilot.resources.push({ resource: resource1._id });
        pilot.resources.push({ resource: resource2._id });
        await pilot.save();

        const response = await request(app).get(`/resources/report/${pilot._id}`);
        expect(response.status).toBe(200);
        expect(response.body.pilot).toBeDefined();
        expect(response.body.pilot.name).toBe('Manoela Dias');
        expect(response.body.pilot.resources.length).toBe(2);
        expect(response.body.pilot.resources[0].name).toBe('Food Supplies');
        expect(response.body.pilot.resources[1].name).toBe('Medical Supplies');
    });
});
