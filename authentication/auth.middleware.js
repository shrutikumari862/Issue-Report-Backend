import {User} from '../models/User.model.js'
import jwt from 'jsonwebtoken'



export const authMiddleware=async(req,res,next)=>{
    try {
        const authHeader=req.headers["authorization"];
        if (!authHeader) return res.status(401).json({ Message: "No token provided" });
       
        const token = authHeader.split(" ")[1];
        if (!token) return res.status(401).json({ Message: "Invalid token format" });
 
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded)
         const user = await User.findById(decoded.userId);
         if (!user) return res.status(401).json({ Message: "User does not exist" });

         if (user.email !== decoded.email) {
            return res.status(403).json({ Message: "Token does not belong to this user" });
        }

         req.user = user;
         next();
    } catch (error) {
        res.status(500).json({
            Error:`Error in AuthMiddleware ${error.message}`
        })
    }
}