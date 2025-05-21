const Listing=require("../models/listing");

module.exports.index=async (req,res)=>{
    const {sort,priceRange}=req.query;
    console.log(sort);
      const { category,search } = req.query;
      let sortOption = {};
      let filter = {};
      if (category) {
        filter.category = category;
    }
    if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number);
    filter.price = { $gte: min, $lte: max };
  }
    if (search) {
    filter.$or = [
      { location: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } }
    ];
  }
    
     if(sort){
        if(sort=="asc"){
             sortOption.price = 1;
        }
        else{
            sortOption.price = -1;
        }
      }
      const allListings = await Listing.find(filter).sort(sortOption);
    if((allListings).length==0){
        req.flash("error","No Listings found in this filter");
        return res.redirect('/listings');
    }
    res.render("listings/index", { allListings });
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing =async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }).populate('owner');
    if(!listing){
        req.flash("error","Listing you requested does not exist");
        res.redirect('/listings');
    }
    else{
        console.log(listing);
        res.render("listings/show.ejs",{listing});
    }

}

module.exports.createListing=async (req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(req.body.listing);
    const newListings=new Listing(req.body.listing);
    newListings.owner =req.user._id;
    newListings.image={url,filename};
    await newListings.save();
    req.flash("success","New Listing Created !");
    res.redirect("/listings");


}

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist");
        res.redirect('/listings');
    }

    let oringinalImageUrl=listing.image.url;
    oringinalImageUrl=oringinalImageUrl.replace("/upload","/upload/h_30,w_25");
    res.render("listings/edit.ejs",{listing,oringinalImageUrl});

}

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you dont have permission to update");
        return res.redirect(`/listings/${id}`);
    }
    let listing2=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
             let url=req.file.path;
             let filename=req.file.filename;
             listing2.image={url,filename};
             await listing2.save();

    }

    req.flash("success","Listing Updated !");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    let del=await Listing.findByIdAndDelete(id);
    console.log(del);
    req.flash("success","Listing Deleted !");
    res.redirect('/listings');
}