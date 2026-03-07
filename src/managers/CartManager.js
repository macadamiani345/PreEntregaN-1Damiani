import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

class CartManager {
    validateObjectId(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }

    async createCart() {
        const newCart = await Cart.create({ products: [] });
        return newCart.toObject();
    }

    async getCartById(id, { populate = false } = {}) {
        if (!this.validateObjectId(id)) {
            return null;
        }

        let query = Cart.findById(id);
        if (populate) {
            query = query.populate('products.product');
        }

        return query.lean();
    }

    async addProductToCart(cartId, productId) {
        if (!this.validateObjectId(cartId)) throw new Error('Carrito no encontrado');
        if (!this.validateObjectId(productId)) throw new Error('Producto no encontrado');

        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        const productExists = await Product.exists({ _id: productId });
        if (!productExists) throw new Error('Producto no encontrado');

        const existingProduct = cart.products.find((item) => item.product.toString() === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();
        return cart.toObject();
    }

    async removeProductFromCart(cartId, productId) {
        if (!this.validateObjectId(cartId)) throw new Error('Carrito no encontrado');
        if (!this.validateObjectId(productId)) throw new Error('Producto no encontrado');

        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        const initialLength = cart.products.length;
        cart.products = cart.products.filter((item) => item.product.toString() !== productId);

        if (cart.products.length === initialLength) {
            throw new Error('Producto no encontrado en el carrito');
        }

        await cart.save();
        return cart.toObject();
    }

    async updateCartProducts(cartId, products) {
        if (!this.validateObjectId(cartId)) throw new Error('Carrito no encontrado');
        if (!Array.isArray(products)) throw new Error('Debe enviar un arreglo de productos');

        const normalizedProducts = products.map((item) => ({
            product: item?.product,
            quantity: Number(item?.quantity)
        }));

        for (const item of normalizedProducts) {
            if (!this.validateObjectId(item.product)) {
                throw new Error('Uno o más productos no son válidos');
            }

            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                throw new Error('La cantidad debe ser un entero mayor a 0');
            }
        }

        const uniqueProductIds = [...new Set(normalizedProducts.map((item) => item.product.toString()))];
        const existingProductsCount = await Product.countDocuments({ _id: { $in: uniqueProductIds } });
        if (existingProductsCount !== uniqueProductIds.length) {
            throw new Error('Uno o más productos no existen');
        }

        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = normalizedProducts;
        await cart.save();
        return cart.toObject();
    }

    async updateProductQuantity(cartId, productId, quantity) {
        if (!this.validateObjectId(cartId)) throw new Error('Carrito no encontrado');
        if (!this.validateObjectId(productId)) throw new Error('Producto no encontrado');

        const parsedQuantity = Number(quantity);
        if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
            throw new Error('La cantidad debe ser un entero mayor a 0');
        }

        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        const productInCart = cart.products.find((item) => item.product.toString() === productId);
        if (!productInCart) throw new Error('Producto no encontrado en el carrito');

        productInCart.quantity = parsedQuantity;
        await cart.save();
        return cart.toObject();
    }

    async clearCart(cartId) {
        if (!this.validateObjectId(cartId)) throw new Error('Carrito no encontrado');

        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = [];
        await cart.save();
        return cart.toObject();
    }
}

export default CartManager;