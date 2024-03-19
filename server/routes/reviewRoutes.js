import express from "express"
import { createReviewController, getReviewsForProduct } from "../controllers/reviewController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";



const router=express.Router();




router.post('/create-review',requireSignIn,createReviewController)
router.get('/:pid',getReviewsForProduct)

export default router