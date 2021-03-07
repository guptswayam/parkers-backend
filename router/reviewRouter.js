const express=require("express");
const router=express.Router({mergeParams: true});
const authentication=require("./../controller/authentication");
const reviewController=require("./../controller/reviewController");

router.route("/").post(authentication.protect,authentication.restrictTo("user"),reviewController.createReview).get(authentication.protect,reviewController.getAllReviews);

router.route("/:id").patch(authentication.protect,authentication.restrictTo("user"),reviewController.updateReview);

module.exports=router;