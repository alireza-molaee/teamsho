import mongoose from 'mongoose';

export const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    image: String,
});

const Category = mongoose.model('Category', categorySchema);

export default Category;