const express = require('express');
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

// Define route to add a new product
app.post('/add-product', upload.single('productImage'), async (req, res) => {
    try {
        const { productType, productName, productQuantity, productPrice } = req.body;
        const productImage = req.file ? req.file.buffer : null;

        // Insert the product data into the database
        const result = await db.query('INSERT INTO product (producttype, productname, productquantity, productprice, productimage) VALUES ($1, $2, $3, $4, $5) RETURNING *', [productType, productName, productQuantity, productPrice, productImage]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).send('Error adding product');
    }
});

// Define route to get all products
app.get('/products', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM product');
        const products = result.rows.map(product => ({
            ...product,
            productimage: product.productimage ? product.productimage.toString('base64') : null
        }));
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Error fetching products');
    }
});

// Define route to update a product
app.put('/api/products/:id', upload.single('productImage'), async (req, res) => {
  const { id } = req.params;
  const { productName, productQuantity, productPrice, productType } = req.body;
  let productImage = null;
  if (req.file) {
      productImage = req.file.buffer;
  }
  try {
      const query = `
          UPDATE product SET productname = $1, productquantity = $2, productprice = $3, producttype = $4, productimage = $5
          WHERE productid = $6
      `;
      await db.query(query, [productName, productQuantity, productPrice, productType, productImage, id]);
      res.send('Product updated successfully');
  } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).send('Error updating product');
  }
});

// Define route to delete a product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const query = 'DELETE FROM product WHERE productid = $1';
      await db.query(query, [id]);
      res.send('Product deleted successfully');
  } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).send('Error deleting product');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
