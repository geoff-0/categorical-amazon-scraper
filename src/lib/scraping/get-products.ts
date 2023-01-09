import { Cluster } from "puppeteer-cluster";
import { Product } from "../types/product.js";
import getProduct from "./product-worker.js";

export default async function getProducts(
  asins: string[],
  productLimit: number
) {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_BROWSER,
    maxConcurrency: productLimit,
  });

  let products: Product[] = [];

  await cluster.task(async ({ page, data: asin }) => {
    const product = await getProduct({ asin: asin, page: page });

    products.push(product);
  });

  for (let asin of asins) {
    try {
      await cluster.execute(asin);
    } catch (err: any) {
      console.error(`ASIN ${asin} ERROR: ${err}`);
    }
  }

  await cluster.idle();
  await cluster.close();

  return products;
}
