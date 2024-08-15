// codeminer/api_codeminer/tests/routes/travels.test.js
const request = require('supertest');
const app = require('../../src/app');
const Travel = require('../../src/models/travel');
const Pilot = require("../../src/models/pilot");
const { describe, it, expect, afterEach, beforeAll, beforeEach, afterAll} = require('@jest/globals');
const Ship = require("../../src/models/ship");

describe('Travels Routes', () => {
    let pilotId;
    let pilotId2;
    let pilotId3;
    let pilotCertification;
    let pilotCertification2;
    let pilotCertification3;
    let contractId;
    let shipId

    beforeAll(async () => {
        await Travel.deleteMany({});
        await Pilot.deleteMany({});
    });

    beforeEach(async () => {
        await Travel.deleteMany({});
        await Pilot.deleteMany({});
    });

    afterEach(async () => {
        await Travel.deleteMany({});
        await Pilot.deleteMany({});
    });

    afterAll(async () => {
        await Travel.deleteMany({});
        await Pilot.deleteMany({});
    });

    it('should add a new travel', async () => {
        pilotCertification = `Pilot Certified ${Date.now()}`;
        const pilot = await Pilot.create({
            certification: pilotCertification,
            name: 'Tiago Dias',
            age: 30,
            location: 'Mars',
            isTestData: true
        });
        pilotId = pilot._id.toString();
        const response = await request(app)
            .post('/api/travels')
            .send({
                pilot: pilotId,
                origin: 'Aqua',
                destination: 'Demeter',
                isTestData: true,
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Viagem adicionada');
    });

    it('should list all travels', async () => {
        pilotCertification2 = `Pilot Certified ${Date.now()}`;
        const pilot2 = await Pilot.create({
            certification: pilotCertification2,
            name: 'Manoela Dias',
            age: 30,
            location: 'Mars',
            isTestData: true
        });
        pilotId2 = pilot2._id.toString();
        await request(app)
            .post('/api/travels')
            .send({
                pilot: pilotId2,
                origin: 'Aqua',
                destination: 'Demeter',
                isTestData: true,
            });

        const response = await request(app).get('/api/travels');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
    });

    it('should accpet a contract', async () => {
        const ship = await request(app)
            .post('/api/ships')
            .send({
                name: 'Starship Enter',
                model: 'NCC-1501',
                type: 'Battle',
                capacity: 10000,
                fuelLevel: 3000,
                registrationNumber: "SC2093",
                weightCapacity: 30000,
                isTestData: true,
            });
        shipId = ship.body.ship._id.toString()

        pilotCertification3 = `Pilot Certified ${Date.now()}`;
        const pilot3 = await request(app)
            .post('/api/pilots')
            .send({
            certification: pilotCertification3,
            name: 'Ti Dias',
            age: 30,
            location: 'Mars',
            credits: 2000,
            ship: shipId,
            isTestData: true
        });
        pilotId3 = pilot3.body.pilot._id.toString();

        const contract = await request(app)
            .post('/api/contracts')
            .send({
                destination: "Mars",
                payload: 500,
                origin: "Earth",
                description: "New Contract",
                value: 1000,
                pilot: pilotId3,
                isTestData: true
            });
        contractId = contract.body.contract._id.toString();

        const response = await request(app)
            .post(`/api/travels/complete-contract/${pilotId3}`)
            .send({
                contractId: contractId,
                arrivalDate: '2024-08-03T13:15:42Z',
                isTestData: true,
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Contrato concluído e créditos adicionados');
    });

});