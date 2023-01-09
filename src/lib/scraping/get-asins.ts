import { launch } from "puppeteer";
import UserAgent from "user-agents";

export default async function getAsins(category: string, limit: number) {
	const agent = new UserAgent({ deviceCategory: "desktop" }).toString();

	const browser = await launch({
		args: [agent],
	});

	const page = await browser.newPage();

	await page.setUserAgent(agent);

	const res = await page.goto(`https://amazon.com/s?k=${category}`, {
		waitUntil: "domcontentloaded",
	});

	await page.waitForSelector("div.s-result-item", { timeout: 999999 });

	console.log("GET_ASIN", res?.status());

	const codes = await page.evaluate((limit: number) => {
		let results: string[] = [];

		const searchResults = document.body.querySelectorAll(
			'div[data-asin][data-component-type="s-search-result"]',
		);

		const l =
			searchResults.length - limit >= 0 ? limit : searchResults.length;

		for (let i = 0; i < l; i++) {
			const asin = searchResults[i].getAttribute("data-asin") ?? "";

			if (!results.includes(asin)) results.push(asin);
		}

		return results;
	}, limit);

	await browser.close();

	return codes;
}
