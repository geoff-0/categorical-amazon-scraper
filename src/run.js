import getAsins from "./lib/get-asins.js";
import { categories } from "../cas.config.js";
import getProducts from "./lib/get-products.js";
import fs from "fs";

export default async function run(categories, path) {
	const generateFromArray = async (subcategory) => {
		for (let category of subcategory) {
			const asinCodes = await getAsins(category);
			const data = await getProducts(asinCodes);

			fs.writeFile(
				`${dir}/${subcategory[0]}/${category.replace(
					/\s/g,
					"",
				)}_product-data.json`,

				JSON.stringify(data),

				(err) => {
					if (err) console.log(err);
					else {
						console.log(
							`${dir}/${subcategory[0]}/${category.replace(
								/\s/g,
								"",
							)}_product-data.json written successfully\n`,
						);
					}
				},
			);
		}
	};

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
	}

	for (let subcategory of Object.entries(categories)) {
		if (Array.isArray(subcategory[1])) {
			generateFromArray(subcategory[1]);
		} else if (
			typeof subcategory[1] === "object" &&
			typeof subcategory[1] !== null
		) {
		}
	}
}

await run(categories, "/home/geoday/code/projects/feigne/src/data");
