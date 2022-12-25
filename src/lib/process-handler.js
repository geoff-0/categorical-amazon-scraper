var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { existsSync, mkdirSync, writeFileSync } from "fs";
import getAsins from "./scraping/get-asins.js";
import getProducts from "./scraping/get-products.js";
import { productLimit } from "cas.config.js";
import traverseSubcategories from "./traverse-subcategories.js";
export default function handleProcess(node, root) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, node_1, category, asinCodes, products;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(typeof (node !== null) &&
                        typeof (node === "object") &&
                        !Array.isArray(node))) return [3 /*break*/, 2];
                    console.log("object category of node: ".concat(Object.keys(node)));
                    if (!existsSync(root))
                        mkdirSync(root);
                    return [4 /*yield*/, traverseSubcategories(node, handleProcess, root)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 2:
                    if (!(typeof (node !== null) &&
                        typeof (node === "array") &&
                        Array.isArray(node))) return [3 /*break*/, 7];
                    if (!existsSync(root))
                        mkdirSync(root);
                    _i = 0, node_1 = node;
                    _a.label = 3;
                case 3:
                    if (!(_i < node_1.length)) return [3 /*break*/, 7];
                    category = node_1[_i];
                    console.log("array category of node: ".concat(category));
                    return [4 /*yield*/, getAsins(category, productLimit)];
                case 4:
                    asinCodes = _a.sent();
                    return [4 /*yield*/, getProducts(asinCodes)];
                case 5:
                    products = _a.sent();
                    writeFileSync("".concat(root, "/").concat(category
                        .replace(/\s+/g, "-")
                        .replace("'", ""), "_Product-Data.json"), JSON.stringify(products));
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 3];
                case 7: return [2 /*return*/];
            }
        });
    });
}
