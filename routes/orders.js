const express = require("express");
const router = express();
const asyncMiddleware = require("../middleware/async");
const { Order } = require("../modules/order");
const { User } = require("../modules/user");
const auth = require("../middleware/auth");
const _ = require("lodash");
const { Expo } = require("expo-server-sdk");

const {
  validateOrderInfo,
  validateOrderList,
  validateCustomerInfo,
  validateOrder,
  validateServerId,
} = require("../funcs/orderFuncs");
let moment = require("moment");
const sendPushNotification = require("../utilities/pushNotifications");

// const dateNewYork = moment.tz(Date.now(), "America/America/New_York").format();
const today = moment().startOf("day");

router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const orders = await Order.find({
      created_at: {
        $gte: today.toDate(),
        $lte: moment(today).endOf("day").toDate(),
      },
      is_done: false,
    }).populate("orderlist.menu");
    res.send(orders);
  })
);

router.get(
  "/history",
  auth,
  asyncMiddleware(async (req, res) => {
    const orders = await Order.find({
      created_at: {
        $gte: today.toDate(),
        $lte: moment(today).endOf("day").toDate(),
      },
    }).populate("orderlist.menu");
    res.send(orders);
  })
);

router.get(
  "/all",
  auth,
  asyncMiddleware(async (req, res) => {
    const orders = await Order.find();
    res.send(orders);
  })
);

router.get(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "orderlist.menu"
    );
    if (!order)
      return res.status(404).send("The order with the given id was not found.");

    res.send(order);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { order_info, orderlist, customer_info, serverId } = req.body;
    const orderInfoValidated = validateOrderInfo(req.body.order_info);
    if (orderInfoValidated.error)
      return res.status(400).send(orderInfoValidated.error.details[0].message);
    const orderlistValidated = validateOrderList(orderlist);
    if (orderlistValidated.error)
      return res.status(400).send(orderlistValidated.error.details[0].message);
    const serverIdValidated = validateServerId({ id: serverId });
    if (serverIdValidated.error)
      return res.status(400).send(serverIdValidated.error.details[0].message);

    let order;
    if (order_info.type == "To-go") {
      if (!customer_info)
        return res.status(400).send("No customer info provided.");
      const { error } = validateCustomerInfo(customer_info);
      if (error) return res.status(400).send(error.details[0].message);
      order = new Order({
        order_info: {
          orderNum: order_info.orderNum,
          type: order_info.type,
          pickupTime: order_info.pickupTime,
        },
        customer_info: {
          name: customer_info.name,
          phoneNum: customer_info.phoneNum,
        },
      });
    } else {
      order = new Order({
        order_info: {
          orderNum: order_info.orderNum,
          type: order_info.type,
          peoNum: order_info.peoNum,
          tableNum: order_info.tableNum,
        },
      });
    }

    order.orderlist = orderlist;
    order.serverId = serverId;

    order = await order.save();
    res.send(order);
  })
);

router.post(
  "/:id/messaging",
  auth,
  asyncMiddleware(async (req, res) => {
    const { serverId } = req.body;
    const serverIdValidated = validateServerId({ id: serverId });
    if (serverIdValidated.error)
      return res.status(400).send(serverIdValidated.error.details[0].message);

    const targetServer = await User.findById(serverId);
    if (!targetServer)
      return res
        .status(404)
        .send("The server with the given Id was not found.");

    const { expoPushToken } = targetServer;
    let message = "Dish is ready";

    if (Expo.isExpoPushToken(expoPushToken))
      await sendPushNotification(expoPushToken, message);

    res.status(201).send();
  })
);

router.put(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const { orderlist } = req.body;
    const orderlistValidated = validateOrderList(orderlist);
    if (orderlistValidated.error)
      return res.status(400).send(orderlistValidated.error.details[0].message);

    let order;
    if (req.body.is_done) {
      order = await Order.updateOne(
        { _id: req.params.id },
        {
          is_done: req.body.is_done,
          orderlist: orderlist,
        }
      );
    } else {
      order = await Order.updateOne(
        { _id: req.params.id },
        {
          orderlist: orderlist,
        }
      );
    }

    res.send(order);
  })
);

router.put(
  "/:id/add",
  auth,
  asyncMiddleware(async (req, res) => {
    const orderlistValidated = validateOrder(req.body);
    if (orderlistValidated.error)
      return res.status(400).send(orderlistValidated.error.details[0].message);

    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).send("The order with the given id was not found.");

    let newOrderList = [...order.orderlist, req.body];

    order.set({ orderlist: newOrderList });

    order.save();

    res.send(order);
  })
);

router.put(
  "/:id/edit",
  auth,
  asyncMiddleware(async (req, res) => {
    const { order_info, orderlist, customer_info } = req.body;
    const orderInfoValidated = validateOrderInfo(order_info);
    if (orderInfoValidated.error)
      return res.status(400).send(orderInfoValidated.error.details[0].message);
    const orderlistValidated = validateOrderList(orderlist);
    if (orderlistValidated.error)
      return res.status(400).send(orderlistValidated.error.details[0].message);

    // if (customer_info) {
    const customerInfoValidated = validateCustomerInfo(customer_info);
    if (customerInfoValidated.error)
      return res.status(400).send(orderlistValidated.error.details[0].message);
    // }
    const order = await Order.updateOne(
      { _id: req.params.id },
      {
        order_info: order_info,
        orderlist: orderlist,
        customer_info: customer_info,
      }
    );

    res.send(order);
  })
);

router.delete(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order)
      return res
        .status(404)
        .send("The order with the given id was not found. Please try again");
    res.send(order);
  })
);

module.exports = router;
