// src/config/db.js
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

let _db = null;
let _client = null;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tnxofuo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=${process.env.DB_NAME}`;

const clientOptions = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    tls: true,
    maxPoolSize: 5, // small pool for free tier
    minPoolSize: 1,
};

async function connectDB() {
    if (_db) return _db; // reuse

    if (!_client) {
        _client = new MongoClient(uri, clientOptions);
    }

    try {
        await _client.connect();
        _db = _client.db(process.env.DB_NAME);
        console.log('✅ MongoDB connected (centralized)');
        return _db;
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err);
        throw err;
    }
}

function getClient() {
    return _client;
}

module.exports = {
    connectDB,
    getClient,
};
