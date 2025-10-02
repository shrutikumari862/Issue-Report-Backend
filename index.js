import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'
import { authRouts } from './routes/auth.routes.js'
dotenv.config()
const app=express()
import { v2 as cloudinary } from "cloudinary";
import { authMiddleware } from './authentication/auth.middleware.js'
import { studentRouts } from './routes/student.routes.js'
import { adminRoutes } from './routes/admin.routes.js'


cloudinary.config({
  secure: true, 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary

const MongoDBConnection=async()=>{
   try {
          await mongoose.connect(process.env.MONGODB_URI)
          console.log("mongodb connection successful")
   } catch (error) {
          console.log(`mongodb connection failed!! ERROR:${error}`)
   }
}
MongoDBConnection()

app.use(cors())
app.use(cookieParser())
app.use(express.json());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use("/auth",authRouts)
app.use('/student',authMiddleware,studentRouts)
app.use('/admin',authMiddleware,adminRoutes)



app.listen(process.env.PORT,()=>{
    console.log(`you server is running on port:${process.env.PORT}`)
})