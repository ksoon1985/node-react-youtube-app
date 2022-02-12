const mongoose = require('mongoose')
const Schema = require('mongoose')

const videoSchema = mongoose.Schema({

    writer:{
        // id 해당하는 User 모든 정보 가져올 수 있음 
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    title: {
        type:String,
        maxlength : 50
    },
    description:{
        type:String
    },
    privacy:{
        type:Number
    },
    filePath:{
        type:String
    },
    category:{
        type:String
    },
    views:{
        type:Number,
        default:0
    },
    duration:{
        type:String
    },
    thumbnail:{
        type:String 
    }

},{timestamps:true}) //만든,업데이트한 date 표시 


const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }