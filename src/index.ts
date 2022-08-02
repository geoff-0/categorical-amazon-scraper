import { categories } from "../cas.config.js";
import generateData from "./lib/generate-data.js";

let dict = {
	clothing: {
		men: {
			jackets: "Men's jackets",
			shirts: "Men's Shirts",
			pants: "Men's Pants",
		},
		women: {
			jackets: "Women's jackets",
			shirts: "Women's Shirts",
			pants: "Women's Pants",
		},
	},
};
(async () =>
	await generateData(
		dict,
		"/home/geoday/code/projects/categorical-amazon-scraper/src",
	))();
