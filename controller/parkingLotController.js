const Lot = require("./../model/parkingLotModel");
const catchAsync = require("./../utils/catchAsync");

exports.getAllParkingLots = catchAsync(async (req, res, next) => {
    const parkingLots = await Lot.find();
    res.status(200).json({
        status: "success",
        results: parkingLots.length,
        data: parkingLots
    })
})

exports.addParkingLot =catchAsync( async (req, res, next) => {
    const parkingLot = await Lot.create(req.body)
    res.status(200).json({
        status: "success",
        data: parkingLot
    })
})

exports.updateParkingLot = async (req, res, next) => {
    try {
        const parkingLot = await Lot.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true
        })
        res.status(200).json({
            status: "success",
            data: parkingLot
        })
    } catch (err) {
        res.status(400).json({
            status: "failure",
            data: err
        })
    }
}

exports.getParkingLotDetails = catchAsync(async (req, res, next) => {
    const parkingLot = await Lot.findById(req.params.id).populate("reviews");
    res.status(200).json({
        status: "success",
        data: parkingLot
    })
})