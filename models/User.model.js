import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema=new Schema({
   user_name:{
    type:String,
    required:true,
   },
   email:{
    type:String,
    unique:true,
    required:true,
   },
   phone_number:{
    type:String,
    unique:true,
    required:true
   },
   password:{
    type:String,
    required:true,
   },
   profile_pic:{
    profile_pic_url: {
        type: String,
        required: function () {
          return this.profile_pic && this.profile_pic.profile_pic_publicId; // only required if profile_pic object present
        },
      },
      profile_pic_publicId: {
        type: String,
        required: function () {
          return this.profile_pic && this.profile_pic.profile_pic_url;
        },
      },
   },
   role:{
    type: [String], 
    enum: ["Student", "Admin", "Worker"],
    default: ["Student"], 
    required: true,
   },
   university:{
    type:String,
    required:true,
    enum:["Amity"],
    default:"Amity",
   },

},
{timestamps:true})


export const User=mongoose.model("User",userSchema)