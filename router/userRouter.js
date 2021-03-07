const express=require("express");
const router=express.Router();
const authentication=require("./../controller/authentication");
const reviewRouter=require("./../router/reviewRouter")
const userController=require("./../controller/userController");

router.use("/:userId/reviews",reviewRouter);

router.post("/signup",authentication.signup);
router.post("/login",authentication.signin);
router.get("/getMe",authentication.protect,userController.getMe);
router.get("/logout",authentication.protect,authentication.logout);
router.patch("/updateMe",authentication.protect,userController.updateMe);

router.patch("/update-password",authentication.protect,authentication.updatePassword);

module.exports=router;