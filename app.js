const express = require("express");
const app = express();
const Joi = require("joi");
const config = require("config");
const accounts = require("./routes/accounts");
const home = require("./routes/home");
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

app.use(express.json());
app.use("/api/accounts", accounts);
app.use("/", home);

app.set("view engine", "pug");

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));
