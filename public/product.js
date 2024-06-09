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
          // Optionally, you can redirect or update the UI after adding the product
      } else {
          console.error('Failed to add product');
          alert('Failed to add product');
      }
  } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
  }
});
