import express from 'express'
import bcrypt from 'bcrypt'
import { User}  from '../models/User.model.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cloudinary from '../index.js'
import { Report } from '../models/Reports.model.js'
dotenv.config()

export const StudentLogin=async(req,res)=>{
    try {
        const {email,password}=req.body

        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({
                Message:`This email is not registered .. Please SignUp first!!`
            })
        }
        if(!user.role.includes("Student")){
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


export const ReportIssue=async(req,res)=>{
    try {
        const {description,location}=req.body
        const uploaded_image=req.files?.uploaded_image
        const uploadedImage=await cloudinary.uploader.upload(uploaded_image.tempFilePath)

        const report=await new Report({
            description,
            location,
            reported_by:req.user._id,
            uploaded_image:{
                secure_url:uploadedImage.secure_url,
                publicId:uploadedImage.public_id
            }
        })

        await report.save()
        res.status(200).json({
            newReport:report
        })


    } catch (error) {
        res.status(500).json({
            Error:`Error in Report Issue Controller ${error.message}`
        })
    }
}


export const GetAllReports=async(req,res)=>{
    try {
        
        const reports=await Report.find().populate('reported_by')

        res.status(200).json({
            all_Reports:reports
        })

    } catch (error) {
        res.status(500).json({
            Error:`Error in GetAllReports Controller ${error.message}`
        })
    }
}


export const GetMyReports=async(req,res)=>{
    try {
        
        const myReports=await Report.find({reported_by:req.user._id})

        res.status(200).json({
            Myreports:myReports
        })

    } catch (error) {
        res.status(500).json({
            Error:`Error on GetMyReports Controller ${error.message}`
        })
    }
}