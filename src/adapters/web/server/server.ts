import * as express from "express";
import { productHandler } from "../handler/product";
import bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.get("/product/:id", (req, res) => {
  productHandler.getProduct(req, res);
});

app.put("/product/:id/disable", (req, res) => {
  productHandler.disableProduct(req, res);
});

app.put("/product/:id/enable", (req, res) => {
  productHandler.enableProduct(req, res);
});

app.post("/product", (req, res) => {
  productHandler.createProduct(req, res);
});

app.listen(3000);
