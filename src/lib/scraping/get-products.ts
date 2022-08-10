import { nanoid } from "nanoid";
import { Page } from "puppeteer";
import { Cluster } from "puppeteer-cluster";

export default async function getProducts(asins: string[]) {
	const cluster = await Cluster.launch({
		concurrency: Cluster.CONCURRENCY_CONTEXT,
		maxConcurrency: 35,
	});

	const getProduct = async (args: {
		page: Page;
		data: { asin: String; products: {}[] };
	}) => {
		const { page, data } = args;

		const response = await page.goto(`https://amazon.com/dp/${data.asin}`, {
			waitUntil: "networkidle2",
		});

		console.log("GET_PRODUCT", response?.status());

		await page.waitForSelector("#productTitle");

		const product = await page.evaluate((id) => {
			const title: string = (
				(document.body.querySelector("#productTitle") as HTMLHeadingElement)
					.innerText || "A Product Title"
			)
				.replace("Amazon", "")
				.replace("amazon", "");

			const imageUrl =
				(document.body.querySelector("img#landingImage") as HTMLImageElement)
					.src ||
				"https://hbr.org/resources/images/article_assets/2019/11/Nov19_14_sb10067951dd-001.jpg";

			const price =
				(document.body.querySelector("span.a-offscreen") as HTMLSpanElement)
					.innerText || "$69.99";

			const description = document.body.querySelector("#productDescription")
				? (
						(document.body.querySelector("#productDescription") as HTMLElement)
							?.innerText || ""
				  )
						.replace("Amazon", "")
						.replace("amazon", "")
				: (
						(document.body.querySelector("#feature-bullets") as HTMLElement)
							.innerText || ""
				  )
						.replace("Amazon", "")
						.replace("amazon", "");

			const reviews = Array.from(
				document.body.querySelectorAll('div[data-hook="review"]'),
			).map((profile) => {
				return {
					name: (
						(profile.querySelector("span.a-profile-name") as HTMLSpanElement)
							.innerText || "Customer"
					)
						.replace("Amazon", "")
						.replace("amazon", ""),

					pictureUrl:
						(
							profile.querySelector(
								".a-profile-avatar > img",
							) as HTMLImageElement
						).src ||
						"https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/Inexperienced42/phpRwn5UJ.png",

					rating: `${Math.floor(
						Number(
							(
								(profile.querySelector("i.a-icon.a-icon-star") as HTMLElement)
									.innerText || 4
							)
								.toString()
								.split(" ")[0],
						),
					)}/${Math.floor(
						Number(
							(
								(profile.querySelector("i.a-icon.a-icon-star") as HTMLElement)
									.innerText || 5
							)
								.toString()
								.split(" ")[3],
						),
					)}`,

					reviewTitle: (
						(
							profile.querySelector(
								'[data-hook="review-title"]',
							) as HTMLLinkElement
						).innerText || "Decent product, you get what you pay for."
					)
						.replace("Amazon", "")
						.replace("amazon", ""),

					review: (
						(
							profile.querySelector(
								'div[data-hook="review-collapsed"]',
							) as HTMLLinkElement
						).innerText ||
						"I received this product with a timely delivery and it isn't the best, but it definitely does the job. I would buy it again."
					)
						.replace("Amazon", "")
						.replace("amazon", ""),
				};
			});

			return {
				id: id,
				title: title,
				imageUrl: imageUrl,
				price: price,
				description: description,
				reviews: reviews,
			};
		}, nanoid(6));

		console.log(`ASIN: ${data.asin}`);
		console.log(`TITLE: ${product.title}\n`);
		data.products.push(product);
	};

	const products: Object[] = [];

	for (const asin of asins)
		cluster.queue({ asin: asin, products: products }, getProduct);

	await cluster.idle();
	await cluster.close();

	return products;
}
