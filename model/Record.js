const mongoose=require('mongoose');

const recordSchema=new mongoose.Schema({
    amount:{
        type:Number,
        required:true,
    },
    type:{
        type:String,
        enum:["income","expense"],
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true,
    },
    note:{
        type:String,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
},{timestamps:true});

module.exports=mongoose.model("Record",recordSchema);