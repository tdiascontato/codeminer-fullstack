// codeminer/api_codeminer/tests/models/ship.test.js
const request = require('supertest');
const express = require('express');
const Ship = require('../../src/models/ship');
const { describe, it, expect, afterEach} = require('@jest/globals');
const app = express();
const shipsController = require('../../src/controllers/shipsController');

app.use(express.json());
app.post('/ships', shipsController.addShip);
app.get('/ships', shipsController.listShips);

describe('Ships Controller', () => {

    afterEach(async () => {
        await Ship.deleteMany({ isTestData: true });
    });

    it('should add a new ship', async () => {
        const shipData = {
            name: 'Star Fork',
            type: 'Battle',
            registrationNumber: 'SC3035',
            capacity: 8000,
            fuelLevel: 250,
            weightCapacity: 30000,
            isTestData: true
        };

        const response = await request(app)
            .post('/ships')
            .send(shipData);
        expect(response.body.message).toBe('Nave adicionada');
        const ships = await Ship.find();
        expect(ships.length).toBe(1);
        expect(ships[0].name).toBe('Star Fork');
    });

    it('should list all ships', async () => {

        const ship2 = new Ship({
            name: 'Battle Dias',
            type: 'Battle',
            registrationNumber: 'SC4035',
            capacity: 8400,
            fuelLevel: 350,
            weightCapacity: 35000,
            isTestData: true
        });
        await ship2.save();

        const response = await request(app).get('/ships');
        expect(response.body.length).toBe(2);
        expect(response.body[1].name).toBe('Battle Dias');
    });
});
