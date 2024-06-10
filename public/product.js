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
          const errorText = await response.text();
          console.error('Failed to add product:', errorText);
          alert(`Failed to add product: ${errorText}`);
      }
  } catch (error) {
      console.error('Error adding product:', error);
      alert(`Error adding product: ${error.message}`);
  }
});
