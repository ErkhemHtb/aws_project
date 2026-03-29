const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    authorID: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    coor_x: {
        type: Number,
        required: true
    },
    coor_y: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;