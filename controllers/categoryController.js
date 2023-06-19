const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
  res.render("category_create", { title: "Create Category" });
});

exports.category_create_post = [
  // Validate and sanitize the name field
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Category description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors render form again with sanitized values / error messages.
      res.render("category_create", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid
      // Check if category already exists
      const categoryExists = await Category.findOne({
        name: req.body.name,
      }).exec();
      if (categoryExists) {
        // Category exists redirect to detail page
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        // Category saved, redirect to detail page.
        res.redirect(category.url);
      }
    }
  }),
];

exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category update get");
});

exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category update post");
});

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  // check if category has items
  // if items, display list of items
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id),
    Item.find({ category: req.params.id }),
  ]);

  if (category === null) {
    res.redirect("/home/categories");
  }

  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    category_items: itemsInCategory,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id),
    Item.find({ category: req.params.id }),
  ]);

  if (itemsInCategory.length > 0) {
    // Category has items render in same way as GET route
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      category_items: itemsInCategory,
    });
    return;
  } else {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect("/home/categories");
  }
});
