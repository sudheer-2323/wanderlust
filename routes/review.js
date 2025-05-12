const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {listingSchema,reviewSchema}=require('../schema.js');
const {validateReview,isLoggedIn,isAuthor}=require('../middleware.js');

const {createReview,destroyReview}=require("../controllers/reviews.js");

router.post('/',isLoggedIn,validateReview,wrapAsync(createReview));

router.delete('/:reviewId',isLoggedIn,isAuthor, wrapAsync(destroyReview));

module.exports=router;