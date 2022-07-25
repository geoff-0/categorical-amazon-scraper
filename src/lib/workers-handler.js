import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import getProduct from './get-product.js';

export function assignWorkers(asinCodes) {
	const threads = [];
	let productData = [];

	console.log(asinCodes);

	for (let asin of asinCodes) {
		threads.add(
			new Worker('./src/lib/product-worker.js', {
				workerData: { asin: asin },
			}),
		);
	}

	console.log(`Running with ${threads.length} threads...`);

	for (let worker of threads) {
		worker.on('error', (err) => {
			throw err;
		});

		worker.on('exit', () => {
			threads.splice(threads.indexOf(worker), 1);
			console.log(`Thread exiting, ${threads.length} running...`);

			if (threads.length === 0) {
				console.log(productData);
			}
		});

		worker.on('message', (msg) => {
			productData.push(msg);
		});
	}
}
