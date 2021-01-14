const request = require("supertest");
const { User } = require("../../modules/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let server;
server = require("../../app");

describe("/api/user", () => {
  beforeEach(async () => {
    await User.remove({});
  });
  afterEach(async () => {
    // server.close();
    await User.remove({});
  });
  afterAll(async () => {
    server.close();
  });
  describe("GET /me", () => {
    beforeEach(async () => {
      const salt = await bcrypt.genSalt(10);

      let payload = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        username: "James",
        isAdmin: true,
      };
      payload.password = await bcrypt.hash("Qwer1234", salt);
      const user = new User(payload);
      await user.save();
    });
    it("should return 401 if no token provided", async () => {
      let res = await request(server).get("/api/user/me");
      expect(res.status).toBe(401);
    });

    it("should return 400 if invalid token provided", async () => {
      let token = jwt.sign(
        {
          _id: new mongoose.Types.ObjectId().toHexString(),
          username: "Tim",
          isAdmin: false,
        },
        "369"
      );

      let res = await request(server)
        .get("/api/user/me")
        .set({ "x-auth-token": token });
      expect(res.status).toBe(400);
    });

    it("should return 200 if valid token provided", async () => {
      let payload = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        username: "Tim",
        isAdmin: false,
      };
      let user = new User(payload);
      let token = user.generateAuthToken();

      let res = await request(server)
        .get("/api/user/me")
        .set({ "x-auth-token": token });

      // let num = 2;
      expect(res.status).toBe(200);
    });
  });
  describe("POST /", () => {
    let token;
    let account;

    const exec = async () => {
      return await request(server)
        .post("/api/user/")
        .set({ "x-auth-token": token })
        .send(account);
    };
    beforeEach(() => {
      account = {
        username: "Tim999",
        password: "Passw0rd",
      };

      let payload = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        username: "James",
        isAdmin: true,
      };

      const user = new User(payload);

      token = user.generateAuthToken();
    });
    it("should return 401 if no token provided", async () => {
      token = "";
      let res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if username is less than 5 character", async () => {
      account.username = "Max";
      let res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if username already has been used.", async () => {
      let testUser = new User({
        username: "James",
        password: "Qwer1234",
        isAdmin: true,
      });
      await testUser.save();

      account.username = "James";

      let res = await exec();
      let found = User.find({ name: "James" });
      expect(res.status).toBe(400);
      expect(found).not.toBeNull();
    });

    it("should return 200 if it is valid", async () => {
      let res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("username", "Tim999");
    });
  });
});
