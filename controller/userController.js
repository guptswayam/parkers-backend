const catchAsync=require("./../utils/catchAsync");
const User=require("./../model/userModel");


exports.getMe=catchAsync(async (req,res,next)=>{
    const user= await User.findById(req.user._id).populate({
        path: "bookings",
        select: "exitTime lot"
    }).select("-passwordChangedAt -__v");

    res.status(200).json({
        status: "success",
        data: user
    })
})

exports.updateMe=catchAsync(async (req,res,next)=>{
    console.log(req.body);
    const user= await User.findByIdAndUpdate(req.user._id,req.body,{
        new : true,
        runValidators: true
    })
    res.status(200).json({
        status: "success",
        data: user
    })
})