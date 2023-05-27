const Item = require("../models/item");
const asyncHandler = require("express-async-handler");

exports.item_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item list");
});

exports.category_item_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item list");
});

exports.item_detail = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item detail");
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item create get");
});

exports.item_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item create get");
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item update get");
});

exports.item_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item update post");
});

exports.item_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item delete get");
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item delete post");
});
