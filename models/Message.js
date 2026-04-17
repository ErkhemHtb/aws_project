const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        maxlength: 280
    },
    date: {
        type: Date,
        default: Date.now
    }
});

messageSchema.index({ date: -1 });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;