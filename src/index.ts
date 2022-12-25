import config from "./cas.config";
import generateData from "./lib/data-generation/generate-data";

const { categories, productLimit } = config;

(async () =>
	await generateData(
		categories,
		productLimit,
		"/home/geoday/code/projects/categorical-amazon-scraper/src",
	))();
