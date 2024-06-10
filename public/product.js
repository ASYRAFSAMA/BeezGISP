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

//delete
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();

  document.getElementById('updateProductForm').addEventListener('submit', async function (event) {
      event.preventDefault();
      const productId = document.getElementById('updateProductId').value;
      const productName = document.getElementById('updateProductName').value;
      const productQuantity = document.getElementById('updateProductQuantity').value;
      const productPrice = document.getElementById('updateProductPrice').value;

      try {
          const response = await fetch(`/update-product/${productId}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ productName, productQuantity, productPrice })
          });

          if (response.ok) {
              alert('Product updated successfully!');
              document.getElementById('updateFormContainer').style.display = 'none';
              loadProducts(); // reload the products to show the updated data
          } else {
              alert('Failed to update product.');
          }
      } catch (error) {
          console.error('Error updating product:', error);
          alert('Error updating product.');
      }
  });
});

async function loadProducts() {
  try {
      const response = await fetch('/products');
      const products = await response.json();

      const productList = document.getElementById('productList');
      productList.innerHTML = '';

      products.forEach(product => {
          const productElement = document.createElement('div');
          productElement.className = 'product';
          productElement.dataset.id = product.productid;
          productElement.dataset.name = product.productname;
          productElement.dataset.price = product.productprice;
          productElement.dataset.quantity = product.productquantity;
          productElement.dataset.type = product.producttype;
          productElement.dataset.img = `data:image/jpeg;base64,${product.productimage}`;

          productElement.innerHTML = `
              <img src="${productElement.dataset.img}" alt="${product.productname}">
              <h3>${product.productname}</h3>
              <p class="pid">Product ID: ${product.productid}</p>
              <p class="price">RM ${product.productprice}</p>
              <p class="quantity">Quantity available: ${product.productquantity}</p>
              <p class="product-type">Product Type: ${product.producttype}</p>
              <button class="update-btn">Update</button>
              <button class="delete-btn">Delete</button>
          `;

          productList.appendChild(productElement);

          productElement.querySelector('.delete-btn').addEventListener('click', async (event) => {
              const confirmed = confirm(`Are you sure you want to delete product ID ${product.productid}?`);
              if (!confirmed) return;

              try {
                  const response = await fetch(`/delete-product/${product.productid}`, {
                      method: 'DELETE',
                  });

                  if (response.ok) {
                      productElement.remove();
                      alert('Product deleted successfully!');
                  } else {
                      alert('Failed to delete product.');
                  }
              } catch (error) {
                  console.error('Error deleting product:', error);
                  alert('Error deleting product.');
              }
          });

          productElement.querySelector('.update-btn').addEventListener('click', () => {
              document.getElementById('updateProductId').value = product.productid;
              document.getElementById('updateProductName').value = product.productname;
              document.getElementById('updateProductQuantity').value = product.productquantity;
              document.getElementById('updateProductPrice').value = product.productprice;

              document.getElementById('updateFormContainer').style.display = 'block';
          });
      });
  } catch (error) {
      console.error('Error loading products:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.update-btn').forEach(button => {
      button.addEventListener('click', (event) => {
          const productDiv = event.target.closest('.product');
          const productId = productDiv.getAttribute('data-id');
          window.location.href = `/update.html?productId=${productId}`;
      });
  });
});
