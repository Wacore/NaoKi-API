const {
  validateOrderInfo,
  validateOrderList,
} = require("../../../funcs/orderFuncs");

describe("order.validateOrderInfo", () => {
  it("should return a validated menu object", () => {
    const payload = {
      type: "To-go",
      pickupTime: 45,
    };
    const { value } = validateOrderInfo(payload);

    expect(value).toMatchObject(payload);
  });

  it("should return an error message about the invalid input data", () => {
    const payload = {
      type: "To-go",
      pickupTime: "a`",
    };

    const { error } = validateOrderInfo(payload);
    expect(error.details[0].message).toMatch(/"pickupTime" must be a number/);
  });
});

describe("order.validateOrderList", () => {
  it("should return a validated menu object", () => {
    const payload = [
      {
        menu: "5fe6547792cab415ef52a16b",
        amount: 2,
        isSent: false,
      },
      {
        menu: "5fcfba027ad86915f5a47dd9",
        amount: 1,
        desc: "More sauce",
      },
    ];
    const { value } = validateOrderList(payload);

    expect(value[0]).toMatchObject({
      menu: "5fe6547792cab415ef52a16b",
      amount: 2,
      isSent: false,
    });
    expect(value[1]).toMatchObject({
      menu: "5fcfba027ad86915f5a47dd9",
      amount: 1,
      desc: "More sauce",
    });
  });
});
