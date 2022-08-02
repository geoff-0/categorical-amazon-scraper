import puppeteer from "puppeteer";
import UserAgent from "user-agents";

export default async function getAsins(category: string, limit: number) {
	const agent = new UserAgent({ deviceCategory: "desktop" }).toString();
	const browser = await puppeteer.launch({
		args: ["--window-size=1920,1080", agent],
	});

	const context = await browser.createIncognitoBrowserContext();

	const page = await context.newPage();

	const res = await page.goto(`https://amazon.com/s?k=${category}`, {
		waitUntil: "networkidle2",
	});

	await page.waitForSelector("body");

	const codes = await page.evaluate((limit) => {
		let results: string[] = [];
		const searchResults = document.body.querySelectorAll("div.s-result-item");

		for (let i = 0; i < limit; i++) {
			const asin: string = searchResults[i].getAttribute("data-asin") || "";

			if (!results.includes(asin) && asin[0]) results.push(asin);
		}

		return results;
	}, limit);

	await context.close();

	await browser.close();

	return codes;
}
