const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    userId: { type: schema.Types.ObjectId, ref: 'signup' },
    question :{
        type: String, 
        required : true
    },

    desc :{
        type: String, 
        required : true
    },
    comments: [{ type: schema.Types.ObjectId, ref: 'comment' }],
    chatGPTReply: {
        type: String, 
        required : false
    },

}, {timestamps:true})


module.exports = mongoose.model('User', userSchema)