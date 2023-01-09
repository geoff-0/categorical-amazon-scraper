import config from "../cas.config.js";
import generateData from "./lib/data-generation/generate-data.js";

const { categories, productLimit } = config;

(async () =>
	await generateData(
		categories,
		productLimit,
		"/home/geoday/code/projects/categorical-amazon-scraper/src",
	))();
