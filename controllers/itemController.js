const Item = require("../models/item");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const fs = require("fs");

exports.item_list = asyncHandler(async (req, res, next) => {
  const items = await Item.find({}, { image: 0 });

  console.log(items);

  res.render("items", { title: "All items", items: items });
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
  res.render("item_create", { title: "Create Item", categories: categories });
});

exports.item_create_post = [
  // Validate and sanitize the name field
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 }),
  body("description", "Category description must not be empty")
    .trim()
    .isLength({ min: 1 }),
  body("category", "Category must not be empty").trim().isLength({ min: 1 }),
  body("price", "Price must not be empty").trim().isLength({ min: 1 }).escape(),
  body("stock", "Stock must not be empty").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    let item;

    // Process image data
    if (req.file) {
      let img = fs.readFileSync(req.file.path);
      let encode_img = img.toString("base64");
      let final_img = {
        contentType: req.file.mimetype,
        data: new Buffer.from(encode_img, "base64"),
      };

      // Create item object with escaped and trimmed data.
      item = new Item({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
        image: final_img,
      });
    } else {
      item = new Item({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
      });
    }

    if (!errors.isEmpty()) {
      // There are errors render form again with sanitized values / error messages.
      const categories = await Category.find({});
      res.render("item_create", {
        title: "Create Item",
        item: item,
        categories: categories,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid
      // Check if item already exists
      const itemExists = await Item.findOne({
        name: req.body.name,
      }).exec();
      if (itemExists) {
        // item exists redirect to detail page
        res.redirect(itemExists.url);
      } else {
        await item.save();
        // item saved, redirect to detail page.
        res.redirect(item.url);
      }
    }
  }),
];

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id, { image: 0 });
  const categories = await Category.find({});

  res.render("item_create", {
    title: "Update item",
    item: item,
    categories: categories,
  });
});

exports.item_update_post = [
  // Validate and sanitize the name field
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 }),
  body("description", "Category description must not be empty")
    .trim()
    .isLength({ min: 1 }),
  body("category", "Category must not be empty").trim().isLength({ min: 1 }),
  body("price", "Price must not be empty").trim().isLength({ min: 1 }).escape(),
  body("stock", "Stock must not be empty").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create item object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors, render form again with sanitized values / error messages.
      const categories = await Category.find({});
      res.render("item_create", {
        title: "Create Item",
        item: item,
        categories: categories,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(updatedItem.url);
    }
  }),
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id, { image: 0 });
  res.render("item_delete", { item: item });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndDelete(req.body.itemid);
  res.redirect("/home/items");
});
