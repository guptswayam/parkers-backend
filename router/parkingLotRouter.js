const express=require("express");
const router=express.Router();
const parkingLotController=require("./../controller/parkingLotController");
const authentication=require("./../controller/authentication");

router.route("/").get(parkingLotController.getAllParkingLots).post(parkingLotController.addParkingLot);
router.route("/:id").patch(parkingLotController.updateParkingLot).get(parkingLotController.getParkingLotDetails);


module.exports=router;