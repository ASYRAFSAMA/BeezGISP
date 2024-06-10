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

          document.querySelectorAll('.update-btn').forEach(button => {
              button.addEventListener('click', handleUpdate);
          });

          document.querySelectorAll('.delete-btn').forEach(button => {
              button.addEventListener('click', handleDelete);
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

async function handleUpdate(event) {
  const productDiv = event.target.closest('.product');
  const productId = productDiv.dataset.id;
  const productName = prompt('Enter new product name', productDiv.dataset.name);
  const productQuantity = prompt('Enter new product quantity', productDiv.dataset.quantity);
  const productPrice = prompt('Enter new product price', productDiv.dataset.price);
  const productType = prompt('Enter new product type', productDiv.dataset.type);
  const productImage = productDiv.dataset.img;

  if (productName && productQuantity && productPrice && productType) {
      const formData = new FormData();
      formData.append('productName', productName);
      formData.append('productQuantity', productQuantity);
      formData.append('productPrice', productPrice);
      formData.append('productType', productType);
      formData.append('productImage', productImage);

      try {
          const response = await fetch(`/api/products/${productId}`, {
              method: 'PUT',
              body: formData
          });
          if (response.ok) {
              alert('Product updated successfully!');
              fetchProducts();
          } else {
              console.error('Failed to update product');
              alert('Failed to update product');
          }
      } catch (error) {
          console.error('Error updating product:', error);
          alert('Error updating product');
      }
  }
}

async function handleDelete(event) {
  const productDiv = event.target.closest('.product');
  const productId = productDiv.dataset.id;
  if (confirm('Are you sure you want to delete this product?')) {
      try {
          const response = await fetch(`/api/products/${productId}`, {
              method: 'DELETE'
          });
          if (response.ok) {
              alert('Product deleted successfully!');
              fetchProducts();
          } else {
              console.error('Failed to delete product');
              alert('Failed to delete product');
          }
      } catch (error) {
          console.error('Error deleting product:', error);
          alert('Error deleting product');
      }
  }
}

document.addEventListener('DOMContentLoaded', fetchProducts);
