import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        code: { type: String, required: true, unique: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        status: { type: Boolean, default: true },
        stock: { type: Number, required: true, min: 0 },
        category: { type: String, required: true, trim: true, index: true },
        thumbnails: { type: [String], default: [] }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

productSchema.index({ category: 1, status: 1, price: 1 });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
