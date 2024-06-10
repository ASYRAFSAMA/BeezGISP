const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const db = require('./db');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use CORS
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define a route to test the database connection
app.get('/time', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in /time route:', err);
    res.status(500).send('Something went wrong!');
  }
});

// Route to create a new product
app.post('/add-products', upload.single('productImage'), async (req, res) => {
  const { productType, productName, productQuantity, productPrice } = req.body;
  const productImage = req.file ? req.file.buffer : null;

  try {
    const query = `
      INSERT INTO product (producttype, productname, productquantity, productprice, productimage)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [productType, productName, parseInt(productQuantity, 10), parseFloat(productPrice), productImage];
    
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error in /products route:', err);
    res.status(500).send('Something went wrong!');
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
