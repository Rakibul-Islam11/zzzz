// src/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Firebase Admin init (placeholder)
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase admin initialized');
} catch (e) {
    console.warn('⚠️ Firebase serviceAccountKey.json not found or invalid — make sure to upload it in production.');
}

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5175", "http://localhost:5176",
        "http://localhost:5174", "http://localhost:5173",
        "https://bijoy313.com", "https://bijoy-project-da7d9.web.app",
        "https://bijoy-project-da7d9.firebaseapp.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

// Root
app.get('/', (req, res) => {
    res.send('✅ Bijoy Server is running');
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
