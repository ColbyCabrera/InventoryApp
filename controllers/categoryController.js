const Category = require("../models/category");
const Item = require("../models/item");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");

// Display home page

exports.index = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({});

  res.render("index", {
    title: "Inventory Application",
    categories: categories,
    user: req.user,
  });
});

exports.category_sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("sign_up", { title: "Sign Up" });
});

exports.category_sign_up_post = asyncHandler(async (req, res, next) => {
  try {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      const result = await user.save();
    });

    res.redirect("/");
  } catch (err) {
    return next(err);
  }
});

exports.category_sign_in_get = asyncHandler(async (req, res, next) => {
  res.render("sign_up", { title: "Sign In" });
});

exports.category_sign_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
});

exports.category_logout_get = asyncHandler(async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

exports.category_list = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({});
  res.render("categories", { title: "Category List", categories: categories });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  const items = await Item.find({ category: req.params.id }, { image: 0 });

  res.render("category_detail", { category: category, items: items });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_create", { title: "Create Category", user: req.user });
});

exports.category_create_post = [
  // Validate and sanitize the name field
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 }),
  body("description", "Category description must not be empty")
    .trim()
    .isLength({ min: 1 }),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
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
  const category = await Category.findById(req.params.id);

  res.render("category_create", {
    title: "Update category",
    category: category,
    user: req.user,
  });
});

exports.category_update_post = [
  // Validate and sanitize the name field
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 }),
  body("description", "Category description must not be empty")
    .trim()
    .isLength({ min: 1 }),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors, render form again with sanitized values / error messages.
      res.render("category_create", {
        title: "Update Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid
      // Check if category already exists
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        category,
        {}
      );
      // Category saved, redirect to detail page.
      res.redirect(updatedCategory.url);
    }
  }),
];

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
    user: req.user,
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
