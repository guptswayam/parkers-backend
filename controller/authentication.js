const catchAsync=require("./../utils/catchAsync");
const AppError=require("./../utils/appError");
const User=require("./../model/userModel");
const jwt=require("jsonwebtoken");


const sendJwtToken=async (res,id)=>{
    const token=await jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    const cookieOptions={
        expires: new Date(Date.now()+(process.env.COOKIE_EXPIRES*24*60*60*1000)),
        httpOnly: true,
        sameSite: "None"
    }
    if(process.env.NODE_ENV=="production")
        cookieOptions.secure=true;
    res.cookie("jwt",token,cookieOptions);
    res.status(200).json({
        status:"success",
        token
    });
}


exports.signup=catchAsync(async (req,res,next)=>{
    const user=await User.create({
        name: req.body.name,
        email:req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    })
    user.password=undefined;
    sendJwtToken(res,user._id);
})

exports.signin=catchAsync(async (req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password)
        return next(new AppError("Please provide email and password",400));
    const user=await User.findOne({email:req.body.email}).select("+password");
    if(!user||!await user.correctPassword(req.body.password))
        return next(new AppError("invalid email or password",401));
    sendJwtToken(res,user._id);
})

exports.logout=(req,res,next)=>{
    res.cookie("jwt","logout_token",{
        expiresIn: new Date(Date.now()+2000),
        httpOnly: true
    })
    res.status(204).json({
        status: "success"
    })
}

exports.protect=catchAsync(async(req,res,next)=>{
    let token;
    if(req.headers.authorization&&req.headers.authorization.startsWith("Bearer"))
        token=req.headers.authorization.split(" ")[1];
    else if(req.cookies.jwt)
        token=req.cookies.jwt;
    if(!token)
        return next(new AppError("You are not logged in. Please login to get access",401));
    
    const decoded=await jwt.verify(token,process.env.JWT_SECRET);

    const currentUser=await User.findById(decoded.id);
    if(!currentUser)
        return next(new AppError("user belongs to this token does no longer exist",401));
    if(currentUser.passwordChangedAt&&new Date(decoded.iat*1000)<currentUser.passwordChangedAt)
        return next(new AppError("You changed your password. Please login again",401));
    req.user=currentUser;
    next();
})

exports.updatePassword=catchAsync(async (req,res,next)=>{
    console.log(req.body);
    const user=await User.findById(req.user._id).select("+password");
    if(!await user.correctPassword(req.body.currentPassword))
        return next(new AppError("Your current password is incorrect",400));
    user.password=req.body.password;
    user.confirmPassword=req.body.confirmPassword;
    await user.save();
    sendJwtToken(res,user._id);
})

exports.restrictTo=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role))
            return next(new AppError("You don't have permission to access this route"));
        next();
    }
}