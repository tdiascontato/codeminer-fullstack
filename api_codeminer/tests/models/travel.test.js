// codeminer/api_codeminer/tests/models/travel.test.js
const Ship = require("../../src/models/ship");
const Pilot = require('../../src/models/pilot');
const Travel = require('../../src/models/travel');
const { describe, it, expect, afterEach } = require('@jest/globals');

describe('Travel Model', () => {
    let pilotDataID;

    afterEach(async () => {
        await Pilot.deleteMany();
        await Ship.deleteMany();
        await Travel.deleteMany();
    });

    it('should add and check a new travel', async () => {
        const shipData = await Ship.create({
            name: 'Star Fork',
            type: 'Battle',
            registrationNumber: 'SD3095',
            capacity: 8000,
            fuelLevel: 250,
            weightCapacity: 30000,
            isTestData: true
        });

        const pilotData = await Pilot.create({
            name: 'Tiago Dias',
            age: 26,
            license: '12345ABC',
            location: 'Earth',
            certification: `Pilot Certified ${Date.now()}`,
            ship: shipData._id,
            isTestData: true
        });

        pilotDataID = pilotData._id;

        const travelResponse = await Travel.create({
            pilot: pilotDataID,
            origin: 'Aqua',
            destination: 'Demeter',
            fuelConsumed: 30
        });

        expect(travelResponse.origin).toBe('Aqua');
        expect(travelResponse.destination).toBe('Demeter');
    });
});
