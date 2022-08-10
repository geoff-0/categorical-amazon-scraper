export default async function traverseSubcategories(
	this: any,
	node: {} | [],
	process: Function,
	root: string,
) {
	for (let key in node) {
		await process.apply(this, [
			node[key as keyof typeof node],
			`${root}/${key}`,
		]);
	}
}
