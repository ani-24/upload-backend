require("dotenv").config();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "drwuytqnc",
  api_key: "593577281444417",
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadImg = async (img) => {
  try {
    const res = await cloudinary.uploader.upload(img, {
      resource_type: "image",
    });
    return res.url;
  } catch (error) {
    return error;
  }
};

module.exports = uploadImg;
