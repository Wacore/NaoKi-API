const { validateAccount } = require("../../../funcs/accountFuncs");

describe("account.validateAccount", () => {
  it("should return a validated account object", () => {
    const payload = {
      name: "Admin",
    };
    const { value } = validateAccount(payload);

    expect(value).toMatchObject(payload);
  });
});
