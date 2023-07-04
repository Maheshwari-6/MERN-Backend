const mongoose = require("mongoose");
const schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    userId: { type: schema.Types.ObjectId, ref: 'signup' },
    text: {
        type: String,
        required: true
    }
}, {timestamps:true})
module.exports = mongoose.model("comment", commentSchema)