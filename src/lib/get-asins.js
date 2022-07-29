import puppeteer from 'puppeteer';
import UserAgent from 'user-agents';

export default async function getAsins(category) {
	const agent = new UserAgent({ deviceCategory: 'desktop' }).toString();
	const browser = await puppeteer.launch({
		args: ['--window-size=1920,1080', agent],
	});

	const context = await browser.createIncognitoBrowserContext();

	const page = await context.newPage();

	const res = await page.goto(`https://amazon.com/s?k=${category}`, {
		waitUntil: 'networkidle2',
	});

	console.log(res.headers());

	await page.waitForSelector('body');

	const codes = await page.evaluate(() => {
		let results = [];
		const searchResults = document.body.querySelectorAll('div.s-result-item');

		[...searchResults].map((_, i) => {
			if (
				!results.includes(searchResults[i]) &&
				searchResults[i].getAttribute('data-asin')[0]
			)
				return results.push(searchResults[i].getAttribute('data-asin'));
		});

		return results;
	});

	await context.close();

	await browser.close();

	return codes;
}
