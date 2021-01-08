const { validateMenu } = require("../../../funcs/menuFuncs");

describe("menu.validateMenu", () => {
  it("should return a validated menu object", () => {
    const payload = {
      name: "Edamame",
      type: "appetizer",
      price: 5.85,
      desc:
        "These edamame pods are boiled and then sauteed in a sesame oil and soy sauce seasoning.",
    };
    const { value } = validateMenu(payload);

    expect(value).toMatchObject(payload);
  });

  it("should return an error message about the invalid input data", () => {
    const payload = {
      name: "err",
      type: "appetizer",
      price: 5.85,
      desc:
        "These edamame pods are boiled and then sauteed in a sesame oil and soy sauce seasoning.",
    };

    const { error } = validateMenu(payload);
    expect(error.details[0].message).toMatch(/at least 5 characters long/);
  });
});
