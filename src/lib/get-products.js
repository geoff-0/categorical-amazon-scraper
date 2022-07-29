import { nanoid } from 'nanoid';
import getAsins from './get-asins.js';
import { Cluster } from 'puppeteer-cluster';

export default async function getProducts(asins) {
	let products = [];

	const cluster = await Cluster.launch({
		concurrency: Cluster.CONCURRENCY_CONTEXT,
		maxConcurrency: 10,
	});

	await cluster.task(async ({ page, data }) => {
		const response = await page.goto(`https://amazon.com/dp/${data.asin}`);
		// const headers = response.headers();
		// console.log(headers);

		await page.waitForSelector('#productTitle');

		const product = Object.assign(
			{ id: nanoid() },
			await page.evaluate(() => {
				const title = document.body
					.querySelector('#productTitle')
					.innerText.replace('Amazon', '')
					.replace('amazon', '');

				const imageUrl = document.body.querySelector('img#landingImage').src;

				const price = document.body.querySelector('span.a-offscreen').innerText;

				const description = document.body.querySelector('#productDescription')
					? document.body
							.querySelector('#productDescription')
							.innerText.replace('Amazon', '')
							.replace('amazon', '')
					: document.body
							.querySelector('#feature-bullets')
							.innerText.replace('Amazon', '')
							.replace('amazon', '');

				const reviews = [
					...document.body.querySelectorAll('div[data-hook="review"]'),
				].map((profile) => {
					return {
						name: profile
							.querySelector('span.a-profile-name')
							.innerText.replace('Amazon', '')
							.replace('amazon', ''),
						pictureUrl: profile.querySelector('.a-profile-avatar > img').src,
						rating: `${Math.floor(
							profile
								.querySelector('i.a-icon.a-icon-star')
								.innerText.split(' ')[0],
						)}/${
							profile
								.querySelector('i.a-icon.a-icon-star')
								.innerText.split(' ')[3]
						}`,
						reviewTitle: profile
							.querySelector('[data-hook="review-title"]')
							.innerText.replace('Amazon', '')
							.replace('amazon', ''),
						review: profile
							.querySelector('div[data-hook="review-collapsed"]')
							.innerText.replace('Amazon', '')
							.replace('amazon', ''),
					};
				});

				return {
					title: title,
					imageUrl: imageUrl,
					price: price,
					description: description,
					reviews: reviews,
				};
			}),
		);

		console.log(`ASIN: ${data.asin}`);
		console.log(`TITLE: ${product.title}\n`);
		products.push(product);
	});

	for (let asin of asins) cluster.queue({ asin: asin });

	await cluster.idle();
	await cluster.close();

	return products;
}
