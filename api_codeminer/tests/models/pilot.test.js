// codeminer/api_codeminer/tests/models/pilot.test.js
const request = require('supertest');
const express = require('express');
const Pilot = require('../../src/models/pilot');
const Ship = require('../../src/models/ship');
const { describe, it, expect, afterEach} = require('@jest/globals');
const app = express();
const pilotsController = require('../../src/controllers/pilotsController');

app.use(express.json());
app.post('/pilots', pilotsController.addPilot);
app.get('/pilots', pilotsController.listPilots);

describe('Pilot Controller', () => {
    afterEach(async () => {
        await Pilot.deleteMany({ isTestData: true });
    });

    it('should add a new pilot', async () => {
        const pilotData = {
            name: 'Tiago Dias',
            age: 26,
            license: '12345ABC',
            location: 'Earth',
            certification: `Pilot Certified ${Date.now()}`,
            isTestData: true
        };

        const response = await request(app)
            .post('/pilots')
            .send(pilotData);

        expect(response.body.message).toBe('Piloto adicionado');
        const pilots = await Pilot.find();
        expect(pilots.length).toBe(1);
        expect(pilots[0].name).toBe('Tiago Dias');
    });

    it('should list all pilots', async () => {
        const pilot2 = new Pilot({
            name: 'Manoela Dias',
            age: 26,
            license: '12s45ABC',
            location: 'Mars',
            certification: `Pilot Certified ${Date.now()}`,
            isTestData: true
        });
        await pilot2.save();
        const response = await request(app).get('/pilots');
        expect(response.body.length).toBe(2);
        expect(response.body[0].name).toBe('Tiago Dias');
        expect(response.body[1].name).toBe('Manoela Dias');
    });
});