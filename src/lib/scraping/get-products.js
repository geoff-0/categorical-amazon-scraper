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
        while (_) try {
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
import { nanoid } from "nanoid";
import { Cluster } from "puppeteer-cluster";
import getAsins from "./get-asins.js";
export default function getProducts(asins) {
    return __awaiter(this, void 0, void 0, function () {
        var cluster, getProduct, products, _i, asins_1, asin;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Cluster.launch({
                        concurrency: Cluster.CONCURRENCY_CONTEXT,
                        maxConcurrency: 5,
                    })];
                case 1:
                    cluster = _a.sent();
                    getProduct = function (args) { return __awaiter(_this, void 0, void 0, function () {
                        var page, data, response, product;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    page = args.page, data = args.data;
                                    return [4 /*yield*/, page.goto("https://amazon.com/dp/".concat(data.asin), {
                                            waitUntil: "networkidle2",
                                        })];
                                case 1:
                                    response = _a.sent();
                                    return [4 /*yield*/, page.waitForSelector("#productTitle", { timeout: 30000 })];
                                case 2:
                                    _a.sent();
                                    console.log("GET_PRODUCT", response === null || response === void 0 ? void 0 : response.status());
                                    return [4 /*yield*/, page.evaluate(function (id) {
                                            var _a;
                                            var title = (document.body.querySelector("#productTitle")
                                                .innerText || "A Product Title")
                                                .replace("Amazon", "")
                                                .replace("amazon", "");
                                            var imageUrl = document.body.querySelector("img#landingImage")
                                                .src ||
                                                "https://hbr.org/resources/images/article_assets/2019/11/Nov19_14_sb10067951dd-001.jpg";
                                            var price = document.body.querySelector("span.a-offscreen")
                                                .innerText || "$69.99";
                                            var description = document.body.querySelector("#productDescription")
                                                ? (((_a = document.body.querySelector("#productDescription")) === null || _a === void 0 ? void 0 : _a.innerText) || "")
                                                    .replace("Amazon", "")
                                                    .replace("amazon", "")
                                                : (document.body.querySelector("#feature-bullets")
                                                    .innerText || "")
                                                    .replace("Amazon", "")
                                                    .replace("amazon", "");
                                            var reviews = Array.from(document.body.querySelectorAll('div[data-hook="review"]')).map(function (profile) {
                                                return {
                                                    name: (profile.querySelector("span.a-profile-name")
                                                        .innerText || "Customer")
                                                        .replace("Amazon", "")
                                                        .replace("amazon", ""),
                                                    pictureUrl: profile.querySelector(".a-profile-avatar > img").src ||
                                                        "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/Inexperienced42/phpRwn5UJ.png",
                                                    rating: "".concat(Math.floor(Number((profile.querySelector("i.a-icon.a-icon-star")
                                                        .innerText || 4)
                                                        .toString()
                                                        .split(" ")[0])), "/").concat(Math.floor(Number((profile.querySelector("i.a-icon.a-icon-star")
                                                        .innerText || 5)
                                                        .toString()
                                                        .split(" ")[3]))),
                                                    reviewTitle: (profile.querySelector('[data-hook="review-title"]').innerText || "Decent product, you get what you pay for.")
                                                        .replace("Amazon", "")
                                                        .replace("amazon", ""),
                                                    review: (profile.querySelector('div[data-hook="review-collapsed"]').innerText ||
                                                        "I received this product with a timely delivery and it isn't the best, but it definitely does the job. I would buy it again.")
                                                        .replace("Amazon", "")
                                                        .replace("amazon", ""),
                                                };
                                            });
                                            return {
                                                id: id,
                                                title: title,
                                                imageUrl: imageUrl,
                                                price: price,
                                                description: description,
                                                reviews: reviews,
                                            };
                                        }, nanoid(6))];
                                case 3:
                                    product = _a.sent();
                                    return [2 /*return*/, data.products.push(product)];
                            }
                        });
                    }); };
                    products = [];
                    for (_i = 0, asins_1 = asins; _i < asins_1.length; _i++) {
                        asin = asins_1[_i];
                        cluster.queue({ asin: asin, products: products }, getProduct);
                    }
                    return [4 /*yield*/, cluster.idle()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, cluster.close()];
                case 3:
                    _a.sent();
                    return [2 /*return*/, "PRODUCTS ARRAY LENGTH ".concat(products.length)];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b, _c; return __generator(this, function (_d) {
    switch (_d.label) {
        case 0:
            _b = (_a = console).log;
            _c = getProducts;
            return [4 /*yield*/, getAsins("vitamins", 15)];
        case 1: return [4 /*yield*/, _c.apply(void 0, [_d.sent()])];
        case 2: return [2 /*return*/, _b.apply(_a, [_d.sent()])];
    }
}); }); })();
