const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");


const userSchema=mongoose.Schema({
    name:{
        type: String,
        required: [true,"A user must have a name"]
    },
    email:{
        type: String,
        required: [true,"A user must have an email"],
        unique: [true,"This username already exists"]
    },
    password:{
        type:String,
        required:[true,"A user must have a password"],
        minlength:[8,"Password must have minimum length of 8"],
        select: false
    },
    confirmPassword:{
        type:String,
        required:[true,"A user must have a confirm password"],
        minlength:[8,"Password must have minimum length of 8"],
        validate:{
            validator:function(value){
                return value==this.password;
            },
            message:"password and confirmPassword must be same"
        }
    },
    role:{
        type:String,
        default: "user",
        enum:["user","manager","admin"]
    },
    photo:{
        type:String,
        default:"default.jpg"
    },
    active:{
        type:Boolean,
        default: true,
        select: false
    },
    passwordChangedAt:Date
},{
    toJSON: {virtuals: true},
    toObject: {virtuals:  true}
})


userSchema.virtual("bookings",{
    ref: "Booking",
    foreignField: "user",
    localField: "_id"
})
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))
        return next();
    this.password=await bcrypt.hash(this.password,10);
    this.confirmPassword=undefined;
    next();
})

userSchema.methods.correctPassword=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.pre("save",function(next){
    if(!this.isModified("password")||this.isNew)
        return next();
    this.passwordChangedAt=Date.now()-1000;
    next();
})

const User=mongoose.model("User",userSchema);

module.exports=User;