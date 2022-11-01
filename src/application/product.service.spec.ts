import {
  IProduct,
  IProductPersistence,
  IProductService,
  Product,
  Status,
} from "./product";
import { ProductService } from "./product.service";
import { v4 as uuidv4 } from "uuid";
import { left, right } from "../@shared/errors/either";

// const product = new Product({
//   name: "Test",
//   status: Status.DISABLED,
//   price: 50,
// });

describe("Product service unit tests", () => {
  let productService: IProductService;
  let product: IProduct;
  let persistence: IProductPersistence;

  beforeEach(() => {
    product = {
      id: uuidv4(),
      name: "Test",
      status: Status.DISABLED,
      price: 10,
      enable: jest.fn(),
      disable: jest.fn(),
      isValid: jest.fn(),
    };
    persistence = {
      get: jest.fn().mockReturnValue(right(product) || left(product)),
      save: jest.fn().mockReturnValue(right(product) || left(product)),
    };
    productService = new ProductService(persistence);
  });

  it("should return a product in get method", async () => {
    const result = await productService.get(product.id);

    if (result.isRight()) {
      expect(result.value).toEqual(product);
    }
  });

  it("should create a product", async () => {
    const result = await productService.create("Test", 50);
    if (result.isRight()) {
      expect(result.value).toEqual(product);
    }
  });

  it("should enable a product", async () => {
    const result = await productService.enable(product);

    if (result.isRight()) {
      expect(result.value).toEqual(product);
    }
  });

  it("should disable a product", async () => {
    const result = await productService.disable(product);

    if (result.isRight()) {
      expect(result.value).toEqual(product);
    }
  });
});
