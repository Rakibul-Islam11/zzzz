// src/routes/products.js
const express = require('express');
const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/db');

const router = express.Router();

// POST /api/products
router.post('/', async (req, res) => {
    try {
        const db = await connectDB();
        const productsCollection = db.collection('products');

        const productData = req.body;
        if (!productData.productName || !productData.mainCategory || !productData.description) {
            return res.status(400).json({
                success: false,
                message: 'Product name, category, and description are required'
            });
        }

        productData.createdAt = new Date();
        productData.updatedAt = new Date();

        const result = await productsCollection.insertOne(productData);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            productId: result.insertedId
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

// GET /api/products?limit=10&skip=0
router.get('/', async (req, res) => {
    try {
        const db = await connectDB();
        const productsCollection = db.collection('products');

        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = parseInt(req.query.skip, 10) || 0;

        const products = await productsCollection.find()
            .skip(skip)
            .limit(limit)
            .toArray();

        const total = await productsCollection.countDocuments();

        res.status(200).json({ success: true, products, total });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const db = await connectDB();
        const productsCollection = db.collection('products');

        const productId = req.params.id;
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID format' });
        }

        const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
