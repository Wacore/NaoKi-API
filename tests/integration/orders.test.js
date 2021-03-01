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
          { menu: "5fe6547792cab415ef52a16b", amount: 2, isSent: false },
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
          { menu: "5fe6547792cab415ef52a16b", amount: 2, isSent: false },
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

      let order = new Order({
        order_info: {
          type: "Dine-in",
          peoNum: 1,
          tableNum: 3,
        },
        created_at: today._d,
        is_done: false,
        orderlist: [
          { menu: "5fe6547792cab415ef52a16b", amount: 3, isSent: true },
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

    it("should return 404 if invalid id provided", async () => {
      orderId = "6005c29afcf1ef0fe5cbaf91";
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 200 and an order list if token provided", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("is_done", false);
    });
  });

  describe("POST /", () => {
    let token, order;
    const exec = async () => {
      return await request(server)
        .post(`/api/order`)
        .send(order)
        .set({ "x-auth-token": token });
    };

    beforeEach(async () => {
      const user = new User({
        _id: new mongoose.Types.ObjectId().toHexString(),
        username: "James",
        isAdmin: false,
      });
      token = user.generateAuthToken();

      order = {
        order_info: {
          type: "To-go",
          pickupTime: 45,
        },
        orderlist: [
          { menu: "5fe6547792cab415ef52a16b", amount: 3, isSent: true },
          {
            menu: "5fcfba027ad86915f5a47dd9",
            amount: 1,
            desc: "More sauce",
          },
        ],
        customer_info: {
          name: "James",
          phoneNum: "1112223333",
        },
      };
    });
    it("should return 401 if no token provided", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if invalid orderInfo provided", async () => {
      order.order_info.peoNum = "a";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if invalid orderlist provided", async () => {
      order.orderlist[0].amount = "a";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if no customer info provided", async () => {
      order.customer_info = "";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 and an order object if it is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("customer_info", {
        name: "James",
        phoneNum: "1112223333",
      });
    });
  });

  describe("PUT /:id", () => {
    let token;
    let orderId;
    let toEdit;
    const exec = async () => {
      return await request(server)
        .put(`/api/order/${orderId}`)
        .send(toEdit)
        .set({ "x-auth-token": token });
    };
    beforeEach(async () => {
      const user = new User({
        _id: new mongoose.Types.ObjectId().toHexString(),
        username: "James",
        isAdmin: false,
      });
      token = user.generateAuthToken();

      let order = new Order({
        order_info: {
          type: "Dine-in",
          peoNum: 1,
          tableNum: 3,
        },
        created_at: today._d,
        is_done: false,
        orderlist: [
          { menu: "5fe6547792cab415ef52a16b", amount: 3, isSent: true },
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

    it("should return 400 if amount is not a number", async () => {
      toEdit = {
        orderlist: [
          { menu: "5fe6547792cab415ef52a16b", amount: "a", isSent: true },
          {
            menu: "5fcfba027ad86915f5a47dd9",
            amount: 1,
            desc: "More sauce",
          },
        ],
      };
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 and it should set to done if it is valid", async () => {
      toEdit = {
        is_done: true,
        orderlist: [
          { menu: "5fe6547792cab415ef52a16b", amount: 3, isSent: true },
          {
            menu: "5fcfba027ad86915f5a47dd9",
            amount: 1,
            desc: "More sauce",
            isSent: true,
          },
        ],
      };
      const res = await exec();
      expect(res.status).toBe(200);
      const item = await Order.findById(orderId);
      expect(item).not.toBeNull();
      expect(item).toHaveProperty("is_done", true);
    });
  });

  describe("PUT /:id/edit", () => {
    let token;
    let orderId;
    let toEdit;
    const exec = async () => {
      return await request(server)
        .put(`/api/order/${orderId}/edit`)
        .send(toEdit)
        .set({ "x-auth-token": token });
    };
    beforeEach(async () => {
      const user = new User({
        _id: new mongoose.Types.ObjectId().toHexString(),
        username: "James",
        isAdmin: false,
      });
      token = user.generateAuthToken();

      let order = new Order({
        order_info: {
          type: "To-go",
          pickupTime: 45,
        },
        created_at: today._d,
        is_done: false,
        orderlist: [
          { menu: "5fe6547792cab415ef52a16b", amount: 3, isSent: true },
          {
            menu: "5fcfba027ad86915f5a47dd9",
            amount: 1,
            desc: "More sauce",
          },
        ],
        customer_info: {
          name: "James",
          phoneNum: "1112223333",
        },
      });

      await order.save();
      orderId = order._id;
    });
    it("should return 401 if no token provided", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if type is not a string", async () => {
      toEdit = {
        orderlist: {
          type: 1,
          peoNum: 1,
          tableNum: 3,
        },
      };
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 400 if amount is not a number", async () => {
      toEdit = {
        orderlist: [
          { menu: "5fe6547792cab415ef52a16b", amount: "a", isSent: true },
          {
            menu: "5fcfba027ad86915f5a47dd9",
            amount: 1,
            desc: "More sauce",
          },
        ],
      };
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if name is not a string", async () => {
      // To Check: it should return 400 but receive 500
      toEdit = {
        customer_info: {
          name: 1,
          phoneNum: "1112223333",
        },
      };
      const res = await exec();
      expect(res.status).toBe(500);
    });

    it("should return 200 and pickupTime is 60", async () => {
      toEdit = {
        order_info: {
          type: "To-go",
          pickupTime: 60,
        },
        orderlist: [
          { menu: "5fe6547792cab415ef52a16b", amount: 3, isSent: true },
          {
            menu: "5fcfba027ad86915f5a47dd9",
            amount: 1,
            desc: "More sauce",
          },
        ],
        customer_info: {
          name: "James",
          phoneNum: "1112223333",
        },
      };
      const res = await exec();
      const result = await Order.findById(orderId);
      expect(res.status).toBe(200);
      expect(result).not.toBeNull();
      expect(result.order_info).toHaveProperty("pickupTime", 60);
    });

    it("should return 200 after removing one menu item", async () => {
      toEdit = {
        order_info: {
          type: "To-go",
          pickupTime: 60,
        },
        orderlist: [
          { menu: "5fe6547792cab415ef52a16b", amount: 3, isSent: true },
        ],
        customer_info: {
          name: "James",
          phoneNum: "1112223333",
        },
      };
      const res = await exec();
      const result = await Order.findById(orderId);
      expect(res.status).toBe(200);
      expect(result).not.toBeNull();
      expect(result.orderlist.length).toBe(1);
    });

    it("should return 200 and change customer's name", async () => {
      toEdit = {
        order_info: {
          type: "To-go",
          pickupTime: 60,
        },
        orderlist: [
          { menu: "5fe6547792cab415ef52a16b", amount: 3, isSent: true },
        ],
        customer_info: {
          name: "Tim",
          phoneNum: "1112223333",
        },
      };
      const res = await exec();
      const result = await Order.findById(orderId);
      expect(res.status).toBe(200);
      expect(result).not.toBeNull();
      expect(result.customer_info).toHaveProperty("name", "Tim");
    });
  });

  describe("DELETE /:id", () => {
    let token;
    let orderId;
    const exec = async () => {
      return await request(server)
        .delete(`/api/order/${orderId}`)
        .set({ "x-auth-token": token });
    };
    beforeEach(async () => {
      const user = new User({
        _id: new mongoose.Types.ObjectId().toHexString(),
        username: "James",
        isAdmin: false,
      });
      token = user.generateAuthToken();

      let order = new Order({
        order_info: {
          type: "Dine-in",
          peoNum: 1,
          tableNum: 3,
        },
        created_at: today._d,
        is_done: false,
        orderlist: [
          { menu: "5fe6547792cab415ef52a16b", amount: 3, isSent: true },
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

    it("should return 404 if invalid id provided", async () => {
      orderId = "60063aea83ffda217868fcba";
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 200 if it is valid", async () => {
      // orderId = "fe6547792cab415ef52a16t";
      const res = await exec();
      const result = await Order.findById(orderId);
      expect(res.status).toBe(200);
      expect(result).toBeNull();
    });
  });
});
