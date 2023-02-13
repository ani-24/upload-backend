require("dotenv").config();
const express = require("express");
const app = express();

const port = process.env.PORT || 5000;

const cookieParser = require("cookie-parser");
var cloudinary = require("cloudinary").v2;
const auth = require("./middleware/auth");
const fileUpload = require("express-fileupload");
const uploadImg = require("./utils/upload");
const asyncHandler = require("express-async-handler");
const Img = require("./model/img");
const connectDB = require("./config/conn");

app.use(express.json());
app.use(cookieParser());

cloudinary.config({
  cloud_name: "drwuytqnc",
  api_key: "593577281444417",
  api_secret: process.env.CLOUDINARY_SECRET,
});

connectDB();

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.get("/auth", (req, res) => {
  const cookie = req.cookies["admin"];
  if (cookie) {
    res.status(200).send("Admin logged in");
  } else {
    res.status(400).send("Admin not logged in");
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    res.cookie("admin", true, { maxAge: 1000 * 3600 * 24 * 7 });
    res.status(200).send("Admin logged in successfully");
  } else {
    res.status(400).send("Invalid credentials");
  }
});

app.post(
  "/upload",
  auth,
  asyncHandler(async (req, res) => {
    if (req.files) {
      const file = req.files.img;
      const imgUrl = await uploadImg(file.tempFilePath);
      const img = await new Img({ img: imgUrl });
      const add = await img.save();
      if (add) {
        res.status(201).redirect("/admin");
      }
    } else {
      res.status(401).send("Image not available");
    }
  })
);

app.get(
  "/img",
  asyncHandler(async (req, res) => {
    const imgs = await Img.find({});
    res.json({ imgs });
  })
);

app.listen(port, () => {
  console.log(`Server up and running at port http://localhost:${port}`);
});
