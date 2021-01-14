const request = require("supertest");
const { Order } = require("../../modules/order");
const { User } = require("../../modules/user");
const mongoose = require("mongoose");

let moment = require("moment");
const { Menu } = require("../../modules/menu");
const today = moment();

let server;
server = require("../../app");

describe("/api/order", () => {
  beforeEach(async () => {
    await Order.remove({});
  });
  afterEach(async () => {
    // server.close();
    await Order.remove({});
  });
  afterAll(async () => {
    server.close();
  });

  describe("GET /", () => {
    let token;
    const exec = async () => {
      return await request(server)
        .get("/api/order/")
        .set({ "x-auth-token": token });
    };
    beforeEach(async () => {
      const user = new User({
        _id: new mongoose.Types.ObjectId().toHexString(),
        username: "James",
        isAdmin: true,
      });
      token = user.generateAuthToken();
      await Order.collection.insertOne({
        order_info: {
          type: "Dine-in",
          peoNum: 1,
          tableNum: 3,
        },
        created_at: today._d,
        is_done: false,
        orderlist: [
          { menu: "5fe6547792cab415ef52a16b", amount: 2, is_sent: false },
          {
            menu: "5fcfba027ad86915f5a47dd9",
            amount: 1,
            desc: "More sauce",
          },
        ],
      });
    });
    it("should return 401 if no token provided", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 200 and an order list if token provided", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("GET /", () => {
    let token;
    const exec = async () => {
      return await request(server)
        .get("/api/order/history")
        .set({ "x-auth-token": token });
    };
    beforeEach(async () => {
      const user = new User({
        _id: new mongoose.Types.ObjectId().toHexString(),
        username: "James",
        isAdmin: true,
      });
      token = user.generateAuthToken();
      await Order.collection.insertOne({
        order_info: {
          type: "Dine-in",
          peoNum: 1,
          tableNum: 3,
        },
        created_at: today._d,
        is_done: true,
        orderlist: [
          { menu: "5fe6547792cab415ef52a16b", amount: 2, is_sent: false },
          {
            menu: "5fcfba027ad86915f5a47dd9",
            amount: 1,
            desc: "More sauce",
          },
        ],
      });
    });
    it("should return 401 if no token provided", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 200 and an order list if token provided", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0]).toHaveProperty("is_done", true);
    });
  });

  describe("GET /:id", () => {
    let token;
    let orderId;
    const exec = async () => {
      return await request(server)
        .get(`/api/order/${orderId}`)
        .set({ "x-auth-token": token });
    };
    beforeEach(async () => {
      const user = new User({
        _id: new mongoose.Types.ObjectId().toHexString(),
        username: "James",
        isAdmin: true,
      });
      token = user.generateAuthToken();
      // orderID = new mongoose.Types.ObjectId().toHexString();
      // await Order.collection.insertOne();

      let order = new Order({
        order_info: {
          type: "Dine-in",
          peoNum: 1,
          tableNum: 3,
        },
        created_at: today._d,
        is_done: false,
        orderlist: [
          { menu: "5fe6547792cab415ef52a16b", amount: 3, is_sent: true },
          {
            menu: "5fcfba027ad86915f5a47dd9",
            amount: 1,
            desc: "More sauce",
          },
        ],
      });

      await order.save();
      orderId = order._id;
    });
    it("should return 401 if no token provided", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 200 and an order list if token provided", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      // expect(res.body.length).toBeGreaterThanOrEqual(1);
      // expect(res.body[0]).toHaveProperty("is_done", true);
    });
  });
});
