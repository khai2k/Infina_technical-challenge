interface Stock {
    stockCode: string,
    last_price: number,
    previous_closed: number,
    growthRate: number
}
interface ResponseGrowthRateStock {
    code: string,
    growth: number
}

const getBiggestGrowthRateStock = (parsedData:Stock[]):ResponseGrowthRateStock => {
    let maxGrowthRateStock = parsedData[0];
    parsedData.map((stock:Stock) => {
        if (stock.growthRate > maxGrowthRateStock.growthRate) {
            maxGrowthRateStock = stock;
        }
        if (stock.growthRate == maxGrowthRateStock.growthRate) {
            (stock.stockCode < maxGrowthRateStock.stockCode) && (maxGrowthRateStock = stock)
        }
    })
    
    return {code:maxGrowthRateStock.stockCode,growth:maxGrowthRateStock.growthRate}
}

const getSmallestGrowthRateStock = (parsedData:Stock[]):ResponseGrowthRateStock => {
    let minGrowthRateStock = parsedData[0];
    parsedData.forEach((stock:Stock) => {
        if (stock.growthRate < minGrowthRateStock.growthRate) {
            minGrowthRateStock = stock;
        }
        if (stock.growthRate == minGrowthRateStock.growthRate) {
            (stock.stockCode < minGrowthRateStock.stockCode) && (minGrowthRateStock = stock)
        }
    })
    
    return {code:minGrowthRateStock.stockCode,growth:minGrowthRateStock.growthRate}
}

const getGrowthRate = (last_price:number,previous_closed:number):number=>{
    return Number(((last_price - previous_closed) / previous_closed * 100).toFixed(2));
}

const parseData = (data:string):Stock[] => {
    const stockRowsWithHeaders = data.split('\r\n');
    const stockRows = stockRowsWithHeaders.slice(1,stockRowsWithHeaders.length-1);
    let parsedData:Stock[]=[];
    stockRows.forEach(element => {
        const row = element.split(',');
        let newStockRow:Stock = {
            stockCode: row[0],
            last_price: Number(row[1]),
            previous_closed: Number(row[2]),
            growthRate: getGrowthRate(Number(row[1]),Number(row[2]))
        }
        parsedData.push(newStockRow);
    });

    return parsedData;
}

async function streamToString(stream:any) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString("utf-8");
}
export { getBiggestGrowthRateStock, getSmallestGrowthRateStock, parseData,streamToString}