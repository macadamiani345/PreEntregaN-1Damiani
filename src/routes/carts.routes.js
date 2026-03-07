import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const manager = new CartManager();

// 1. POST /: Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await manager.createCart();
        res.status(201).json(newCart);
    } catch (err) {
        res.status(500).json({ error: "Error al crear carrito" });
    }
});

// 2. GET /:cid: Listar productos de un carrito específico
router.get('/:cid', async (req, res) => {
    try {
        const cart = await manager.getCartById(req.params.cid, { populate: true });
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ error: "Error al obtener carrito" });
    }
});

// 3. POST /:cid/products/:pid: Agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await manager.addProductToCart(cid, pid);
        
        res.json({ message: "Producto agregado al carrito" });
    } catch (err) {
        if (err.message === 'Carrito no encontrado' || err.message === 'Producto no encontrado') {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: "Error al agregar producto al carrito" });
    }
});

// 4. DELETE /:cid/products/:pid: Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await manager.removeProductFromCart(cid, pid);
        res.json({ message: 'Producto eliminado del carrito' });
    } catch (err) {
        if (
            err.message === 'Carrito no encontrado' ||
            err.message === 'Producto no encontrado' ||
            err.message === 'Producto no encontrado en el carrito'
        ) {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
});

// 5. PUT /:cid: Reemplazar todos los productos del carrito
router.put('/:cid', async (req, res) => {
    try {
        const products = Array.isArray(req.body) ? req.body : req.body.products;
        const updatedCart = await manager.updateCartProducts(req.params.cid, products);
        res.json(updatedCart);
    } catch (err) {
        if (
            err.message === 'Carrito no encontrado' ||
            err.message === 'Debe enviar un arreglo de productos' ||
            err.message === 'Uno o más productos no son válidos' ||
            err.message === 'Uno o más productos no existen' ||
            err.message === 'La cantidad debe ser un entero mayor a 0'
        ) {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
});

// 6. PUT /:cid/products/:pid: Actualizar sólo cantidad
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updatedCart = await manager.updateProductQuantity(cid, pid, quantity);
        res.json(updatedCart);
    } catch (err) {
        if (
            err.message === 'Carrito no encontrado' ||
            err.message === 'Producto no encontrado' ||
            err.message === 'Producto no encontrado en el carrito' ||
            err.message === 'La cantidad debe ser un entero mayor a 0'
        ) {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Error al actualizar la cantidad del producto' });
    }
});

// 7. DELETE /:cid: Vaciar carrito
router.delete('/:cid', async (req, res) => {
    try {
        await manager.clearCart(req.params.cid);
        res.json({ message: 'Carrito vaciado correctamente' });
    } catch (err) {
        if (err.message === 'Carrito no encontrado') {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Error al vaciar carrito' });
    }
});

export default router;
