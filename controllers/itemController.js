const Item = require("../models/item");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");

exports.item_list = asyncHandler(async (req, res, next) => {
  const items = await Item.find({});

  res.render("item_list", { title: "All items", items: items });
});

// maybe delete this
exports.category_item_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: item list");
});

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category");
  res.render("item_detail", { item: item });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({});
  res.render("item_create", { categories: categories });
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
