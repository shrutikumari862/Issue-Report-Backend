import express from 'express'
import { signUp } from '../controllers/auth.controller.js'
import { GetAllReports, GetMyReports, ReportIssue, StudentLogin } from '../controllers/student.controller.js'
import { authMiddleware } from '../authentication/auth.middleware.js'
export const studentRouts=express.Router()

studentRouts.post('/reportissue',ReportIssue)
studentRouts.get('/getallreports',GetAllReports)
studentRouts.get('/getmyreports',GetMyReports)