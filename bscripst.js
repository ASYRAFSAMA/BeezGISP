function openProductPopup(productId) {
    const productDetails = {
        product1: {
            img: 'p1.jpeg',
            name: 'PURE HONEY - GOLDEN',
            description: 'This is a great product.',
            price: '$10.00'
        },
        product2: {
            img: 'p2.jpeg',
            name: 'PURE HONEY - DARK',
            description: 'This is another great product.',
            price: '$20.00'
        },
        product3: {
            img: 'p3.jpeg',
            name: 'PURE HONEY - LIGHT',
            description: 'This product is also great.',
            price: '$30.00'
        },
        product4: {
            img: 'p4.jpeg',
            name: 'SUPER HONEY',
            description: 'This is a great product.',
            price: '$40.00'
        },
        product5: {
            img: 'p5.jpeg',
            name: 'RAW HONEY',
            description: 'This is another great product.',
            price: '$50.00'
        },
        product6: {
            img: 'p6.jpeg',
            name: 'TONGKAT ALI HONEY',
            description: 'This product is also great.',
            price: '$60.00'
        },
        product7: {
            img: 'p7.jpeg',
            name: '4 IN 1 HONEY',
            description: 'This is a great product.',
            price: '$70.00'
        },
        product8: {
            img: 'p10.png',
            name: 'CREAM GINGER HONEY',
            description: 'This is another great product.',
            price: '$80.00'
        },
        product9: {
            img: 'p9.jpeg',
            name: 'DD HONEY',
            description: 'This product is also great.',
            price: '$90.00'
        }
    };

    const product = productDetails[productId];
    if (product) {
        document.getElementById('productDetails').innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>${product.price}</p>
            <button onclick="addToCart('${productId}')">Add to Cart</button>
        `;
        document.getElementById('productPopup').style.display = 'block';
    }
}

function closeProductPopup() {
    document.getElementById('productPopup').style.display = 'none';
    document.getElementById('productDetails').innerHTML = '';
}

function addToCart(productId) {
    alert(`Added ${productId} to cart`);
    closeProductPopup();
}
