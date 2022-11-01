import { left, right } from "../@shared/errors/either";
import { RequiredParametersError } from "../@shared/errors/required-parameters.error";
import {
  IProduct,
  IProductPersistence,
  IProductService,
  Product,
  Response,
  Status,
} from "./product";

export class ProductService implements IProductService {
  constructor(private persistence: IProductPersistence) {}

  async get(id: string): Promise<Response> {
    const result = await this.persistence.get(id);

    if (result.isLeft()) {
      return left(
        new RequiredParametersError(
          result.value.message,
          result.value.statusCode
        )
      );
    } else {
      return right(result.value);
    }
  }

  async create(name: string, price: number): Promise<Response> {
    const product = new Product({
      name,
      price,
      status: Status.DISABLED,
    });

    const isValid = product.isValid();

    if (isValid.isLeft()) {
      return left(
        new RequiredParametersError(
          isValid.value.message,
          isValid.value.statusCode
        )
      );
    }

    const result = await this.persistence.save(product);

    if (result.isLeft()) {
      return left(
        new RequiredParametersError(
          result.value.message,
          result.value.statusCode
        )
      );
    }

    return right(result.value);
  }

  async enable(product: IProduct): Promise<Response> {
    try {
      product.enable();
    } catch (err) {
      return left(
        new RequiredParametersError(
          "The price must be grater than zero to enable the product",
          400
        )
      );
    }

    const result = await this.persistence.save(product);

    if (result.isLeft()) {
      return left(
        new RequiredParametersError(
          result.value.message,
          result.value.statusCode
        )
      );
    }

    return right(result.value);
  }

  async disable(product: IProduct): Promise<Response> {
    product.price = 0;
    try {
      product.disable();
    } catch (err) {
      return left(
        new RequiredParametersError(
          "The price must be zero in order the product disabled",
          400
        )
      );
    }

    const result = await this.persistence.save(product);

    if (result.isLeft()) {
      return left(
        new RequiredParametersError(
          result.value.message,
          result.value.statusCode
        )
      );
    }

    return right(result.value);
  }
}
