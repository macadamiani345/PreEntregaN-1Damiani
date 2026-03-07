import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js';

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

const buildProductsViewLink = (req, page, cartId) => {
    if (!page) return null;

    const params = new URLSearchParams(req.query);
    params.set('page', String(page));

    if (cartId) {
        params.set('cid', String(cartId));
    }

    return `/products?${params.toString()}`;
};

router.get('/', async (req, res) => {
    res.redirect('/products');
});

router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        let { cid } = req.query;

        if (!cid) {
            const newCart = await cartManager.createCart();
            const redirectParams = new URLSearchParams(req.query);
            redirectParams.set('cid', String(newCart._id));
            return res.redirect(`/products?${redirectParams.toString()}`);
        }

        const result = await productManager.getPaginatedProducts({ limit, page, sort, query });

        return res.render('index', {
            title: 'Productos',
            products: result.payload,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: buildProductsViewLink(req, result.prevPage, cid),
            nextLink: buildProductsViewLink(req, result.nextPage, cid),
            query: query || '',
            sort: sort || '',
            limit: result.limit,
            cartId: cid,
            selectedAsc: sort === 'asc',
            selectedDesc: sort === 'desc',
            selectedNone: !sort || (sort !== 'asc' && sort !== 'desc')
        });
    } catch (error) {
        return res.status(500).send('Error al cargar productos');
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        let { cid } = req.query;

        if (!cid) {
            const newCart = await cartManager.createCart();
            return res.redirect(`/products/${req.params.pid}?cid=${newCart._id}`);
        }

        const product = await productManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).render('productDetail', {
                title: 'Producto no encontrado',
                notFound: true,
                cartId: cid
            });
        }

        return res.render('productDetail', {
            title: product.title,
            product,
            cartId: cid
        });
    } catch (error) {
        return res.status(500).send('Error al cargar detalle del producto');
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid, { populate: true });
        if (!cart) {
            return res.status(404).render('cart', {
                title: 'Carrito no encontrado',
                notFound: true,
                products: [],
                cartId: req.params.cid,
                total: '0.00'
            });
        }

        const products = cart.products.map((item) => {
            const unitPrice = item.product?.price || 0;
            const subtotalNumber = unitPrice * item.quantity;
            return {
                ...item,
                subtotal: subtotalNumber.toFixed(2)
            };
        });

        const total = products
            .reduce((acc, item) => acc + Number(item.subtotal), 0)
            .toFixed(2);

        return res.render('cart', {
            title: 'Carrito',
            cartId: String(cart._id),
            products,
            total
        });
    } catch (error) {
        return res.status(500).send('Error al cargar carrito');
    }
});

export default router;
