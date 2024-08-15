// codeminer/api_codeminer/jest.setup.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { beforeAll, afterAll, afterEach } = require('@jest/globals');

let mongoServer;

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    }
});

afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        if (mongoServer) {
            await mongoServer.stop();
        }
    }
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({ isTestData: true });//coloquei essa config json
    }
});
