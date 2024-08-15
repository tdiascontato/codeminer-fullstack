// codeminer/api_codeminer/tests/routes/ships.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Ship = require('../../src/models/ship');
const { describe, beforeAll, afterEach, it, expect } = require('@jest/globals');

const app = express();
app.use(express.json());

const shipsRouter = require('../../src/routes/ships');
app.use('/ships', shipsRouter);

describe('Ships Routes', () => {
    beforeAll(async () => {
        await mongoose.connection.dropDatabase();
    });

    afterEach(async () => {
        await Ship.deleteMany();
    });

    it('should add a new ship', async () => {
        const shipData = {
            name: 'Enterprise',
            type: 'Explorer',
            registrationNumber: 'E456',
            capacity: 10000,
            fuelLevel: 60,
            weightCapacity: 20000
        };

        const response = await request(app)
            .post('/ships')
            .send(shipData);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Nave adicionada');
        expect(response.body.ship).toBeDefined();
        expect(response.body.ship.name).toBe('Enterprise');
        expect(response.body.ship.type).toBe('Explorer');
        expect(response.body.ship.registrationNumber).toBe('E456');
        expect(response.body.ship.capacity).toBe(10000);
        expect(response.body.ship.fuelLevel).toBe(60);
        expect(response.body.ship.weightCapacity).toBe(20000);
    });

    it('should list all ships', async () => {
        const ship1 = new Ship({
            name: 'Enterprise',
            type: 'Explorer',
            registrationNumber: 'E456',
            capacity: 10000,
            fuelLevel: 60,
            weightCapacity: 20000
        });
        const ship2 = new Ship({
            name: 'Millennium Falcon',
            type: 'Freighter',
            registrationNumber: 'MF123',
            capacity: 5000,
            fuelLevel: 80,
            weightCapacity: 15000
        });
        await ship1.save();
        await ship2.save();

        const response = await request(app).get('/ships');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
        expect(response.body[0].name).toBe('Enterprise');
        expect(response.body[1].name).toBe('Millennium Falcon');
    });
});
