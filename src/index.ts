import path from "path";
import config from "../cas.config.js";
import generateData from "./lib/data-generation/generate-data.js";

const { categories, productLimit } = config;

(async () =>
	await generateData(categories, productLimit, path.dirname("./")))();
