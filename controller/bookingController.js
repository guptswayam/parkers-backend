const Booking=require("./../model/bookingsModel");
const catchAsync=require("./../utils/catchAsync");

exports.createBooking=catchAsync(async (req,res,next)=>{
    req.body.user=`${req.user._id}`;
    console.log(req.body);
    const booking=await Booking.create(req.body);
    res.status(200).json({
        status: "success",
        data: booking
    })
})

exports.getMyBookings=catchAsync(async (req,res,next)=>{
    const bookings=await Booking.find({user: req.user._id}).populate({
        path: "lot",
        select: "name coverImage district state"
    }).sort({entryTime: -1});
    res.status(200).json({
        status: "success",
        results: bookings.length,
        data: bookings
    })
})