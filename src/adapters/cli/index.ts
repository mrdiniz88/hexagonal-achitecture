import { Command } from "commander";
import { ProductService } from "../../application/product.service";
import { ProductDb } from "../db/product";
import { ProductCli } from "./product";

export class Cli {
  async handler() {
    const command = new Command()
      .option("-i, --id <id>", "enter product id", "")
      .option("-n, --name <name>", "enter product name", "")
      .option("-p, --price <price>", "enter product price", "0")
      .option("-a, --action <action>", "enter the action", "");

    command.parse();

    const { id, name, price, action } = command.opts();

    const productPersistence = new ProductDb();

    const productService = new ProductService(productPersistence);

    const productCli = new ProductCli(productService, {
      productId: id,
      productName: name,
      productPrice: +price,
      action,
    });

    const result = await productCli.run();
    console.log(result);
    // const teste = await this.productCli.run();

    // console.log(teste);
  }
}

new Cli().handler();
