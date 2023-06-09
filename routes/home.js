const express = require("express");
const category = require("../models/category");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = "public/images/";
    cb(null, folder);
  },
  filename: (req, file, callback) => {
    const filename = "image";
    callback(null, filename);
  },
});
const upload = multer({ storage: storage });

// require controller modules.
const category_controller = require("../controllers/categoryController");
const item_controller = require("../controllers/itemController");

// CATEGORY ROUTES

// GET home page
router.get("/", category_controller.index);

// GET sign up form
router.get("/sign-up", category_controller.category_sign_up_get);

// POST request for signing up
router.post("/sign-up", category_controller.category_sign_up_post);

// GET sign-in-form
router.get("/sign-in", category_controller.category_sign_in_get);

// POST sign-in-form
router.post("/sign-in", category_controller.category_sign_in_post);

// Log out
router.get("/logout", category_controller.category_logout_get);

// GET request for creating a Category. NOTE This must come before routes that display Category (uses id).
router.get("/category/create", category_controller.category_create_get);

// POST request for creating category.
router.post("/category/create", category_controller.category_create_post);

// GET request for deleting category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request for deleting category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request for updating category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request for updating category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one category
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all categories.
router.get("/categories", category_controller.category_list);

// ITEM ROUTES

// GET request for creating an item. NOTE This must come before routes that display item (uses id).
router.get("/item/create", item_controller.item_create_get);

// POST request for creating item.
router.post("/item/create", upload.single('image'), item_controller.item_create_post);

// GET request for deleting item.
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request for deleting item.
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request for updating item.
router.get("/item/:id/update", item_controller.item_update_get);

// POST request for updating item.
router.post("/item/:id/update", upload.single('image'), item_controller.item_update_post);

// GET request for one item
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all items in category.
router.get("/category/:id/items", item_controller.category_item_list);

// GET request for list of all items.
router.get("/items", item_controller.item_list);

module.exports = router;
