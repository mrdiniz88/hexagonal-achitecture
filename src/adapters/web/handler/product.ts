import { IProductService } from "../../../application/product";
import { ProductService } from "../../../application/product.service";
import { ProductDb } from "../../db/product";
import { Request, Response } from "express";
import { ProductDto } from "../../dto/product.dto";

class Product {
  constructor(private productService: IProductService) {}

  async getProduct(req: Request, res: Response) {
    const result = await this.productService.get(req.params.id);

    if (result.isLeft()) {
      res.status(result.value.statusCode).send(result.value.message);
    } else {
      const productDto = new ProductDto(
        result.value.name,
        result.value.price,
        result.value.status,
        result.value.id
      );

      res.json(productDto);
    }
  }

  async disableProduct(req: Request, res: Response) {
    const productResult = await this.productService.get(req.params.id);

    if (productResult.isLeft()) {
      res
        .status(productResult.value.statusCode)
        .send(productResult.value.message);
    } else {
      const result = await this.productService.disable(productResult.value);

      if (result.isLeft()) {
        res.status(result.value.statusCode).send(result.value.message);
      } else {
        const productDto = new ProductDto(
          result.value.name,
          result.value.price,
          result.value.status,
          result.value.id
        );

        res.json(productDto);
      }
    }
  }

  async enableProduct(req: Request, res: Response) {
    const productResult = await this.productService.get(req.params.id);

    if (productResult.isLeft()) {
      res
        .status(productResult.value.statusCode)
        .send(productResult.value.message);
    } else {
      const result = await this.productService.enable(productResult.value);

      if (result.isLeft()) {
        res.status(result.value.statusCode).send(result.value.message);
      } else {
        const productDto = new ProductDto(
          result.value.name,
          result.value.price,
          result.value.status,
          result.value.id
        );

        res.json(productDto);
      }
    }
  }

  async createProduct(req: Request, res: Response) {
    const { name, price } = req.body;

    const productCreated = await this.productService.create(
      name,
      price
    );

    if (productCreated.isLeft()) {
      return res
        .status(productCreated.value.statusCode)
        .send(productCreated.value.message);
    }

    const product = new ProductDto(
      productCreated.value.name,
      productCreated.value.price,
      productCreated.value.status,
      productCreated.value.id
    );

    res.status(201).json(product);
  }
}

const productPercistence = new ProductDb();

const productService = new ProductService(productPercistence);

export const productHandler = new Product(productService);
