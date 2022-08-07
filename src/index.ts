import { categories } from "../cas.config.js";
import generateData from "./lib/generate-data.js";

(async () =>
	await generateData(
		categories,
		"/home/geoday/code/projects/categorical-amazon-scraper/src",
	))();
