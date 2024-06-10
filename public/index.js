document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const productType = document.getElementById('productType').value;
    const productQuantity = document.getElementById('productQuantity').value;
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productImage = document.getElementById('productImage').files[0];
  
    const formData = new FormData();
    formData.append('productType', productType);
    formData.append('productQuantity', productQuantity);
    formData.append('productName', productName);
    formData.append('productPrice', productPrice);
    formData.append('productImage', productImage);
  
    try {
      const response = await fetch('/add-product', {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        const product = await response.json();
        console.log('Product created:', product);
        // Optionally, refresh the product list or give feedback to the user
      } else {
        console.error('Failed to create product');
      }
    } catch (err) {
      console.error('Error:', err);
    }
});
