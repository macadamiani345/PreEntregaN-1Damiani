import mongoose from 'mongoose';
import Product from '../models/Product.js';

class ProductManager {
    async getProducts() {
        return Product.find().lean();
    }

    buildFilter(query) {
        if (query === undefined || query === null || query === '') {
            return {};
        }

        const normalizedQuery = String(query).trim().toLowerCase();

        if (normalizedQuery === 'true') {
            return { status: true };
        }

        if (normalizedQuery === 'false') {
            return { status: false };
        }

        return { category: String(query).trim() };
    }

    async getPaginatedProducts({ limit = 10, page = 1, sort, query } = {}) {
        const parsedLimit = Number(limit);
        const parsedPage = Number(page);

        const limitValue = Number.isNaN(parsedLimit) || parsedLimit <= 0 ? 10 : Math.floor(parsedLimit);
        const requestedPage = Number.isNaN(parsedPage) || parsedPage <= 0 ? 1 : Math.floor(parsedPage);

        const filter = this.buildFilter(query);
        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
        const totalDocs = await Product.countDocuments(filter);
        const totalPages = totalDocs === 0 ? 0 : Math.ceil(totalDocs / limitValue);
        const currentPage = totalPages === 0 ? 1 : Math.min(requestedPage, totalPages);
        const skip = totalPages === 0 ? 0 : (currentPage - 1) * limitValue;

        const payload = await Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitValue)
            .lean();

        const hasPrevPage = currentPage > 1 && totalPages > 0;
        const hasNextPage = currentPage < totalPages;

        return {
            status: 'success',
            payload,
            totalPages,
            prevPage: hasPrevPage ? currentPage - 1 : null,
            nextPage: hasNextPage ? currentPage + 1 : null,
            page: currentPage,
            hasPrevPage,
            hasNextPage,
            limit: limitValue
        };
    }

    async getProductById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        return Product.findById(id).lean();
    }

    async addProduct(productData) {
        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
        if (!requiredFields.every((field) => productData[field] !== undefined && productData[field] !== null && productData[field] !== '')) {
            throw new Error('Faltan campos obligatorios');
        }

        const product = await Product.create({
            ...productData,
            status: productData.status !== undefined ? productData.status : true,
            thumbnails: productData.thumbnails || []
        });

        return product.toObject();
    }

    async updateProduct(id, updateData) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Producto no encontrado');
        }

        const sanitizedData = { ...updateData };
        delete sanitizedData.id;
        delete sanitizedData._id;

        const updatedProduct = await Product.findByIdAndUpdate(id, sanitizedData, {
            new: true,
            runValidators: true,
            lean: true
        });

        if (!updatedProduct) {
            throw new Error('Producto no encontrado');
        }

        return updatedProduct;
    }

    async deleteProduct(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Producto no encontrado');
        }

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            throw new Error('Producto no encontrado');
        }

        return true;
    }
}

export default ProductManager;