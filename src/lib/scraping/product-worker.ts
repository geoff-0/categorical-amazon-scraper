import { nanoid } from "nanoid";
import { launch, PageEmittedEvents } from "puppeteer";
import UserAgent from "user-agents";
import { getProductConfig } from "../types/get-product-config";

export default async function getProduct({ asin, page }: getProductConfig) {
	await page.setUserAgent(
		new UserAgent({ deviceCategory: "desktop" }).toString(),
	);

	await page.goto("https://amazon.com");

	const response = await page.goto(`https://amazon.com/dp/${asin}`, {
		waitUntil: "domcontentloaded",
	});

	await page.waitForSelector(
		'#productTitle, img#landingImage, span.a-offscreen, #productDescription, #feature-bullets, div[data-hook="review"], div[data-feature-name="productFactsDesktop"], #reviewsMedley',
	);

	// console.log(
	// 	`GET_PRODUCT ${response?.status()} https://amazon.com/dp/${asin}\n`,
	// );

	page.on("console", async (msg) => {
		const msgArgs = msg.args();
		for (let i = 0; i < msgArgs.length; ++i) {
			// console.log(await msgArgs[i].jsonValue());
		}
	});

	const product = await page.evaluate((id: string) => {
		const title: string = (
			(document.body.querySelector("#productTitle") as HTMLHeadingElement)
				.innerText || "A Product Title"
		)
			.replace("Amazon", "")
			.replace("amazon", "");

		console.log(`TITLE: ${title}`);

		const imageUrl = (document.body.querySelector(
			"img#landingImage",
		) as HTMLImageElement)
			? (
					document.body.querySelector(
						"img#landingImage",
					) as HTMLImageElement
			  ).src
			: "https://hbr.org/resources/images/article_assets/2019/11/Nov19_14_sb10067951dd-001.jpg";

		console.log(`IMAGE URL: ${imageUrl}`);

		const price =
			(document.body.querySelector("span.a-offscreen") as HTMLSpanElement)
				.innerText || "$69.99";

		console.log(`PRICE: ${price}`);

		let description = "Product description";

		if (document.body.querySelector("#productDescription")) {
			description =
				(
					document.body.querySelector(
						"#productDescription",
					) as HTMLElement
				)?.innerText || "".replace("Amazon", "").replace("amazon", "");
		} else if (document.body.querySelector("#feature-bullets")) {
			description = (
				(document.body.querySelector("#feature-bullets") as HTMLElement)
					.innerText || ""
			)
				.replace("Amazon", "")
				.replace("amazon", "");
		} else if (
			document.body.querySelector(
				'div[data-feature-name="productFactsDesktop"]',
			)
		) {
			description = (
				(
					document.body.querySelector(
						'div[data-feature-name="productFactsDesktop"]',
					) as HTMLElement
				).innerText || ""
			)
				.replace("Amazon", "")
				.replace("amazon", "");
		}

		console.log(`DESCRIPTION: ${description}`);

		const totalRatingsCount = document.body.querySelector(
			'[data-hook="total-review-count"]',
		)
			? (
					document.body.querySelector(
						'[data-hook="total-review-count"]',
					) as HTMLElement
			  ).innerText
			: "0";

		const averageStarRating = document.body.querySelector(
			'[data-hook="average-star-rating"]',
		)
			? `${
					(
						document.body.querySelector(
							'[data-hook="average-star-rating"]',
						) as HTMLElement
					).innerText
						.toString()
						.split(" out of ")[0]
			  }/5`
			: "No ratings";

		const reviews = Array.from(
			document.body.querySelectorAll('div[data-hook="review"]'),
		).map((profile) => {
			return {
				name: (
					(
						profile.querySelector(
							"span.a-profile-name",
						) as HTMLSpanElement
					).innerText || "Customer"
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
							(
								profile.querySelector(
									"i.a-icon.a-icon-star",
								) as HTMLElement
							).innerText || 4
						)
							.toString()
							.split(" ")[0],
					),
				)}/${Math.floor(
					Number(
						(
							(
								profile.querySelector(
									"i.a-icon.a-icon-star",
								) as HTMLElement
							).innerText || 5
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
			totalReviewCount: totalRatingsCount,
			averageStarRating: averageStarRating,
			reviews: reviews,
		};
	}, nanoid(6));

	await page.close();

	return product;
}

// const browser = await launch();

// const page = await browser.newPage();

// await getProduct({ asin: "B0BBFLCPYW", page: page });

// await browser.close();
