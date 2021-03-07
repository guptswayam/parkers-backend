const mongoose=require("mongoose");
const Lot=require("./parkingLotModel");

const reviewSchema=mongoose.Schema({
    review: {
        type: String,
        required: [true,"Review must be there"]
    },
    rating: {
        type: Number,
        min: [1,"Rating must be greater than 5"],
        max: [5,"Rating can't be greater than 5"],
        required: [true,"Rating must be there"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "A review must belongs to an user"]
    },
    lot: {
        type: mongoose.Schema.ObjectId,
        ref: "Lot",
        required: [true, "A review must belongs to an parking lot"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

reviewSchema.statics.calcAverageRating=async function(review){
    const reviewAverage=await this.aggregate([
        {
            $match: {tour: review.tour}
        },
        {
            $group: {
                _id: "$lot",
                avgRating: {$avg: "$rating"},
                numRating: {$sum : 1}
            }
        }
    ])
    if(reviewAverage.length>=1){
        await Lot.findByIdAndUpdate(reviewAverage[0]._id,{
            ratingsAverage: reviewAverage[0].avgRating,
            ratingsQuantity: reviewAverage[0].numRating
        },{
            runValidators: true
        })
    }
    else{
        await Lot.findByIdAndUpdate(review.lot,{
            ratingsAverage: 4.5,
            ratingsQuantity: 0
        })
    }
}

reviewSchema.index({lot: 1, user: 1},{unique:true});

reviewSchema.post("save",function(doc,next){
    Review.calcAverageRating(doc);
    next();
})

reviewSchema.pre(/^find/,function(next){
    this.populate("user");
    next();
});

reviewSchema.post(/^findOneAnd/,function(doc,next){
    Review.calcAverageRating(doc);
    next();
});

const Review=mongoose.model("Review",reviewSchema);

module.exports=Review;