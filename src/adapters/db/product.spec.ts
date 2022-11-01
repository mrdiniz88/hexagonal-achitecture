import { prisma } from "./prisma/client";
import { ProductDb } from "./product";
import { v4 as uuidv4 } from "uuid";
import { products } from "@prisma/client";
import { Product, Status } from "../../application/product";

describe("Product database test", () => {
  let productCreated: products;

  beforeEach(async () => {
    productCreated = await prisma.products.create({
      data: {
        id: uuidv4(),
        name: "Test",
        price: 4,
        status: "disabled",
      },
    });
  });

  it("should be called product creation", () => {
    expect(productCreated).toBeDefined();
  });

  it("should get return data from the method equal to the defined product", async () => {
    const productDb = new ProductDb();
    const product = await productDb.get(productCreated.id);

    if (product.isRight()) {
      expect(product.value.name).toEqual(productCreated.name);
      expect(product.value.price).toEqual(productCreated.price);
      expect(product.value.status).toEqual(productCreated.status);
    }
  });

  it("should product be saved in the database", async () => {
    const productDB = new ProductDb();

    const product = new Product({
      name: "Test",
      status: Status.DISABLED,
      price: 4,
    });

    const productResultCreate = await productDB.save(product);

    // expect(productResultCreate).not.toThrowError();
    if (productResultCreate.isRight()) {
      expect(productResultCreate.value.name).toEqual(product.name);
      expect(productResultCreate.value.price).toEqual(product.price);
      expect(productResultCreate.value.status).toEqual(product.status);
    }

    product.enable();

    const productResultUpdate = await productDB.save(product);

    // expect(productResultUpdate).not.toThrowError();
    if (productResultUpdate.isRight()) {
      expect(productResultUpdate.value.name).toEqual(product.name);
      expect(productResultUpdate.value.price).toEqual(product.price);
      expect(productResultUpdate.value.status).toEqual(product.status);
    }
  });
});
