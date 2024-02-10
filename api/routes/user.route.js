import Router  from "express";
import {    login, signUp,  user, userDelete, userUpdate, users } from '../controllers/user.controller.js'
import  verifyToken  from "../middleware/verifyToken.js";
import validateUser from "../middleware/validateUser.js";
import dotenv from 'dotenv'
dotenv.config();
const router = Router();

// User - Endpoints
router.post("/signup", validateUser, signUp);
router.post('/login' ,  login);

router.get('/', users);
router.get('/user', verifyToken ,user);
router.put('/user', verifyToken, userUpdate);
router.delete('/user', verifyToken, userDelete);





export default router
