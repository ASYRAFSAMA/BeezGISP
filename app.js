const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');
const app = express();

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



//product________________________________

// Middleware to parse JSON bodies
app.use(express.json());

// Use CORS
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define route to add a new product
app.post('/add-product', async (req, res) => {
    try {
        const { productType, productName, productQuantity, productPrice } = req.body;
        // Insert the product data into the database
        const result = await db.query('INSERT INTO product (producttype, productname, productquantity, productprice) VALUES ($1, $2, $3, $4) RETURNING *', [productType, productName, productQuantity, productPrice]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).send('Error adding product');
    }
});

// Other routes and server setup...

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
