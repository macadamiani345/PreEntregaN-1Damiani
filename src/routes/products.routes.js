import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager();

const buildPageLink = (req, page) => {
    if (!page) return null;

    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`);
    const queryEntries = Object.entries(req.query || {});

    queryEntries.forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(key, value);
        }
    });

    url.searchParams.set('page', page);
    return url.toString();
};

// GET: Listar productos con filtros/paginación
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const result = await manager.getPaginatedProducts({
            limit,
            page,
            sort,
            query
        });

        res.json({
            status: result.status,
            payload: result.payload,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: buildPageLink(req, result.prevPage),
            nextLink: buildPageLink(req, result.nextPage)
        });
    } catch (err) {
        res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
    }
});

// GET by ID
router.get('/:pid', async (req, res) => {
    try {
        const product = await manager.getProductById(req.params.pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "No encontrado" });
        }
    } catch (err) {
        res.status(500).json({ error: "Error al obtener producto" });
    }
});

// POST: Agregar 
router.post('/', async (req, res) => {
    try {
        const result = await manager.addProduct(req.body);
        res.status(201).json(result);
    } catch (err) {
        const message = err.code === 11000 ? 'El código del producto ya existe' : err.message;
        res.status(400).json({ error: message });
    }
});

// PUT: Actualizar
router.put('/:pid', async (req, res) => {
    try {
        await manager.updateProduct(req.params.pid, req.body);
        res.json({ message: "Actualizado" });
    } catch (err) {
        if (err.message === 'Producto no encontrado') {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
});

// DELETE
router.delete('/:pid', async (req, res) => {
    try {
        await manager.deleteProduct(req.params.pid);
        res.json({ message: "Eliminado" });
    } catch (err) {
        if (err.message === 'Producto no encontrado') {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
});

export default router;