const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");

// Display home page

exports.index = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({});

  res.render("index", {
    title: "Inventory Application",
    categories: categories,
  });
});

exports.category_list = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({});

  res.render("categories", { title: "Category List", categories: categories });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  const items = await Item.find({ category: req.params.id });

  res.render("category_detail", { category: category, items: items });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_create")
});

exports.category_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category create get");
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category update get");
});

exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category update post");
});

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category delete get");
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category delete post");
});
