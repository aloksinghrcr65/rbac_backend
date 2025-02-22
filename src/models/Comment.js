const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const commentSchema = new Schema({
    comment: {
       type: String,
       required: true,
       trim: true,
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

const Comment = model('Comment', commentSchema);
module.exports = Comment;