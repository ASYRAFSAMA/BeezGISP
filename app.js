const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage: storage });

// Route to add a new product
app.post('/add-product', upload.single('productImage'), async (req, res) => {
    const { productType, productName, productQuantity, productPrice } = req.body;
    const productImage = req.file ? req.file.filename : null;

    if (!productType || !productName || !productQuantity || !productPrice || !productImage) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const result = await db.query(
            'INSERT INTO product (producttype, productname, productquantity, productprice, productimage) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [productType, productName, productQuantity, productPrice, productImage]
        );
        res.status(201).json({ message: 'Product added successfully', product: result.rows[0] });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Failed to add product' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
