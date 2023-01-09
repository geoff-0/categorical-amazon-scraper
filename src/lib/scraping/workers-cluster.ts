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
		concurrency: Cluster.CONCURRENCY_BROWSER,
		maxConcurrency: 4,
		monitor: true,
		// puppeteerOptions: { headless: false },
	});

	let products: Product[] = [];

	await cluster.task(async ({ page, data: asin }) => {
		const product = await getProduct({ asin: asin, page: page });

		products.push(Object.assign({ category: category }, product));
	});

	cluster.on("taskerror", (err, data) => {
		console.log(`Error crawling ${data}: ${err.message}`);
	});

	for (let asin of asins) {
		setTimeout(() => {}, 2000);

		cluster.queue(asin);
	}

	await cluster.idle();
	await cluster.close();

	return products;
}
