const helpers= require('../helpers');
const stocks=[
    {
        stockCode: 'VIC',
        last_price: 40000,
        previous_closed: 39000,
        growthRate: 2.56
    },
    {
        stockCode: 'VNG',
        last_price: 28000,
        previous_closed: 28500,
        growthRate: -1.75
    },
    {
        stockCode: 'AAA',
        last_price: 18000,
        previous_closed: 19000,
        growthRate: -5.26
    },
    {
        stockCode: 'BCG',
        last_price: 39000,
        previous_closed: 40000,
        growthRate: -2.5
    }
]

describe('Unit test', () => {
    it('Function getBiggestGrowthRateStock return right output', () => {
      expect(helpers.getBiggestGrowthRateStock(stocks)).toEqual({code: "VIC", growth: 2.56})
    })
    it('Function getSmallestGrowthRateStock return right output', () => {
        expect(helpers.getSmallestGrowthRateStock(stocks)).toEqual({code: "AAA", growth: -5.26})
      })
  })

