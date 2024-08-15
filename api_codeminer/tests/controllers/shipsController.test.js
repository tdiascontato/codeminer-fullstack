// codeminer/api_codeminer/tests/shipsController.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Ship = require('../../src/models/ship');
const { describe, beforeAll, afterEach, it, expect } = require('@jest/globals');

const app = express();
app.use(express.json());

const shipsController = require('../../src/controllers/shipsController');
app.post('/ships', shipsController.addShip);
app.get('/ships', shipsController.listShips);

describe('Ships Controller', () => {
    beforeAll(async () => {
        await mongoose.connection.dropDatabase();
    });

    afterEach(async () => {
        await Ship.deleteMany();
    });

    it('should add a new ship', async () => {
        const shipData = {
            name: 'Falcon',
            type: 'Freighter',
            registrationNumber: 'F123',
            capacity: 5000,
            fuelLevel: 75,
            weightCapacity: 10000
        };

        const response = await request(app)
            .post('/ships')
            .send(shipData);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Nave adicionada');

        const ships = await Ship.find();
        expect(ships.length).toBe(1);
        expect(ships[0].name).toBe('Falcon');
        expect(ships[0].type).toBe('Freighter');
        expect(ships[0].registrationNumber).toBe('F123');
        expect(ships[0].capacity).toBe(5000);
        expect(ships[0].fuelLevel).toBe(75);
        expect(ships[0].weightCapacity).toBe(10000);
    });

    it('should list all ships', async () => {
        const ship1 = new Ship({
            name: 'Falcon',
            type: 'Freighter',
            registrationNumber: 'F123',
            capacity: 5000,
            fuelLevel: 50,
            weightCapacity: 10000
        });
        const ship2 = new Ship({
            name: 'Enterprise',
            type: 'Explorer',
            registrationNumber: 'E456',
            capacity: 10000,
            fuelLevel: 60,
            weightCapacity: 20000
        });
        await ship1.save();
        await ship2.save();
        const response = await request(app).get('/ships');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
        expect(response.body[0].name).toBe('Falcon');
        expect(response.body[1].name).toBe('Enterprise');
    });
});