const AppError=require("./../utils/appError");

const errDev=(err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        err,
        stack: err.stack
    })
}

const errProd=(err,res)=>{
    if(err.isOperational)
        res.status(err.statusCode).json({
        status:err.status,
        message: err.message
        })
    else
        res.status(err.statusCode).json({
        status:err.status,
        message: "Something went wrong!"
        })
}

const handleCastError=err=>{
    return new AppError(`invalid ${err.path}: ${err.value}`,400);
}

const handleValidateError=err=>{
    return new AppError(err.message,400);
}

const handleDuplicateFieldError=err=>{
    let value = err.errmsg.match(/{([^}]*)}/)[0];
    return new AppError(`Duplicate field value: ${value}`, 400);
}

const handleJWTError=err=>{
    return next(new AppError("Invalid Token. Please login again",401));
}

const handleTokenExpiredError=err=>{
    return next(new AppError("Your token has Expired. Please login again",401));
}

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.status=err.status||"error";
    if(process.env.NODE_ENV=="development")
        errDev(err,res);
    else{
        let error={...err};
        error.message=err.message;
        if(err.name=="CastError")
            error=handleCastError(error);
        if(err.name=="ValidationError")
            error=handleValidateError(error);
        if(err.code==11000)
            error=handleDuplicateFieldError(error);
        if(err.name=="JsonWebTokenError")
            error=handleJWTError(error);
        if(err.name=="TokenExpiredError")
            error=handleTokenExpiredError(error);
        errProd(error,res);
    }
}