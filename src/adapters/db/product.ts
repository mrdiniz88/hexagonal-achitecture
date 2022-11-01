import { prisma } from "./prisma/client";
import {
  IProduct,
  IProductPersistence,
  Product,
  Response,
  Status,
} from "../../application/product";
import { left, right } from "../../@shared/errors/either";
import { RequiredParametersError } from "../../@shared/errors/required-parameters.error";

export class ProductDb implements IProductPersistence {
  async get(id: string): Promise<Response> {
    try {
      const product = await prisma.products.findUniqueOrThrow({
        where: {
          id,
        },
      });

      return right(
        new Product(
          {
            name: product.name,
            status: product.status as Status,
            price: product.price,
          },
          product.id
        )
      );
    } catch (err) {
      return left(new RequiredParametersError("Product not found", 404));
    }
  }

  async save(data: IProduct): Promise<Response> {
    const creatorExists = await prisma.products.findUnique({
      where: { id: data.id },
    });

    if (!creatorExists) {
      return right(await this.create(data));
    } else {
      return right(await this.update(data));
    }
  }

  private async create({
    id,
    name,
    price,
    status,
  }: IProduct): Promise<IProduct> {
    const productCreated = await prisma.products.create({
      data: {
        id,
        name,
        price,
        status,
      },
    });

    return new Product(
      {
        name: productCreated.name,
        status: productCreated.status as Status,
        price: productCreated.price,
      },
      productCreated.id
    );
  }

  private async update({
    id,
    name,
    price,
    status,
  }: IProduct): Promise<IProduct> {
    const productCreated = await prisma.products.update({
      where: {
        id,
      },
      data: {
        id,
        name,
        price,
        status,
      },
    });

    return new Product(
      {
        name: productCreated.name,
        status: productCreated.status as Status,
        price: productCreated.price,
      },
      productCreated.id
    );
  }
}
