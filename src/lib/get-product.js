import puppeteer from 'puppeteer';
import { nanoid } from 'nanoid';

export default async function getProduct(asin) {
	const browser = await puppeteer.launch({
		headless: true,
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--window-size=1920,1080',
			'--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
		],
	});

	const page = await browser.newPage();
	await page.goto(`https://www.amazon.com/dp/${asin}`);
	await page.waitForSelector('#productTitle');

	const product = Object.assign(
		{ id: nanoid() },
		await page.evaluate(() => {
			return {
				title: document.body
					.querySelector('span#productTitle')
					.innerText.replace('Amazon', '')
					.replace('amazon', ''),
				imageUrl: document.body.querySelector('img#landingImage').src,
				price: document.body.querySelector('span.a-offscreen').innerText,

				description:
					document.body.querySelector('#productDescription').innerText ??
					document.body.querySelector('#feature-bullets').innerText,

				reviews: [
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
								.querySelector('i[data-hook="review-star-rating"]')
								.innerText.split(' ')[0],
						)}/${
							profile
								.querySelector('i[data-hook="review-star-rating"]')
								.innerText.split(' ')[3]
						}`,

						reviewTitle: profile
							.querySelector('a[data-hook="review-title"]')
							.innerText.replace('Amazon', '')
							.replace('amazon', ''),
						review: profile
							.querySelector('div[data-hook="review-collapsed"]')
							.innerText.replace('Amazon', '')
							.replace('amazon', ''),
					};
				}),
			};
		}),
	);

	await browser.close();

	return product;
}
