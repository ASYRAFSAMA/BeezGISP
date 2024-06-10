const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const db = require('./db');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use CORS
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));



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

// Registration route
app.post('/register', async (req, res) => {
  const { customername, customerdob, customeremail, customerphonenum, customeraddress, password } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO customer (customername, customerdob, customeremail, customerphonenum, customeraddress, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [customername, customerdob, customeremail, customerphonenum, customeraddress, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error in /register route:', err);
    res.status(500).send('Something went wrong!');
  }
});

// Login route (for demonstration purposes, this doesn't include actual authentication logic)
app.post('/login', async (req, res) => {
  const { customeremail, password } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM customer WHERE customeremail = $1 AND password = $2',
      [customeremail, password]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Login successful', user: result.rows[0] });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Error in /login route:', err);
    res.status(500).send('Something went wrong!');
  }
});

// app.js


// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to add a new product
app.post('/add-product', upload.single('productImage'), async (req, res) => {
    const { productType, productName, productQuantity, productPrice } = req.body;
    const productImage = req.file ? req.file.filename : null;
  
    if (!productType || !productName || !productQuantity || !productPrice || !productImage) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      const result = await pool.query(
        'INSERT INTO products (type, name, quantity, price, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [productType, productName, productQuantity, productPrice, productImage]
      );
      res.status(201).json({ message: 'Product added successfully', product: result.rows[0] });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ message: 'Failed to add product' });
    }
  });
  
  // Endpoint to get all products
  app.get('/products', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM products');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
