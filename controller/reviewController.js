const Review=require("./../model/reviewModel");
const AppError=require("./../utils/appError");
const catchAsync=require("./../utils/catchAsync");

exports.createReview=catchAsync(async (req,res,next)=>{
    req.body.createdAt=Date.now();
    if(req.params.userId)
        req.body.user=req.params.userId;
    const review=await Review.create(req.body);
    res.status(201).json({
        status:"success",
        data: review
    })
})

exports.getAllReviews=catchAsync(async (req,res,next)=>{
    if(!req.params.userId&&req.user.role!="admin")
        return next(new AppError("You don't have permission to access this route"));
    const filter={};
    if(req.params.userId!=req.user._id)
        return next(new AppError("Invalid user id"));
    filter.user=req.params.userId;
    const reviews=await Review.find(filter);
    res.status(200).json({
        status:"success",
        data: reviews
    })
})

exports.updateReview=catchAsync(async (req,res,next)=>{
    const review=await Review.findByIdAndUpdate(req.params.id,req.body,{ runValidators: true, new: true});
    if(!review)
        return next(new AppError("Invalid Review Id",400));
    res.status(200).json({
        status: "success",
        data: review
    })
})