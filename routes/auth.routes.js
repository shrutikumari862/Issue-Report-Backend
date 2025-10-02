import express from 'express'
import { signUp } from '../controllers/auth.controller.js'
import { StudentLogin } from '../controllers/student.controller.js'
import { authMiddleware } from '../authentication/auth.middleware.js'
import { AdminLogin } from '../controllers/admin.controller.js'
export const authRouts=express.Router()

authRouts.post("/signup",signUp)
authRouts.post('/studentlogin',StudentLogin)
authRouts.post('/adminlogin',AdminLogin)