// Check if products are stored in localStorage, otherwise use the default list
let products = JSON.parse(localStorage.getItem('products')) || [
    {
        id: 1,
        name: "Fencing Post A",
        description: "Durable treated fencing post ideal for agricultural use.",
        price: 25.00,
        imageUrl: "./WhatsApp Image 2024-10-16 at 11.37.57 AM (2).jpeg",
    },
    {
        id: 2,
        name: "Fibre Post B",
        description: "Lightweight and strong fibre post suitable for various applications.",
        price: 30.00,
        imageUrl: "./WhatsApp Image 2024-10-16 at 11.38.40 AM.jpeg",
    },
    {
        id: 3,
        name: "Kenya Power Post C",
        description: "High-quality treated post designed for electrical installations.",
        price: 40.00,
        imageUrl: "./WhatsApp Image 2024-10-16 at 11.38.45 AM(1).jpeg",
    },
    {
        id: 4,
        name: "Kenya Power Post D",
        description: "High-quality treated post designed for electrical installations.",
        price: 60.00,
        imageUrl: "./WhatsApp Image 2024-10-16 at 11.38.49 AM.jpeg",
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || []; // Retrieve cart from localStorage

// Save products and cart to localStorage
function saveToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to display products
function displayProducts() {
    const productCards = document.getElementById('product-cards');
    productCards.innerHTML = ''; // Clear existing content

    products.forEach(product => {
        productCards.innerHTML += `
            <div class='col-md-4 product-item'>
                <h3>${product.name}</h3>
                <img src="${product.imageUrl}" alt="${product.name}" style='width: 100%; height: auto;'>
                <p>Description: ${product.description}</p>
                <p>Price: $${product.price.toFixed(2)}</p>
                <button class='btn btn-primary' onclick='addToCart(${product.id})'>Add to Cart</button>
                <button class='btn btn-danger' onclick='openDeleteModal(${product.id})'>Delete</button>
                <button class='btn btn-secondary' onclick='openUpdateModal(${product.id})'>Update</button>
            </div>`;
    });
}

// Function to add a product to the cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const productInCart = cart.find(p => p.id === productId);
        if (productInCart) {
            alert(`${product.name} is already in your cart!`);
        } else {
            cart.push(product);
            alert(`${product.name} has been added to your cart!`);
            saveToLocalStorage(); // Save to localStorage
            updateCartDisplay();
        }
    } else {
        console.error("Product not found!");
    }
}

// Function to update cart display
function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cart-content');
    cartItemsDiv.innerHTML = ''; // Clear existing cart items
    let totalPrice = 0;

    cart.forEach(item => {
        cartItemsDiv.innerHTML += `<p>${item.name} - $${item.price.toFixed(2)}</p>`;
        totalPrice += item.price; // Sum up total price
    });

    document.getElementById('total-price').innerText = `Total Price: $${totalPrice.toFixed(2)}`;
}

// Function to handle checkout
function checkout() {
    if (cart.length > 0) {
        const confirmation = confirm('Are you sure you want to proceed with the purchase?');
        if (confirmation) {
            alert('Thank you for your purchase!');
            cart = []; // Clear the cart after checkout
            saveToLocalStorage(); // Save updated cart to localStorage
            updateCartDisplay(); // Update cart display
        }
    } else {
        alert('Your cart is empty!');
    }
}

// Function to open delete modal
function openDeleteModal(productId) {
    document.getElementById('deleteModal').style.display = 'block';
    document.getElementById('confirm-delete').onclick = () => deleteProduct(productId);
}

// Function to delete a product
function deleteProduct(productId) {
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        products.splice(index, 1); // Remove product from array
        alert(`Product ID ${productId} deleted!`);
        saveToLocalStorage(); // Save to localStorage
        closeModal('deleteModal');
        displayProducts(); // Refresh the product list
    } else {
        console.error("Product not found!");
    }
}

// Function to close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Function to open update modal
function openUpdateModal(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('purchase-section').style.display = 'block';

        const updateButton = document.getElementById('update-button');
        updateButton.onclick = (event) => updateProduct(event, productId);
    }
}

