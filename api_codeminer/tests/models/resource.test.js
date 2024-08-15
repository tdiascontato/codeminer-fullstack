// codeminer/api_codeminer/tests/models/resource.test.js
const request = require('supertest');
const app = require('../../src/app'); // Ajuste o caminho conforme necessário
const Pilot = require('../../src/models/pilot');
const Resource = require('../../src/models/resource');
const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');
const Ship = require("../../src/models/ship");

describe('Resource Controller', () => {
    let pilotId;
    let shipId;

    beforeEach(async () => {
        await Pilot.deleteMany();
        await Resource.deleteMany();
    });

    afterEach(async () => {
        await Pilot.deleteMany();
        await Resource.deleteMany();
    });

    it('should add and check a new resource to a pilot', async () => {
        const shipData = await Ship.create({
            name: 'Star Fork',
            type: 'Battle',
            registrationNumber: 'SD3095',
            capacity: 8000,
            fuelLevel: 250,
            weightCapacity: 30000,
            isTestData: true
        });
        shipId = shipData._id;
        const pilot = await Pilot.create({
            name: 'Tiago Dias',
            age: 26,
            license: '12345ABC',
            location: 'Earth',
            certification: `Pilot Certified ${Date.now()}`,
            isTestData: true,
            ship: shipData._id
        });

        pilotId = pilot._id;

        const response = await Resource.create({
                name: 'Water',
                weight: 3000,
                amount: 1000,
                pilot: pilotId
        });

        expect(response.name).toBe('Water');
        expect(response.weight).toBe(3000);

    });
});
