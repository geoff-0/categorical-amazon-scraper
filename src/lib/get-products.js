import puppeteer from 'puppeteer';
import { nanoid } from 'nanoid';
import getAsins from './get-asins.js';
import { Cluster } from 'puppeteer-cluster';

export default async function getProducts(asins) {
	var products = [];

	const cluster = await Cluster.launch({
		concurrency: Cluster.CONCURRENCY_CONTEXT,
		maxConcurrency: 3,
	});

	await cluster.task(async ({ page, data: url }) => {
		console.log('new scrape started');

		await page.goto(url, {
			waitUntil: 'networkidle2',
		});

		await page.waitForSelector('#productTitle');

		const product = Object.assign(
			{ id: nanoid() },
			page.evaluate(() => {
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

		console.log(`TITLE: ${product.title}`);
		products.push(product);
	});

	asins.map((asin) => cluster.queue(`https://amazon.com/dp/${asin}`));

	await cluster.idle();
	await cluster.close();

	return products;
}

await getProducts(await getAsins('among us doll'));
