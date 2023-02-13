const mongoose = require("mongoose");

const imgSchema = mongoose.Schema({
  img: String,
});

const Img = mongoose.model("Img", imgSchema);
module.exports = Img;
