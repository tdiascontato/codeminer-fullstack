// codeminer/api_codeminer/tests/controllers/pilotsController.test.js
const request = require('supertest');
const express = require('express');
const Pilot = require('../../src/models/pilot');
const pilotsController = require('../../src/controllers/pilotsController');
const { describe, it, afterEach, expect } = require('@jest/globals');

const app = express();
app.use(express.json());

app.post('/pilots', pilotsController.addPilot);
app.get('/pilots', pilotsController.listPilots);

describe('Pilots Controller', () => {

    afterEach(async () => {
        await Pilot.deleteMany({ isTestData: true });
    });

    it('should add a new pilot', async () => {
        const pilot = {
            name: 'Tiago Dias',
            age: 26,
            license: '12345ABC',
            location: 'Earth',
            certification: `Pilot Certified ${Date.now()}`,
            isTestData: true
        };

        const response = await request(app)
            .post('/pilots')
            .send(pilot);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Piloto adicionado');

        const pilots = await Pilot.find();
        expect(pilots.length).toBe(1);
        expect(pilots[0].name).toBe('Tiago Dias');
    });

    it('should list all pilots', async () => {
        const pilot2 = new Pilot({
            name: 'Manoela Dias',
            age: 25,
            license: '67890DEF',
            location: 'Mars',
            certification: `Pilot Certified ${Date.now()}`,
            isTestData: true
        });
        await pilot2.save();

        const response = await request(app).get('/pilots');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
        expect(response.body[0].name).toBe('Tiago Dias');
        expect(response.body[1].name).toBe('Manoela Dias');
    });

});
