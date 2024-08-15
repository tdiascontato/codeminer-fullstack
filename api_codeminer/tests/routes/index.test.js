// codeminer/api_codeminer/tests/routes/index.test.js
const request = require('supertest');
const app = require('../../src/app');
const {describe, it, expect} = require("@jest/globals");

describe('Test API Routes', () => {
    it('should have /pilots route', async () => {
        const response = await request(app).get('/api/pilots');
        expect(response.statusCode).toBe(200);
    });

    it('should have /ships route', async () => {
        const response = await request(app).get('/api/ships');
        expect(response.statusCode).toBe(200);
    });

    it('should have /contracts route', async () => {
        const response = await request(app).get('/api/contracts');
        expect(response.statusCode).toBe(200);
    });
});