// product.js

document.getElementById('productForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const formData = new FormData(this);
  try {
      const response = await fetch('/add-product', {
          method: 'POST',
          body: formData
      });
      if (response.ok) {
          const data = await response.json();
          alert('Product added successfully!');
          fetchProducts();
      } else {
          console.error('Failed to add product');
          alert('Failed to add product');
      }
  } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
  }
});

async function fetchProducts() {
  try {
      const response = await fetch('/products');
      if (response.ok) {
          const products = await response.json();
          const productList = document.getElementById('productList');
          productList.innerHTML = '';

          products.forEach(product => {
              const productDiv = document.createElement('div');
              productDiv.className = 'product';
              productDiv.dataset.id = product.productid;
              productDiv.dataset.name = product.productname;
              productDiv.dataset.price = product.productprice;
              productDiv.dataset.quantity = product.productquantity;
              productDiv.dataset.type = product.producttype;
              productDiv.dataset.img = product.productimage ? `data:image/jpeg;base64,${product.productimage}` : 'default.jpg';

              productDiv.innerHTML = `
                  <img src="${productDiv.dataset.img}" alt="${product.productname}">
                  <h3>${product.productname}</h3>
                  <p class="pid">Product ID: ${product.productid}</p>
                  <p class="price">RM ${product.productprice}</p>
                  <p class="quantity">Quantity available: ${product.productquantity}</p>
                  <p class="product-type">Product Type: ${product.producttype}</p>
                  <button class="update-btn">Update</button>
                  <button class="delete-btn">Delete</button>
              `;
              productList.appendChild(productDiv);
          });
      } else {
          console.error('Failed to fetch products');
          alert('Failed to fetch products');
      }
  } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error fetching products');
  }
}

document.addEventListener('DOMContentLoaded', fetchProducts);
