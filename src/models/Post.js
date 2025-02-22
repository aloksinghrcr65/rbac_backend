const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    categories: {
        type: Array,
        required: true,
    }
});

const Post = model('Post', postSchema);
module.exports = Post;