"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamToString = exports.parseData = exports.getSmallestGrowthRateStock = exports.getBiggestGrowthRateStock = void 0;
const getBiggestGrowthRateStock = (parsedData) => {
    let maxGrowthRateStock = parsedData[0];
    parsedData.map((stock) => {
        if (stock.growthRate > maxGrowthRateStock.growthRate) {
            maxGrowthRateStock = stock;
        }
        if (stock.growthRate == maxGrowthRateStock.growthRate) {
            (stock.stockCode < maxGrowthRateStock.stockCode) && (maxGrowthRateStock = stock);
        }
    });
    return { code: maxGrowthRateStock.stockCode, growth: maxGrowthRateStock.growthRate };
};
exports.getBiggestGrowthRateStock = getBiggestGrowthRateStock;
const getSmallestGrowthRateStock = (parsedData) => {
    let minGrowthRateStock = parsedData[0];
    parsedData.forEach((stock) => {
        if (stock.growthRate < minGrowthRateStock.growthRate) {
            minGrowthRateStock = stock;
        }
        if (stock.growthRate == minGrowthRateStock.growthRate) {
            (stock.stockCode < minGrowthRateStock.stockCode) && (minGrowthRateStock = stock);
        }
    });
    return { code: minGrowthRateStock.stockCode, growth: minGrowthRateStock.growthRate };
};
exports.getSmallestGrowthRateStock = getSmallestGrowthRateStock;
const getGrowthRate = (last_price, previous_closed) => {
    return Number(((last_price - previous_closed) / previous_closed * 100).toFixed(2));
};
const parseData = (data) => {
    const stockRowsWithHeaders = data.split('\r\n');
    const stockRows = stockRowsWithHeaders.slice(1, stockRowsWithHeaders.length - 1);
    let parsedData = [];
    stockRows.forEach(element => {
        const row = element.split(',');
        let newStockRow = {
            stockCode: row[0],
            last_price: Number(row[1]),
            previous_closed: Number(row[2]),
            growthRate: getGrowthRate(Number(row[1]), Number(row[2]))
        };
        parsedData.push(newStockRow);
    });
    return parsedData;
};
exports.parseData = parseData;
function streamToString(stream) {
    var stream_1, stream_1_1;
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const chunks = [];
        try {
            for (stream_1 = __asyncValues(stream); stream_1_1 = yield stream_1.next(), !stream_1_1.done;) {
                const chunk = stream_1_1.value;
                chunks.push(Buffer.from(chunk));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (stream_1_1 && !stream_1_1.done && (_a = stream_1.return)) yield _a.call(stream_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return Buffer.concat(chunks).toString("utf-8");
    });
}
exports.streamToString = streamToString;
