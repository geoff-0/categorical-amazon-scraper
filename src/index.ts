import config from "../cas.config.json";
import generateData from "./lib/generate-data.js";

(async () =>
	await generateData(
		config,
		"/home/geoday/code/projects/categorical-amazon-scraper/src",
	))();
