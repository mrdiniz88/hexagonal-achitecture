import { Product, Status } from "./product";

describe("Product unit tests", () => {
  it("should enable product", () => {
    const product = new Product({
      name: "hello",
      status: Status.DISABLED,
      price: 10,
    });

    product.enable();

    expect(product.status).toBe("enabled");
  });

  it("should throw a error when price less than 0", () => {
    const product = new Product({
      name: "hello",
      status: Status.DISABLED,
      price: -1,
    });

    expect(() => {
      product.enable();
    }).toThrowError("The price must be grater than zero to enable the product");
  });

  it("should disable product", () => {
    const product = new Product({
      name: "hello",
      status: Status.ENABLED,
      price: 0,
    });

    product.disable();

    expect(product.status).toBe("disabled");
  });

  it("should throw an error when deactivating product that has non-zero price", () => {
    const product = new Product({
      name: "hello",
      status: Status.ENABLED,
      price: 10,
    });

    expect(() => {
      product.disable();
    }).toThrowError("The price must be zero in order the product disabled");
  });

  it("should throw an error when id is not valid", () => {
    const product = new Product(
      { name: "hello", status: Status.DISABLED, price: 10 },

      "this is not a UUID"
    );

    const isValid = product.isValid();

    if (isValid.isLeft()) {
      expect(isValid.value.message).toEqual("The type UUID in id is required");
    }
  });

  // it("should throw an error when status is not valid", () => {
  // expect(() => {
  // new Product({ name: "hello", status: "teste", price: 9 });
  // }).toThrowError("The status must be enabled or disabled");
  // });
});
