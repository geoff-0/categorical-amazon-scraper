import { existsSync, mkdirSync } from "fs";

export default async function traverseSubcategories(
	node: {} | [],
	process: Function,
	root: string,
) {
	for (let key in node) {
		process(node[key as keyof typeof node], root);
		traverseSubcategories(node[key as keyof typeof node], process, root);
	}
}
