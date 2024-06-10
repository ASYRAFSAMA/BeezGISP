const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const db = require('./db');
const dotenv = require('dotenv');
const fs = require('fs');
const { Pool } = require('pg');


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


// Add product route
app.post('/add-product', upload.single('productImage'), async (req, res) => {
    const { productType, productName, productQuantity, productPrice } = req.body;
    const productImage = req.file ? req.file.buffer : null;
  
    try {
      await db.query(
        'INSERT INTO product (producttype, productname, productquantity, productprice, productimage) VALUES ($1, $2, $3, $4, $5)',
        [productType, productName, productQuantity, productPrice, productImage]
      );
      res.status(201).json({ message: 'Product added successfully' });
    } catch (err) {
      console.error('Error adding product:', err);
      res.status(500).send('Error adding product');
    }
  });


// Get product by id route
app.get('/product/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM product WHERE productid = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Product not found');
        }
        const product = result.rows[0];
        product.productimage = product.productimage ? product.productimage.toString('base64') : null;
        res.json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).send('Error fetching product');
    }
});

// Define route to delete products
app.delete('/delete-product/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        await db.query('DELETE FROM product WHERE productid = $1', [productId]);
        res.status(200).send('Product deleted successfully');
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).send('Error deleting product');
    }
});


// Define route to update products


//Add an endpoint in your Express app to fetch product details by ID.
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM product WHERE productid = $1', [id]);
        if (result.rows.length > 0) {
            const product = result.rows[0];
            res.json({
                productid: product.productid,
                producttype: product.producttype,
                productname: product.productname,
                productquantity: product.productquantity,
                productprice: product.productprice,
                productimage: product.productimage ? product.productimage.toString('base64') : null
            });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


//Add an endpoint in your Express app to handle the product update.


//Fetch All Products
app.get('/products', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM product');
        const products = result.rows.map(product => ({
            productid: product.productid,
            producttype: product.producttype,
            productname: product.productname,
            productquantity: product.productquantity,
            productprice: product.productprice,
            productimage: product.productimage ? product.productimage.toString('base64') : null
        }));
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// Other routes and server setup...

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});