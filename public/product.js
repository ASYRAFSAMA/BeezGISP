document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productImage = document.getElementById('productImage').files[0];

    if (productName && productPrice && productImage) {
        // Add product logic here
        alert('Product added successfully!');
    } else {
        alert('Please fill out all fields.');
    }
});
