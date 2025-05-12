const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require('./review.js')

const ListingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
        type: {
          url: String,
          filename: String,
        },
         default: {
            filename: 'default-image',
            url: 'https://example.com/default.jpg'
    }
      },
    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review"

      }
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
    category:{
      type:String,
      enum:["Trending", "Rooms", "Iconic cities", "Mountains", "Castles", "Pools", "Camping", "Farms", "Arctic"],
    }


});

ListingSchema.post("findOneAndDelete",async (listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:Listing.reviews}});
  }
})

const Listing=mongoose.model("Listing",ListingSchema);
module.exports=Listing;