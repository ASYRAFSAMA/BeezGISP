document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('productId');

    fetch(`/api/products/${productId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('productId').value = data.productid;
            document.getElementById('productName').value = data.productname;
            document.getElementById('productPrice').value = data.productprice;
            document.getElementById('productQuantity').value = data.productquantity;
            document.getElementById('productType').value = data.producttype;
            document.getElementById('productImagePreview').src = `data:image/jpeg;base64,${data.productimage}`;
        })
        .catch(error => console.error('Error:', error));

    document.getElementById('updateProductForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        fetch(`/api/products/${productId}`, {
            method: 'PUT',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('message').textContent = 'Product updated successfully!';
            })
            .catch(error => console.error('Error:', error));
    });
});
