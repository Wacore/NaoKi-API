const request = require("supertest");
const { User } = require("../../modules/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let server;

describe("/api/auth", () => {
  beforeEach(() => {
    server = require("../../app");
  });
  afterEach(async () => {
    server.close();
    await User.remove({});
  });

  describe("POST /", () => {
    beforeEach(async () => {
      const salt = await bcrypt.genSalt(10);
      let admin = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        username: "admin",
        password: "",
        isAdmin: true,
      };
      admin.password = await bcrypt.hash("Qwer1234", salt);

      await User.collection.insertOne(admin);
    });
    it("should return 400 if no data provided", async () => {
      const res = await request(server).post("/api/auth/").send({});
      expect(res.status).toBe(400);
    });

    it("should return 400 if invalid username provided", async () => {
      const res = await request(server)
        .post("/api/auth/")
        .send({ username: "Admin", password: "Qwer1234" });
      expect(res.status).toBe(400);
    });

    it("should return 400 if invalid password provided", async () => {
      const res = await request(server)
        .post("/api/auth/")
        .send({ username: "admin", password: "Qwer12345" });
      expect(res.status).toBe(400);
    });
    it("should return 200 if it is valid", async () => {
      const res = await request(server)
        .post("/api/auth/")
        .send({ username: "admin", password: "Qwer1234" });
      expect(res.status).toBe(200);
    });
  });
});
