import { IProduct, IProductService, Status } from "../../application/product";
import { v4 as uuidv4 } from "uuid";
import { ProductCli } from "./product";
import { left, right } from "../../@shared/errors/either";

describe("Product cli unit tests", () => {
  let productMock: IProduct;
  let productServiceMock: IProductService;

  beforeEach(() => {
    productMock = {
      id: uuidv4(),
      name: "Test",
      status: Status.ENABLED,
      price: 25.99,
      enable: jest.fn().mockReturnValue(
        right({
          ...productMock,
          status: Status.ENABLED,
        }) || left({ ...productMock, status: Status.ENABLED })
      ),
      disable: jest.fn().mockReturnValue(
        right({
          ...productMock,
          status: Status.DISABLED,
        }) || left({ ...productMock, status: Status.DISABLED })
      ),
      isValid: jest.fn(),
    };

    productServiceMock = {
      create: jest
        .fn()
        .mockReturnValue(right(productMock) || left(productMock)),
      disable: jest.fn().mockReturnValue(productMock.disable()),
      enable: jest.fn().mockReturnValue(productMock.enable()),
      get: jest.fn().mockReturnValue(right(productMock) || left(productMock)),
    };
  });

  it("should the create action is called", async () => {
    const resultExpected = `Product ID ${productMock.id} with the name ${productMock.name} has been created with the price ${productMock.price} and status ${productMock.status}`;

    const productCli = new ProductCli(productServiceMock, {
      productName: productMock.name,
      productPrice: productMock.price,
      action: "create",
    });

    const result = await productCli.run();
    expect(resultExpected).toEqual(result);
  });

  it("should the enable action is called", async () => {
    const resultExpected = `Product ${productMock.name} has been enabled`;

    const productCli = new ProductCli(productServiceMock, {
      productName: productMock.name,
      productPrice: productMock.price,
      action: "enable",
    });

    const result = await productCli.run();

    expect(resultExpected).toEqual(result);
  });

  it("should the disable action is called", async () => {
    const resultExpected = `Product ${productMock.name} has been disabled`;

    const productCli = new ProductCli(productServiceMock, {
      productName: productMock.name,
      productPrice: productMock.price,
      action: "disable",
    });

    const result = await productCli.run();
    expect(resultExpected).toEqual(result);
  });

  it("should the get action is called", async () => {
    const resultExpected = `Product ID: ${productMock.id}\nName: ${productMock.name}\nPrice: ${productMock.price}\nStatus: ${productMock.status}`;

    const productCli = new ProductCli(productServiceMock, {
      productName: productMock.name,
      productPrice: productMock.price,
      action: "get",
      productId: productMock.id,
    });

    const result = await productCli.run();
    expect(resultExpected).toEqual(result);
  });
});
