import { Cluster } from "puppeteer-cluster";
import { Product } from "../types/product.js";
import getProduct from "./product-worker.js";

export default async function getProducts(props: {
	category: string;
	asins: string[];
	productLimit: number;
}) {
	const { category, asins, productLimit } = props;

	const cluster = await Cluster.launch({
		concurrency: Cluster.CONCURRENCY_CONTEXT,
		maxConcurrency: 7,
	});

	let products: Product[] = [];

	cluster.task(async ({ page, data: asin }) => {
		const product = await getProduct({ asin: asin, page: page }).catch(
			(err: any) => {
				console.error(`${asin}-${category} ERROR: ${err}`);
			},
		);

		products.push(product);
	});

	for (let asin of asins) {
		cluster.queue(asin);
	}

	await cluster.idle();
	await cluster.close();

	return products;
}
