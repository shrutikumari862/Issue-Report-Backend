import express from 'express'
import bcrypt from 'bcrypt'
import { User } from '../models/User.model.js'
import cloudinary from '../index.js'

export const signUp=async(req,res)=>{
    try {
        const {user_name,email,phone_number,password,role,university}=req.body
        const profile_pic=req.files?.profile_pic
        const uploadedProfilePic=await cloudinary.uploader.upload(profile_pic.tempFilePath)
        const hashedPassword=await bcrypt.hash(password,10)

        const UserAlready=await User.findOne({email})
        if(UserAlready){
            return res.status(400).json({
                Message:`This User Already Exists`
            })
        }
        if(phone_number.length!==10){
            res.status(400).json({
                Message:`Phone Number must consist of 10 digits`
            })
        }

        const newUser=new User({
            user_name,
            email,
            password:hashedPassword,
            phone_number,
            role,
            university,
            profile_pic:{
                 profile_pic_url:uploadedProfilePic.secure_url,
                 profile_pic_publicId:uploadedProfilePic.public_id
            }
        })

        await newUser.save()
        res.status(200).json({
            New_User_Created:newUser
        })

        
    } catch (error) {
        res.status(500).json({
            Error:`Error in SignUp Controller ${error.message}`
        })
    }
}