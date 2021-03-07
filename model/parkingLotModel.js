const mongoose= require("mongoose");

const parkingLotSchema=mongoose.Schema({
    name: {
        type: String,
        required: [true,"A Parking Lot must have a name"]
    },
    location: {
        type:{
            type: String,
            default: "Point",
            enum: ["Point"]
        },
        coordinates: [Number]
    },
    district: {
        type: String,
        required: [true,"A Parking lot must have a district name"]
    },
    state: {
        type: String,
        required: [true,"A Parking lot must have a state name"]
    },
    country: {
        type: String,
        default: "India"
    },
    maxCapacity: {
        type: Number,
        default: 2,
        max: [5,"A Parking lot not have capacity more than 5"]
    },
    price: {
        type: Number,
        required: [true,"A parking lot must have a price"]
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min : [1,"rating can't be less than 1"],
        max : [5,"rating can't be greter than 5"],
        set: value=> Math.round(value*10)/10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    images:[String],
    coverImage: String,
    lat:{
        type:Number,
        required: [true,"A lot must have a latitude"]
    },
    long:{
        type:Number,
        required: [true,"A lot must have a longitude"]
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

parkingLotSchema.index({location: "2dsphere"});
parkingLotSchema.index({lat:1,long:1},{unique:true});

parkingLotSchema.virtual("reviews",{
    ref:"Review",
    foreignField: "lot",
    localField: "_id"
})

parkingLotSchema.pre("save",function(next){
    this.location.coordinates=[this.long,this.lat];
    next();
})

const Lot=mongoose.model("Lot",parkingLotSchema);

module.exports=Lot;