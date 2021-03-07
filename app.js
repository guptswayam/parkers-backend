const express=require("express");
const parkingLotRouter=require("./router/parkingLotRouter");
const app=express();
const AppError=require("./utils/appError");
const errorController=require("./controller/errorController");
const userRouter=require("./router/userRouter");
const cookieParser=require("cookie-parser");
const reviewRouter=require("./router/reviewRouter");
const bookingsRouter=require("./router/bookingRouter");
const cors=require("cors")

app.use(express.static("./public"));
var whitelist = ['https://parkings.netlify.app', 'http://localhost:8080'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }, 
  credentials: true

}
app.use(cors(corsOptions))
app.use((req,res,next)=>{
    console.log("Hey, I'm Middleware");
    next();
})

app.use(express.json({limit: "10kb"}));

app.use(cookieParser());

app.use("/api/v1/parking-lots",parkingLotRouter);
app.use("/api/v1/users",userRouter);
app.use("/api/v1/reviews",reviewRouter);
app.use("/api/v1/bookings",bookingsRouter);

app.all("*",(req,res,next)=>{
    next(new AppError(`${req.originalUrl} is not defined on this server`,404));
})

app.use(errorController);

module.exports=app;