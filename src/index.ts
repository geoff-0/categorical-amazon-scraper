import { categories, productLimit } from "../cas.config";
import generateData from "./lib/generate-data.js";

(async () =>
	await generateData(
		categories,
		productLimit,
		"/home/geoday/code/projects/categorical-amazon-scraper/src",
	))();
