const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    from:{
        type:String,
        required: true,
    },
    to:{
        type:String,
        required: true,
    },text:{
        type:String,
        // required: true,
    },
    file:{
        type: String,
        required: false
    },
    time:{
        type:Date,
        required:true,
    },
    delivered:{
        type:Boolean,
    },
    seen:{
        type:Boolean,
    }
})

module.exports= mongoose.model('message', messageSchema)