// codeminer/api_codeminer/tests/routes/pilots.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Pilot = require('../../src/models/pilot');
const Ship = require('../../src/models/ship');
const { describe, beforeAll, afterEach, it, expect } = require('@jest/globals');

const app = express();
app.use(express.json());

const pilotsRouter = require('../../src/routes/pilots');
app.use('/pilots', pilotsRouter);

describe('Pilots Routes', () => {
    beforeAll(async () => {
        await mongoose.connection.dropDatabase();
    });

    afterEach(async () => {
        await Pilot.deleteMany();
        await Ship.deleteMany();
    });

    it('should add a new pilot', async () => {
        const ship = new Ship({
            name: 'Enterprise',
            type: 'Explorer',
            registrationNumber: 'E456',
            capacity: 10000,
            fuelLevel: 60,
            weightCapacity: 20000
        });
        await ship.save();

        const pilotData = {
            certification: 'AB123',
            name: 'Tiago Dias',
            age: 30,
            credits: 1000,
            location: 'Earth',
            ship: ship._id
        };

        const response = await request(app)
            .post('/pilots')
            .send(pilotData);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Piloto adicionado');
        expect(response.body.pilot).toBeDefined();
        expect(response.body.pilot.certification).toBe('AB123');
        expect(response.body.pilot.name).toBe('Tiago Dias');
        expect(response.body.pilot.age).toBe(30);
        expect(response.body.pilot.credits).toBe(1000);
        expect(response.body.pilot.location).toBe('Earth');
        expect(response.body.pilot.ship).toBe(ship._id.toString());
    });

    it('should list all pilots', async () => {
        const ship = new Ship({
            name: 'Enterprise',
            type: 'Explorer',
            registrationNumber: 'E456',
            capacity: 10000,
            fuelLevel: 60,
            weightCapacity: 20000
        });
        await ship.save();

        const pilot1 = new Pilot({
            certification: 'CD456',
            name: 'Tiago Dia',
            age: 35,
            credits: 2000,
            location: 'Mars',
            ship: ship._id
        });
        const pilot2 = new Pilot({
            certification: 'EF789',
            name: 'Manoela Dias',
            age: 40,
            credits: 1500,
            location: 'Jupiter',
            ship: ship._id
        });
        await pilot1.save();
        await pilot2.save();

        const response = await request(app).get('/pilots');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
        expect(response.body[0].certification).toBe('CD456');
        expect(response.body[1].certification).toBe('EF789');
    });
});
