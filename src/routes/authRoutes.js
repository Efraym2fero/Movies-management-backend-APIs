import express  from 'express';
import { register,login, logout } from '../controllers/authController.js';
import { addUserSchema, loginSchema } from '../validators/userValidators.js';
import { validateReq } from '../middleware/validatorsMiddleware.js';

const authRouter = express.Router()

authRouter.post("/register",validateReq(addUserSchema),register)
authRouter.post("/login",validateReq(loginSchema),login)
authRouter.post("/logout",logout)


export default authRouter;