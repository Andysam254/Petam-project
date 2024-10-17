const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Create an Express app
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)

// Load the database (db.json)
const dbPath = path.join(__dirname, 'db.json');

function loadDB() {
    const data = fs.readFileSync(dbPath);
    return JSON.parse(data);
}

function saveDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Routes
// Get all products
app.get('/products', (req, res) => {
    const db = loadDB();
    res.json(db.products);
});

// Purchase product
app.post('/purchase', (req, res) => {
    const { productId } = req.body;
    const db = loadDB();
    const product = db.products.find(p => p.id === productId);
    if (product) {
        res.json({ success: true, message: `You purchased ${product.name} for $${product.price}` });
    } else {
        res.status(404).json({ success: false, message: 'Product not found' });
    }
});

// Delete product
app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const db = loadDB();
    const updatedProducts = db.products.filter(p => p.id !== productId);
    if (updatedProducts.length < db.products.length) {
        db.products = updatedProducts;
        saveDB(db);
        res.json({ success: true, message: `Deleted product with ID: ${productId}` });
    } else {
        res.status(404).json({ success: false, message: 'Product not found' });
    }
});

// Update product
app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedDetails = req.body;
    const db = loadDB();
    const productIndex = db.products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        db.products[productIndex] = { ...db.products[productIndex], ...updatedDetails };
        saveDB(db);
        res.json({ success: true, message: `Updated product with ID: ${productId}` });
    } else {
        res.status(404).json({ success: false, message: 'Product not found' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost5500:${PORT}`);
});
