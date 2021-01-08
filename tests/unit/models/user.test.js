const { User } = require("../../../modules/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const { validateUser } = require("../../../funcs/userFuncs");

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      username: "James",
      isAdmin: true,
    };
    const user = new User(payload);

    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(payload);
  });
});

describe("user.validateUserInput", () => {
  it("should return a validated menu object", () => {
    const payload = {
      username: "Admin",
      password: "Qwer1234",
    };

    const { value } = validateUser(payload);
    expect(value).toMatchObject(payload);
  });

  it("should return an error message about the invalid username", () => {
    const payload = {
      username: "Ad",
      password: "Qwer1234",
    };

    const { error } = validateUser(payload);
    expect(error.details[0].message).toMatch(/at least 5 characters long/);
  });

  it("should return an error message about the invalid password", () => {
    const payload = {
      username: "Admin",
      password: "Qwer",
    };

    const { error } = validateUser(payload);
    expect(error.details[0].message).toMatch(/at least 8 characters long/);
  });
});
