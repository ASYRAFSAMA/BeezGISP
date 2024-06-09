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
          // Optionally, you can refresh the product list or update the UI after adding the product
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
              const listItem = document.createElement('li');
              listItem.textContent = `${product.productname} - ${product.producttype} - ${product.productquantity} - $${product.productprice}`;
              productList.appendChild(listItem);
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

// Fetch and display products when the page loads
document.addEventListener('DOMContentLoaded', fetchProducts);
