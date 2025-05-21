const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const flash = require('connect-flash');


module.exports.createReview=async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    const rating = req.body.review.rating;
    console.log(rating);
    if (!rating || rating < 0 || rating > 5) {
        req.flash("error", "Please select a valid star rating.");
        return res.redirect(`/listings/${listing._id}`);
    }
    newReview.author = req.user._id;
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","new Review created");
    res.redirect(`/listings/${listing.id}`);
}


module.exports.destroyReview= async (req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review  Deleted !");

    res.redirect(`/listings/${id}`);

}