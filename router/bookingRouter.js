const express=require("express");
const router=express.Router();
const bookingsController=require("./../controller/bookingController");
const {protect}=require("./../controller/authentication");

router.route("/").post(protect,bookingsController.createBooking);
router.get("/getMyBookings",protect,bookingsController.getMyBookings);

module.exports=router;