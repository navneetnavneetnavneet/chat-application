const {catchAsyncErrors} = require("../middlewares/catchAsyncErrors");

module.exports.homepage = catchAsyncErrors(async (req, res, next) => {
    res.json({message: "homepage"});
})