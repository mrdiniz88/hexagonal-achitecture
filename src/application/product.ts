import { isEnum, isNumber, isString, isUUID } from "class-validator";
import { Entity, IEntity } from "../@shared/entity";
import { Either, left, right } from "../@shared/errors/either";
import { RequiredParametersError } from "../@shared/errors/required-parameters.error";

export interface IProduct extends IEntity {
  get name(): string;
  get status(): Status;
  get price(): number;
  set price(price: number);
  enable(): void;
  disable(): void;
  isValid(): Either<RequiredParametersError, boolean>;
}

export type Response = Either<RequiredParametersError, IProduct>;

export interface IProductService {
  get(id: string): Promise<Response>;
  create(name: string, price: number, id?: string): Promise<Response>;
  enable(product: IProduct): Promise<Response>;
  disable(product: IProduct): Promise<Response>;
}

interface ProductReader {
  get(id: string): Promise<Response>;
}

interface ProductWriter {
  save(product: IProduct): Promise<Response>;
}

export interface IProductPersistence extends ProductReader, ProductWriter {}

export enum Status {
  DISABLED = "disabled",
  ENABLED = "enabled",
}

interface Props {
  name: string;
  status: Status;
  price?: number;
}

export class Product extends Entity implements IProduct {
  private props: Props;

  constructor(props: Props, id?: string) {
    super(id);
    this.props = props;
  }

  get name(): string {
    return this.props.name;
  }

  get status(): Status {
    return this.props.status;
  }

  get price(): number {
    return this.props.price;
  }

  enable(): void {
    if (this.props.price < 0) {
      throw new Error(
        "The price must be grater than zero to enable the product"
      );
    }

    this.props.status = Status.ENABLED;
  }

  disable(): void {
    if (this.props.price !== 0) {
      throw new Error("The price must be zero in order the product disabled");
    }

    this.props.status = Status.DISABLED;
  }

  isValid(): Either<RequiredParametersError, boolean> {
    if (!isUUID(this.id)) {
      return left(
        new RequiredParametersError("The type UUID in id is required", 400)
      );
    }

    if (!isEnum(this.props.status, Status)) {
      return left(
        new RequiredParametersError(
          "The status must be enabled or disabled",
          400
        )
      );
    }

    if(!isNumber(this.props.price)) {
      return left(
        new RequiredParametersError(
          "The price must be number",
          400
        )
      );
    }

    if(this.props.price <= 0) {
      return left(
        new RequiredParametersError(
          "The price must be grater than zero",
          400
        )
      );
    }

    if(!isString(this.props.name)) {
      return left(
        new RequiredParametersError(
          "The name must be string",
          400
        )
      );
    }


    return right(true);
  }
}
