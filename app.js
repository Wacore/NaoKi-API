const express = require("express");
const app = express();
const Joi = require("joi");
const config = require("config");
const accounts = require("./routes/accounts");
const home = require("./routes/home");
const menu = require("./routes/menus");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/playground", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  data: {
    type: Date,
    default: Date.now,
  },
  isPulished: Boolean,
});

const Course = mongoose.model("Courses", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "NodeJS",
    author: "Mosh",
    tags: ["Back-end", "Web development", "node"],
    isPulished: true,
  });

  const result = await course.save();
  console.log(result);
}

// createCourse();

async function getCourse() {
  // eq = equal
  // nq = not equal
  // gt = greater than
  // gte = greater than or equal to
  // lt = less than
  // lte = less than or equal to
  //  in
  // nin = not in

  const results = await Course.find({ author: "Mosh", isPulished: true })
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });

  console.log(results);
}

// getCourse();

app.use(express.json());
app.use("/api/accounts", accounts);
app.use("/api/menu", menu);
app.use("/", home);

app.set("view engine", "pug");

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));
