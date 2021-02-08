const request = require("supertest");
const { User } = require("../../modules/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let server = require("../../app");

describe("/api/auth", () => {
  beforeEach(async () => {
    await User.remove({}).exec();
  });
  afterEach(async () => {
    // server.close();
    await User.remove({}).exec();
  });
  beforeAll((done) => {
    done();
  });
  afterAll((done) => {
    server.close();
    mongoose.disconnect(done);
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
      await request(server).post("/api/auth/").send({}).expect(400);
    });

    it("should return 400 if invalid username provided", async () => {
      await request(server)
        .post("/api/auth/")
        .send({ username: "Admin", password: "Qwer1234" })
        .expect(400);
    });

    it("should return 400 if invalid password provided", async () => {
      await request(server)
        .post("/api/auth/")
        .send({ username: "admin", password: "Qwer12345" })
        .expect(400);
    });
    it("should return 200 if it is valid", async () => {
      await request(server)
        .post("/api/auth/")
        .send({ username: "admin", password: "Qwer1234" })
        .expect(200);
    });
  });
});
