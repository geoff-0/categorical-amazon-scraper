import { existsSync, mkdirSync, writeFileSync } from "fs";
import getAsins from "./scraping/get-asins.js";
import getProducts from "./scraping/get-products.js";
import { productLimit } from "cas.config.js";
import traverseSubcategories from "./traverse-subcategories.js";

export default async function handleProcess(node: [] | {}, root: string) {
	if (
		typeof (node !== null) &&
		typeof (node === "object") &&
		!Array.isArray(node)
	) {
		console.log(`object category of node: ${Object.keys(node)}`);
		if (!existsSync(root)) mkdirSync(root);

		await traverseSubcategories(node, handleProcess, root);
	} else if (
		typeof (node !== null) &&
		typeof (node === "array") &&
		Array.isArray(node)
	) {
		if (!existsSync(root)) mkdirSync(root);
		for (let category of node) {
			console.log(`array category of node: ${category}`);
			const asinCodes = await getAsins(category, productLimit);
			const products = await getProducts(asinCodes);

			writeFileSync(
				`${root}/${(category as string)
					.replace(/\s+/g, "-")
					.replace("'", "")}_Product-Data.json`,

				JSON.stringify(products),
			);
		}
	}
}
