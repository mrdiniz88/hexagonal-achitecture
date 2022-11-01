import { Status } from "../../application/product";


export class ProductDto {
  readonly id?: string;
  readonly name: string;
  readonly price: number;
  readonly status?: Status;

  constructor(name: string, price: number, status?: Status, id?: string) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.status = status;
  }
}
