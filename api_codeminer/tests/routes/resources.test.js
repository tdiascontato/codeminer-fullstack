// codeminer/api_codeminer/tests/routes/resources.test.js
const request = require('supertest');
const app = require('../../src/app');
const Ship = require('../../src/models/ship');
const Pilot = require('../../src/models/pilot');
const Contract = require('../../src/models/contract');
const Resource = require('../../src/models/resource');
const { describe, it, expect, afterEach, beforeAll, beforeEach, afterAll} = require('@jest/globals');

describe('Resources Routes', () => {
    let shipId_resource;
    let pilotId_resource;
    let contractId_resource;
    let pilotCertification4;

    beforeAll(async () => {
        await Ship.deleteMany({});
        await Pilot.deleteMany({});
        await Contract.deleteMany({});
        await Resource.deleteMany({});
    });

    afterAll(async () => {
        await Ship.deleteMany({});
        await Pilot.deleteMany({});
        await Contract.deleteMany({});
        await Resource.deleteMany({});
    });

    it('should add a new resource', async () => {
        const ship_resource = await request(app)
            .post('/api/ships')
            .send({
                name: 'Starship Enter',
                model: 'NCC-1591',
                type: 'Battle',
                capacity: 10000,
                fuelLevel: 3000,
                registrationNumber: "SC2293",
                weightCapacity: 30000,
                isTestData: true,
            });
        shipId_resource = ship_resource.body.ship._id.toString();

        pilotCertification4 = `Pilot Certified ${Date.now()}`;
        const pilot_resource = await request(app)
            .post('/api/pilots')
            .send({
                certification: pilotCertification4,
                name: 'Ri Dias',
                age: 30,
                location: 'Mars',
                credits: 2000,
                ship: shipId_resource,
                isTestData: true
            });
        pilotId_resource = pilot_resource.body.pilot._id.toString();

        const contract_resource = await request(app)
            .post('/api/contracts')
            .send({
                destination: "Mars",
                payload: 500,
                origin: "Earth",
                description: "New Contract",
                value: 1000,
                pilot: pilotId_resource,
                isTestData: true
            });
        contractId_resource = contract_resource.body.contract._id.toString();

        const response = await Resource.create({ amount: 1000,
            pilotId: pilotId_resource,
            contractId: contractId_resource,
            name: 'Water',
            weight: '3000' })

        await pilot_resource.body.pilot.resources.push({ resource: response._id, contract: contractId_resource });

        expect(pilot_resource.body.pilot.resources[0].contract).toBe(contractId_resource);
        expect(response.name).toBe('Water');
        expect(response.weight).toBe(3000);
    });
});
