const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLenth: 100 },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  price: { type: Number, required: true, get: getPrice, set: setPrice },
  stock: { type: Number, required: true },
  // image maybe?
});

function getPrice(num) {
  return (num / 100).toFixed(2);
}

function setPrice(num) {
  return num * 100;
}

// Virtual for item URL
ItemSchema.virtual("url").get(function () {
  return `/home/item/${this._id}`;
});

// Export model
module.exports = mongoose.model("Item", ItemSchema);

