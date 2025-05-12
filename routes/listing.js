const express=require("express");
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const Listing=require("../models/listing.js");
const {listingSchema,reviewSchema}=require('../schema.js');
const ExpressError=require('../utils/ExpressError.js');
const {isLoggedIn}=require('../middleware.js');
const {isOwner,validateListing}=require("../middleware.js");
const ListingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});


router.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn,validateListing,upload.single('listing[image]'),wrapAsync(ListingController.createListing));

router.get('/new',isLoggedIn,ListingController.renderNewForm)


router.route("/:id")
.get(wrapAsync( ListingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(ListingController.updateListing))
.delete(isLoggedIn,wrapAsync(ListingController.deleteListing));

//show rout

//edit
router.get('/edit/:id',isLoggedIn,wrapAsync(ListingController.renderEditForm));

module.exports=router;