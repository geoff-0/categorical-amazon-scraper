import getProduct from './get-product.js';
import { parentPort, workerData } from 'node:worker_threads';

console.log(workerData);
const product = await getProduct(workerData.asin);
parentPort.postMessage(product);
