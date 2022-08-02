import { existsSync, mkdirSync, writeFileSync } from "fs";
import getAsins from "./scraping/get-asins.js";
import getProducts from "./scraping/get-products.js";
import { productLimit } from "../../cas.config.js";
import traverseSubcategories from "./traverse-subcategories.js";

export default async function handleProcess(node: [] | {}, root: string) {
	function camelize(str: string) {
		return str
			.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
				return index === 0 ? word.toLowerCase() : word.toUpperCase();
			})
			.replace(/\s+/g, "");
	}

	if (
		typeof (node !== null) &&
		typeof (node === "object") &&
		!Array.isArray(node)
	) {
		for (let key in node) {
			let path = `${root}/${key}`;
			if (!existsSync(path)) mkdirSync(path);
			await handleProcess(node[key as keyof typeof node], path);
			traverseSubcategories(
				node[key as keyof typeof node],
				handleProcess,
				root,
			);
		}
	} else if (
		typeof (node !== null) &&
		typeof (node === "array") &&
		Array.isArray(node)
	) {
		for (let category of node) {
			console.log(`array category of node: ${category}`);
			const asinCodes = await getAsins(category, productLimit);
			const products = await getProducts(asinCodes);

			writeFileSync(
				`${root}/${camelize(category as string).replace(
					"'",
					"",
				)}_Product-Data.json`,

				JSON.stringify(products),
			);
		}
	}
}
