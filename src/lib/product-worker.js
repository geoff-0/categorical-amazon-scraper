import getProduct from './get-product.js';
import { parentPort, workerData } from 'node:worker_threads';

const product = await getProduct(workerData);
parentPort.postMessage(product);
