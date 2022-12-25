export default async function traverseSubcategories(
	this: any,
	node: {} | [],
	productLimit: number,
	process: Function,
	root: string,
) {
	for (let key in node) {
		await process.apply(this, [
			node[key as keyof typeof node],
			productLimit,
			`${root}/${key}`,
		]);
	}
}
