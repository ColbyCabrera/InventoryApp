const Category = require("../models/category");
const asyncHandler = require("express-async-handler");

// Display home page

exports.index = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: SITE HOME PAGE");
});
