import puppeteer from 'puppeteer';

export default async function getAsins(category) {
	let codez;
	await puppeteer
		.launch({
			headless: true,
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--window-size=1920,1080',
				'--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
			],
		})
		.then(async (browser) => {
			const page = await browser.newPage();
			await page.goto(`https://amazon.com/s?k=${category}`);
			await page.waitForSelector('body');

			const codes = await page.evaluate(() => {
				let results = [];
				const searchResults =
					document.body.querySelectorAll('div.s-result-item');

				[...searchResults].map((_, i) => {
					if (
						!results.includes(searchResults[i]) &&
						searchResults[i].getAttribute('data-asin')[0]
					)
						return results.push(searchResults[i].getAttribute('data-asin'));
				});

				return results;
			});

			codez = codes;
		});

	return codez;
}

console.log(await getAsins('a'));
