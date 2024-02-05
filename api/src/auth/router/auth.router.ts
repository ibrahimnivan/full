import { Router } from "express";
import { register, login } from "../handler/auth.handler";


const authRouter = Router()

authRouter.post('/register', register )
authRouter.post('/login', login )


export default authRouter
