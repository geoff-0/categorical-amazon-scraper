import { assignWorkers } from './lib/workers-handler.js';
import getAsins from './lib/get-asins.js';
import { categories } from '../cas.config.js';
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
			console.log(subcategory);
			if (Array.isArray(categories[subcategory])) {
				try {
					const asinCodes = await getAsins(subcategory);

					const productData = assignWorkers(asinCodes);

					console.log(productData);
				} catch (err) {
					return console.error(err);
				}
			}
		}
	}
}

await run(
	categories,
	'/home/geoday/code/projects/categorical-amazon-scraper/src',
);
