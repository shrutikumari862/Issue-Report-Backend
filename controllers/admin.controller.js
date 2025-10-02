import express from 'express'
import bcrypt from 'bcrypt'
import { User}  from '../models/User.model.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cloudinary from '../index.js'
import { Report } from '../models/Reports.model.js'
dotenv.config()


export const AdminLogin=async(req,res)=>{
    try {
        const {email,password}=req.body

        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({
                Message:`This email is not registered .. Please SignUp first!!`
            })
        }
        if(!user.role.includes("Admin")){
            return res.status(400).json({
                Message:`you are in the wrong portal!! Please login from your respective portal`
            })
        }
        const checkPassword=await bcrypt.compare(password,user.password)
        if(!checkPassword){
            return res.status(400).json({
                Message:`Invalid Password!!`
            })
        }

       const token=await jwt.sign({
             userId:user._id,
             name:user.user_name,
             email:user.email,
             role:user.role,
             university:user.university
       },process.env.JWT_SECRET_KEY)

      res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
      });


       res.status(200).json({
        Message:'Login Successful',
        Token:token
       })
    } catch (error) {
        res.status(500).json({
             Error:`Error in Student Login Controller ${error.message}`
        })
       
    }
}

