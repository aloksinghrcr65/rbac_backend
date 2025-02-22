const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const likeSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
});

const Like = model('Like', likeSchema);
module.exports = Like;