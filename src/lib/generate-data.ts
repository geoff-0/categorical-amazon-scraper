import { existsSync, mkdirSync } from "fs";
import traverseSubcategories from "./traverse-subcategories.js";
import handleProcess from "./process-handler.js";

export default async function generateData(categories: {}, path: string) {
	let root = `${path}/product_data`;
	if (!existsSync(root)) mkdirSync(root);

	traverseSubcategories(categories, handleProcess, root);
}
