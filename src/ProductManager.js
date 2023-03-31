import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    let products = await this.getProducts();
    try {
      if (this.#checkMandatoryFields([...arguments]))
        throw new Error(`All the fields are mandatory.`);
      if (this.#checkIfCodeExists(products, code))
        throw new Error(`The product code already exists.`);
      let id = products[products.length - 1]?.id + 1 || 1;
      const newProduct = {
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return { success: `El producto se agrego correctamente.` };
    } catch (error) {
      return { error: `${error.message}` };
    }
  }

  #checkIfCodeExists(products, code) {
    return products.find((product) => product.code === code);
  }

  #checkMandatoryFields(fields) {
    if (fields.length !== 6) return true;
    return fields.some((field) => field === "" || field === undefined);
  }

  async getProducts(limit = false) {
    if (fs.existsSync(this.path)) {
      let products = await fs.promises.readFile(this.path, "utf-8");
      return limit === false
        ? JSON.parse(products)
        : JSON.parse(products).splice(0, limit);
    } else {
      return [];
    }
  }

  async getProductById(id) {
    let products = await this.getProducts();
    let product = products.find((product) => product.id === parseInt(id));
    try {
      if (!product) throw new Error(`Product not found`);
      return product;
    } catch (error) {
      return { error: `${error.message}` };
    }
  }

  async updateProduct(id, newParams) {
    if (Object.keys(newParams).includes("id")) delete newParams.id;
    let products = await this.getProducts();
    products = products.map((product) => {
      if (product.id === id) product = { ...product, ...newParams };
      return product;
    });
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  async deleteProduct(id) {
    let products = await this.getProducts();
    try {
      let productExist = products.find((product) => product.id === id);
      if (!productExist) throw new Error(`Product doesn't exist.`);
      products.splice(products.indexOf(productExist), 1);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return `The product was successfully removed`;
    } catch (error) {
      return { error: `${error.message}` };
    }
  }
}
