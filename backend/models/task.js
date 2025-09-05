const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema({
    id:{type:Number, required:true},
    task:{type:String,required:true},
    message:{type:String},
    userid:{type:mongoose.Schema.Types.ObjectId, ref:'User'}
})

module.exports = mongoose.model("Task", TaskSchema)