const mongoose=require("mongoose");
const AppError=require("./../utils/appError");
const Lot=require("./../model/parkingLotModel");

const bookingSchema=new mongoose.Schema({
    vehicleNo: {
        type: String,
        required: [true,"A booking must have a vehicle no."]
    },
    entryTime: {
        type: Date,
        required: [true,"A booking must have an entry time"]
    },
    exitTime: {
        type:  Date,
        required: [true,"A booking must have an exit time"]
    },
    customerName: {
        type: String,
        required: [true,"A booking must have a name"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true,"A booking must have a user"]
    },
    lot: {
        type: mongoose.Schema.ObjectId,
        ref: "Lot",
        required: [true,"A booking must have a parking lot"]
    },
    amount: {
        type: Number,
        required: [true,"A booking must have an amount"]
    }
})

bookingSchema.statics.chechAvailability=async function(booking){
    const stats=await this.aggregate([
        {
            $match: {lot: booking.lot}
        },
        {
            $match: {$or: [{entryTime: {$lte: booking.entryTime},exitTime: {$gte: booking.entryTime}},{entryTime: {$lte: booking.exitTime},exitTime: {$gte: booking.exitTime}},{entryTime: {$gte: booking.entryTime},exitTime: {$lte: booking.exitTime}}]}
        },
        {
            $group: {
                _id:null,
                count: {$sum: 1}
            }
        }
    ])
    const lot=await Lot.findById(booking.lot).select("maxCapacity");
    if(stats.length!=0&&stats[0].count>=lot.maxCapacity)
        return false;
    else
        return true;
}

bookingSchema.pre("save",async function(next){
    if(!await Booking.chechAvailability(this))
        return next(new AppError("Parking Space not available for this time",404));
    next();
})

const Booking=mongoose.model("Booking",bookingSchema);

module.exports=Booking;