import { launch, PageEmittedEvents } from "puppeteer";
import UserAgent from "user-agents";

export default async function getAsins(category: string, limit: number) {
	const agent = new UserAgent({ deviceCategory: "desktop" }).toString();

	const browser = await launch({
		args: [agent],
	});

	const page = await browser.newPage();

	await page.setUserAgent(agent);

	await page.goto("https://amazon.com");

	setTimeout(() => {}, 2000);

	const res = await page.goto(
		`https://amazon.com/s?k=${category}?ref=nb_sb_noss_1`,
		{
			waitUntil: "domcontentloaded",
		},
	);

	await page.waitForSelector(
		'div.s-result-item, div[data-component-type="s-search-result"]',
	);

	console.log(`GET_ASIN ${res?.status()}\n`);

	page.on("console", async (msg) => {
		const msgArgs = msg.args();
		for (let i = 0; i < msgArgs.length; ++i) {
			console.log(await msgArgs[i].jsonValue());
		}
	});

	const extractResults = function (limit: number) {
		let results: string[] = [];

		const searchResults = document.body.querySelectorAll(
			'div[data-asin][data-component-type="s-search-result"]',
		);

		const l =
			searchResults.length - limit >= 0 ? limit : searchResults.length;

		for (let i = 0; i < limit; i++) {
			const asin = (
				searchResults[i]
					? searchResults[i].getAttribute("data-asin")
					: "B092ZYNWN6"
			) as string;

			if (!results.includes(asin)) results.push(asin);
		}

		return results;
	};

	async function scrapeResults() {
		let results: string[] = [];

		let previousHeight;

		results = await page.evaluate(extractResults, limit);

		previousHeight = await page.evaluate("document.body.scrollHeight");

		await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");

		await page.waitForFunction(
			`document.body.scrollHeight > ${previousHeight}`,
		);

		setTimeout(() => {}, 800);

		return results;
	}

	const codes: string[] = await scrapeResults();

	await browser.close();

	return codes;
}
