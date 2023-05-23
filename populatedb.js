#! /usr/bin/env node

console.log(
  'This script populates some test cateories and items to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories.push(category);
  console.log(`Added category: ${name}`);
}

async function itemCreate(name, description, category, price, stock) {
  const item = new Item({
    name: name,
    description: description,
    category: category,
    price: price,
    stock: stock,
  });
  await item.save();
  items.push(item);
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate("Instruments", "Devices that create music!"),
    categoryCreate("Board games", "Fun tabletop games to play with friends!"),
    categoryCreate("Cosmetics", "Change your look with these products!"),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate("Torigonda", "A guitar like instrument", categories[0], 7999, 3),
    itemCreate("Chocolate Shadow", "A makeup product", categories[2], 2599, 6),
    itemCreate(
      "Money-Bye-Bye",
      "Lose all your money in this real estate game!",
      categories[1],
      4599,
      4
    ),
  ]);
}
