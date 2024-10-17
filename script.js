// Fetch and render products from the server
async function fetchProducts() {
    try {
        const response = await fetch('/products'); // Get products from the server
        if (!response.ok) throw new Error('Network response was not ok');
        
        const products = await response.json();
        renderProducts(products); // Render them on the page
    } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to load products. Please try again later.');
    }
}

// Render products to the page
function renderProducts(products) {
    const productContainer = document.getElementById('product-cards');
    productContainer.innerHTML = ''; // Clear existing products

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'col-md-4 product-item';
        card.innerHTML = `
            <h3>${product.name}</h3>
            <img src="${product.image}" alt="${product.name}" style="width: 100%; height: auto;">
            <p>${product.description}</p>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <button onclick="confirmDelete(${product.id})">Delete</button>
            <button onclick="showUpdateForm(${product.id})">Update</button>
        `;
        productContainer.appendChild(card);
    });
}

// Add a product to the cart
async function addToCart(productId) {
    try {
        const response = await fetch('/cart', { // Assuming you have an endpoint for adding to cart
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }),
        });
        
        const result = await response.json();
        alert(result.message); // Notify the user
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add product to cart. Please try again later.');
    }
}

// Delete a product
async function deleteProduct(productId) {
    try {
        const response = await fetch(`/products/${productId}`, {
            method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(result.message); // Notify the user
            fetchProducts(); // Reload products after deletion
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again later.');
    }
}

// Show update form for a product
function showUpdateForm(productId) {
    const newPrice = prompt('Enter the new price:');
    
    if (!newPrice || isNaN(newPrice)) {
        alert('Please enter a valid price.'); // Validate input
        return; 
    }

    updateProduct(productId, parseFloat(newPrice));
}

// Update a product's price
async function updateProduct(productId, newPrice) {
    try {
        const response = await fetch(`/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price: newPrice }),
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(result.message); // Notify the user
            fetchProducts(); // Reload products after update
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product. Please try again later.');
    }
}

// Confirm deletion and show modal
function confirmDelete(productId) {
    const modal = document.getElementById('deleteModal');
    
    modal.style.display = 'block'; // Show the modal

    // Set up the confirm delete button action
    document.getElementById('confirmDeleteBtn').onclick = async function() {
        await deleteProduct(productId); // Call delete function
        closeModal(); // Close the modal
    };
}

// Close modal function
function closeModal() {
    document.getElementById('deleteModal').style.display = 'none'; // Hide the modal
}

// Automatically fetch products when the page loads
window.onload = fetchProducts;
