import getAsins from "./lib/get-asins.js";
import { categories } from "../cas.config.js";
import getProducts from "./lib/get-products.js";
import fs from "fs";

export default async function run(categories, path) {
	let dir = `${path}/product_data`;
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	for (let category of Object.keys(categories)) {
		try {
			if (!fs.existsSync(dir + `/${category}`)) {
				fs.mkdirSync(dir + `/${category}`);
			}
		} catch (err) {
			console.error(err);
		}

		for (let subcategory of Object.keys(categories)) {
			for (let subcategorySection of Object.keys(
				Object.values(categories[subcategory]),
			)) {
				if (Array.isArray(categories[subcategory][subcategorySection])) {
					const asinCodes = await getAsins(
						categories[subcategory][subcategorySection],
					);
					console.log(asinCodes);
					console.log(categories[subcategory][subcategorySection]);

					const products = await getProducts(asinCodes);

					fs.writeFile(
						`${dir}/${category}/${subcategory}/${subcategorySection}_product-data.json`,
						JSON.stringify(products),
						(err) => {
							if (err) console.log(err);
							else {
								console.log(
									`${dir}/${category}/${subcategory}/${subcategorySection}_product-data.json written successfully\n`,
								);
							}
						},
					);
				}
			}
		}
	}
}

await run(categories, "/home/geoday/code/projects/feigne/src/data");
