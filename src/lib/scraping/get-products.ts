import { Cluster } from "puppeteer-cluster";
import getProduct from "./product-worker.js";

export default async function getProducts(
  asins: string[],
  productLimit: number
) {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: productLimit,
  });

  let products: {}[] = [];

  await cluster.task(async ({ page, data: asin }) => {
    const product = await getProduct(asin, page);
    console.log(product);

    products.push(product);
  });

  for (let asin of asins) {
    await cluster.queue(asin);
  }

  await cluster.idle();
  await cluster.close();

  return products;
}
