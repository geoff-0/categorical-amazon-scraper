import puppeteer from 'puppeteer';
import UserAgent from 'user-agents';

export default async function getAsins(category) {
	const agent = new UserAgent().toString();
	const browser = await puppeteer.launch({
		headless: true,
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--window-size=1920,1080',
			agent,
		],
	});

	const page = await browser.newPage();

	const res = await page.goto(`https://amazon.com/s?k=${category}`);
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

	await browser.close();

	console.log(codes.length);

	return codes;
}

await getAsins('among us doll');
