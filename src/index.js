import { assignWorker } from './lib/workers-handler.js';
import getAsins from './lib/get-asins.js';
import { categories } from '../cas.config.js';
import fs from 'fs';

export default async function run(categories, path) {
	for (let category of Object.keys(categories)) {
		let dir = `${path}/product_data`;
		try {
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}

			if (!fs.existsSync(dir + `/${category}`)) {
				fs.mkdirSync(dir + `/${category}`);
			}
		} catch (err) {
			console.error(err);
		}

		for (let subcategory of Object.values(categories)) {
			if (Array.isArray(subcategory)) {
				try {
					const asinCodes = await getAsins(subcategory);
					console.log(asinCodes);
					const productData = [];

					for (let asin of asinCodes) {
						const worker = await assignWorker(asin);
						console.log(worker);
						productData.push(worker);
					}

					console.log(productData);

					fs.writeFileSync(
						`${dir}/${category}/${subcategory
							.replace(/\s/g, '')
							.replace("'", '')}_ProductData.json`,
						JSON.stringify(productData),
					);
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
