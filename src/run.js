import getAsins from './lib/get-asins.js';
import { categories } from '../cas.config.js';
import getProducts from './lib/get-products.js';
import fs from 'fs';

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
			if (Array.isArray(categories[subcategory])) {
				const asinCodes = await getAsins(subcategory);
				console.log(asinCodes);

				const products = await getProducts(asinCodes);

				await products;

				await fs.writeFile(
					`${dir}/${category}/${subcategory}_product-data.json`,
					JSON.stringify(products),
					(err) => {
						if (err) console.log(err);
						else {
							console.log('File written successfully\n');
							console.log('The written has the following contents:');
							console.log(
								fs.readFileSync(
									`${dir}/${category}/${subcategory}_product-data.json`,
									'utf8',
								),
							);
						}
					},
				);
			}
		}
	}
}

await run(
	categories,
	'/home/geoday/code/projects/categorical-amazon-scraper/src',
);