// Function to update a product
function updateProduct(event, productId) {
    event.preventDefault(); // Prevent the default form submission
    const updatedDescription = document.getElementById('product-description').value;
    const updatedPrice = parseFloat(document.getElementById('product-price').value);

    if (isNaN(updatedPrice) || updatedPrice <= 0 || updatedDescription.trim() === '') {
        alert('Please provide valid product details.');
        return;
    }

    const product = products.find(p => p.id === productId);
    if (product) {
        product.description = updatedDescription;
        product.price = updatedPrice;
        alert(`Product ID ${productId} updated!`);
        saveToLocalStorage(); // Save to localStorage
        closeModal('purchase-section');
        displayProducts(); // Refresh the product list after update
    } else {
        console.error("Product not found!");
    }
}

// Function to open product creation modal
function openCreateProductModal() {
    document.getElementById('createProductModal').style.display = 'block';
}

// Function to close product creation modal
function closeCreateProductModal() {
    document.getElementById('createProductModal').style.display = 'none';
    document.getElementById('create-product-form').reset(); // Reset the form
}

// Function to handle product creation
function handleCreateProduct(event) {
    event.preventDefault(); // Prevent default form submission

    // Get values from the form
    const productName = document.getElementById('product-name').value;
    const productDescription = document.getElementById('product-description').value;
    const productImage = document.getElementById('product-image').value; // Ensure you have a corresponding input for the image URL
    const productPrice = parseFloat(document.getElementById('product-price').value);

    if (!productName || !productDescription || isNaN(productPrice) || productPrice <= 0) {
        alert('Please fill out all fields correctly.');
        return;
    }

    // Create new product object
    const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1, // Auto-increment ID
        name: productName,
        description: productDescription,
        price: productPrice,
        imageUrl: productImage
    };

    products.push(newProduct); // Add new product to the array
    saveToLocalStorage(); // Save to localStorage

    alert("New product created successfully!");

    // Close the modal and refresh products
    closeCreateProductModal();
    displayProducts();
}

// Initial call to display products and update cart on page load
displayProducts();
updateCartDisplay();

// Event listeners for opening the modals
document.querySelector('.btn-outline-primary').addEventListener('click', function() {
    openModal('loginModal');
});

document.querySelector('.btn-primary').addEventListener('click', function() {
    openModal('registerModal');
});

// Close the modal when clicking outside of it
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

function openLoginModal() {
    document.getElementById("loginModal").style.display = "block";
}

function closeLoginModal() {
    document.getElementById("loginModal").style.display = "none";
}

function openRegisterModal() {
    document.getElementById("registerModal").style.display = "block";
}

function closeRegisterModal() {
    document.getElementById("registerModal").style.display = "none";
}

// Handle Login Form Submission
function handleLogin(event) {
    event.preventDefault();
    // Handle login logic here
    closeLoginModal();
}

// Handle Register Form Submission
function handleRegister(event) {
    event.preventDefault();
    // Handle registration logic here
    closeRegisterModal();
}

// Function to open the cart
function openCart() {
    const cartSection = document.getElementById('cart-section');
    const cartContent = document.getElementById('cart-content');

    if (cart.length === 0) {
        cartContent.innerHTML = '<p>Your cart is currently empty.</p>';
    } else {
        const cartItems = cart.map(item => `<p>${item.name} - $${item.price.toFixed(2)}</p>`).join('');
        cartContent.innerHTML = cartItems;
    }

    cartSection.style.display = 'block';
}

// Function to close the cart
function closeCart() {
    document.getElementById('cart-section').style.display = 'none';
}

// Add event listeners for modal buttons
document.getElementById('open-cart-btn').addEventListener('click', openCart);
document.getElementById('close-cart-btn').addEventListener('click', closeCart);
document.getElementById('checkout-btn').addEventListener('click', checkout);
document.getElementById('create-product-btn').addEventListener('click', openCreateProductModal);
document.getElementById('close-create-modal').addEventListener('click', closeCreateProductModal);
document.getElementById('create-product-form').addEventListener('submit', handleCreateProduct);

