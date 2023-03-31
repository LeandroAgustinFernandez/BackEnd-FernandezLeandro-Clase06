import ProductManager from "./ProductManager.js";
import express from "express";
const app = express();

const productManager = new ProductManager("./products.json");

app.get("/", (request, response) => {
  response.send(`<h1>Bienvenido a la tienda de productos</h1>`);
});

app.get("/products", async (request, response) => {
  let { limit } = request.query;
  let products = await productManager.getProducts(limit);
  response.send({ products });
});

app.get("/products/:pid", async (request, response) => {
  let { pid } = request.params;
  let product = await productManager.getProductById(pid);
  response.send({ product });
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}
  
  Testing:

  - Todos los productos: http://localhost:${PORT}/products
  - 5 Primeros productos: http://localhost:${PORT}/products?limit=5
  - Producto con id=2: http://localhost:${PORT}/products/2
  - Producto no existe: http://localhost:${PORT}/products/34123123
  `);
});
