const addToCartButtons = document.querySelectorAll('.add-to-cart');

const addProductToCart = async (cartId, productId) => {
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'No se pudo agregar el producto al carrito');
        }

        alert('Producto agregado al carrito');
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};

addToCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const cartId = button.dataset.cartId;
        const productId = button.dataset.productId;

        if (!cartId || !productId) {
            alert('No se encontró el carrito o el producto');
            return;
        }

        addProductToCart(cartId, productId);
    });
});
