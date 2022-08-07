import puppeteer from "puppeteer";
import UserAgent from "user-agents";

export default async function getAsins(category: string, limit: number) {
	const agent = new UserAgent({ deviceCategory: "desktop" }).toString();

	const browser = await puppeteer.launch({
		args: ["--window-size=1920,1080", agent, "--incognito"],
	});

	const page = await browser.newPage();

	const res = await page.goto(
		`https://amazon.com/s?k=${category.replaceAll(" ", "+")}`,
		{
			waitUntil: "networkidle2",
		},
	);

	console.log("GET_ASIN", res?.status());

	await page.waitForSelector("body");

	const codes = await page.evaluate((limit) => {
		let results: string[] = [];

		const searchResults = document.body.querySelectorAll("div.s-result-item");

		const l = searchResults.length - limit >= 0 ? limit : searchResults.length;

		for (let i = 0; i < l; i++) {
			const asin: string =
				searchResults[i].getAttribute("data-asin") || "B08R25S1Q5";

			if (!results.includes(asin)) results.push(asin);
		}

		return results;
	}, limit);

	console.log(codes);

	await browser.close();

	return codes;
}
