import { existsSync, mkdirSync } from "fs";
import traverseSubcategories from "./traverse-subcategories.js";
import handleProcess from "./process-handler.js";

export default async function generateData(
	categories: {},
	productLimit: number,
	path: string,
) {
	let root = `${path}/data/product_data`;
	if (!existsSync(root)) mkdirSync(root);

	traverseSubcategories(categories, productLimit, handleProcess, root);
}
