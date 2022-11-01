import { IProductService, Status } from "../../application/product";

interface Props {
  action: string;
  productId?: string;
  productName: string;
  productPrice: number;
}

export class ProductCli {
  private props: Props;
  private result: string;

  constructor(private readonly productService: IProductService, props: Props) {
    this.props = props;
  }

  async run() {
    switch (this.props.action) {
      case "create": {
        const product = await this.productService.create(
          this.props.productName,
          this.props.productPrice
        );

        if (product.isLeft()) {
          this.result = product.value.message;
        }

        if (product.isRight()) {
          this.result = `Product ID ${product.value.id} with the name ${product.value.name} has been created with the price ${product.value.price} and status ${product.value.status}`;
        }

        break;
      }
      case "enable": {
        const result = await this.productService.get(this.props.productId);

        if (result.isLeft()) {
          this.result = result.value.message;
        }

        if (result.isRight()) {
          const res = await this.productService.enable(result.value);
          if (res.isLeft()) {
            this.result = res.value.message;
          } else {
            this.result = `Product ${res.value.name} has been ${res.value.status}`;
          }
        }

        break;
      }
      case "disable": {
        const product = await this.productService.get(this.props.productId);

        if (product.isLeft()) {
          this.result = product.value.message;
        } else {
          const res = await this.productService.disable(product.value);
          if (res.isRight()) {
            this.result = `Product ${res.value.name} has been ${res.value.status}`;
          } else {
            this.result = res.value.message;
          }
        }

        break;
      }
      default:
        const product = await this.productService.get(this.props.productId);

        if (product.isLeft()) {
          this.result = product.value.message;
        } else {
          this.result = `Product ID: ${product.value.id}\nName: ${product.value.name}\nPrice: ${product.value.price}\nStatus: ${product.value.status}`;
        }

        break;
    }

    return this.result;
  }
}
