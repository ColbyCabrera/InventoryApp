const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLenth: 100 },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { data: Buffer, contentType: String },
});

function getPrice(num) {
  return parseInt(num);
}

function setPrice(num) {
  return num;
}

// Virtual for item URL
ItemSchema.virtual("url").get(function () {
  return `/home/item/${this._id}`;
});

// Export model
module.exports = mongoose.model("Item", ItemSchema);
