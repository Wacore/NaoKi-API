const request = require("supertest");
const { Menu } = require("../../modules/menu");
const { User } = require("../../modules/user");
const mongoose = require("mongoose");

let server;
let token;
server = require("../../app");

describe("/api/menu", () => {
  beforeEach(() => {
    let payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      username: "James",
      isAdmin: true,
    };
    const user = new User(payload);

    token = user.generateAuthToken();
  });
  afterEach(async () => {
    // server.close();
    await Menu.remove({});
  });
  afterAll(async () => {
    server.close();
  });
  describe("GET /", () => {
    it("should return 401 code", async () => {
      const res = await request(server).get("/api/menu");
      expect(res.status).toBe(401);
    });

    it("should return 200 code with all menu items", async () => {
      await Menu.collection.insertMany([
        {
          name: "item1",
          type: "appetizer",
          price: 3,
          desc: "desc1",
        },
        {
          name: "item2",
          type: "appetizer",
          price: 3,
          desc: "desc2",
        },
      ]);
      const res = await request(server).get("/api/menu").set({
        "x-auth-token": token,
      });
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((m) => m.name === "item1")).toBeTruthy();
      expect(res.body.some((m) => m.name === "item2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return 200 code with the selected menu item", async () => {
      let menu = new Menu({
        name: "item1",
        type: "appetizer",
        price: 5,
        desc: "desc1",
      });
      await menu.save();
      const id = menu._id;

      const res = await request(server).get(`/api/menu/${id}`).set({
        "x-auth-token": token,
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", menu.name);
    });
  });

  describe("POST /", () => {
    let menu;

    const exec = async () => {
      return await request(server).post(`/api/menu`).send(menu).set({
        "x-auth-token": token,
      });
    };
    beforeEach(() => {
      menu = {
        name: "edamame",
        type: "appetizer",
        price: 5,
        desc: "desc1",
      };
    });
    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });
    it("should return 400 code if name is less than 5 characters", async () => {
      menu.name = "it";

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it("should return 400 code if name is more than 26 characters", async () => {
      menu.name = new Array(27).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the item if it is valid", async () => {
      const res = await exec();

      const item = await Menu.find({ name: "edamame" });

      expect(res.status).toBe(200);
      expect(item).not.toBeNull();
    });

    it("should return the item if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "edamame");
    });
  });
  describe("PUT /", () => {
    let saved, id;
    let menu;
    const exec = async () => {
      return await request(server).put(`/api/menu/${id}`).send(menu).set({
        "x-auth-token": token,
      });
    };
    beforeEach(async () => {
      menu = {
        name: "edamame",
        type: "appetizer",
        price: 5,
        desc: "desc1",
      };
      saved = new Menu(menu);
      await saved.save();
      id = saved._id;
    });
    it("should return 404 if id is invalid", async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if name is less than 5 characters", async () => {
      menu.name = "a";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if name is more than 26 characters", async () => {
      menu.name = new Array(27).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should modify the menu item if it is valid", async () => {
      menu.name = "edamame2";
      const res = await exec();
      const item = await Menu.find({ name: "edamame2" });
      expect(res.status).toBe(200);
      expect(item).not.toBeNull();
    });
  });

  describe("DELETE /", () => {
    let id;
    let menu;
    const exec = async () => {
      return await request(server).delete(`/api/menu/${id}`).set({
        "x-auth-token": token,
      });
    };
    beforeEach(async () => {
      menu = new Menu({
        name: "edamame",
        type: "appetizer",
        price: 5,
        desc: "desc1",
      });
      await menu.save();
      id = menu._id;
    });

    it("should return 404 if id is invalid", async () => {
      const res = await request(server)
        .delete(`/api/menu/5fcfdc663f302c1a227f4d9a`)
        .set({
          "x-auth-token": token,
        });
      expect(res.status).toBe(404);
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it("should return 200 if it is valid.", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });
  });
});
