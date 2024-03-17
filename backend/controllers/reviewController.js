import productModel from "../models/productModel.js";
import reviewModel from "../models/reviewModel.js";



export const createReviewController=async(req,res)=>
{
    try
    {
        const id=req.user._id;
        const {pid,rating,comment}=req.body;
    
        const product=await productModel.findById(pid);
    
        const review=new reviewModel(
            {
                rating,
                comment,
                author:id
            }
        )
    
        const data=await review.save();
    
        product.reviews.push(review)
    
        await product.save();

        res.status(200).send(
            {
                message:"review created",
               
            }
        )
    }
    catch(error)
    {
        console.log(error);
    }
}


export const getReviewsForProduct=async(req,res)=>
{
   try
   {
    const {pid}=req.params;

    const product=await productModel.findById(pid).populate({
        path:"reviews",
        
        populate:{
            path:'author',
            select:"-photo"
        }
    }).select('-photo')

    const reviews=product.reviews
    res.send({reviews})
   }
   catch(error)
   {
    console.log(error);
   }

}