import express  from 'express';
import { register,getDate } from '../controllers/authController.js';

const authRouter = express.Router()
authRouter.get("/data",getDate)
authRouter.post("/register",register)

export default authRouter;