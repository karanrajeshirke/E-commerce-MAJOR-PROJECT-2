import express from 'express'
import { loginController, registerController,testController,adminController } from '../controllers/authController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import userModel from '../models/userModel.js'
const router=express.Router()


router.post('/register',registerController)
router.post('/login',loginController)
router.get('/test',requireSignIn,testController)
router.get('/adminRoute',requireSignIn,isAdmin,adminController)

//! USER ROUTE

router.get('/user-auth',requireSignIn,(req,res)=>
{
    res.status(200).send({ok:true})
})

//!ADMIN ROUTE
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>
{
    res.status(200).send({ok:true})
})

export default router 