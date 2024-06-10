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

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async (event) => {
          const productId = event.target.closest('.product').dataset.id;

          const confirmed = confirm(`Are you sure you want to delete product ID ${productId}?`);
          if (!confirmed) return;

          try {
              const response = await fetch(`/delete-product/${productId}`, {
                  method: 'DELETE',
              });

              if (response.ok) {
                  event.target.closest('.product').remove();
                  alert('Product deleted successfully!');
              } else {
                  alert('Failed to delete product.');
              }
          } catch (error) {
              console.error('Error deleting product:', error);
              alert('Error deleting product.');
          }
      });
  });
});


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.update-btn').forEach(button => {
      button.addEventListener('click', (event) => {
          const product = event.target.closest('.product');
          const productId = product.dataset.id;
          const productName = product.dataset.name;
          const productQuantity = product.dataset.quantity;
          const productPrice = product.dataset.price;

          document.getElementById('updateProductId').value = productId;
          document.getElementById('updateProductName').value = productName;
          document.getElementById('updateProductQuantity').value = productQuantity;
          document.getElementById('updateProductPrice').value = productPrice;

          document.getElementById('updateFormContainer').style.display = 'block';
      });
  });

  document.getElementById('updateProductForm').addEventListener('submit', async function (event) {
      event.preventDefault();
      const productId = document.getElementById('updateProductId').value;
      const formData = new FormData(this);

      try {
          const response = await fetch(`/update-product/${productId}`, {
              method: 'PUT',
              body: formData,
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          if (response.ok) {
              alert('Product updated successfully!');
              document.getElementById('updateFormContainer').style.display = 'none';
              location.reload(); // reload the page to show updated product
          } else {
              alert('Failed to update product.');
          }
      } catch (error) {
          console.error('Error updating product:', error);
          alert('Error updating product.');
      }
  });
});

