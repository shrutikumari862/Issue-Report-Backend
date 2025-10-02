import mongoose from 'mongoose'
import {Schema} from 'mongoose'

const reportSchema=new Schema({
    reported_by:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    resolved_by: {
        type: Schema.Types.ObjectId,
        ref: "User",   
        default: null  
    },
    description:{
         type:String,
         required:true
    },
    location:{
        type:String,
        required:true,

    },
    uploaded_image:{
        secure_url:{type:String,required:true},
        publicId:{type:String,required:true}
    }

},{timestamps:true})

export const Report=mongoose.model("Report",reportSchema)