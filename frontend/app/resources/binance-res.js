/* global angular */
'use strict'
angular.module('InvestX')
.factory('binanceKlinesRes', ($resource) => {
    return $resource(
        '/api/v1/klines',
        {
            symbol: '@symbol',
            interval: '@interval'
        }
    )
})

.factory('binanseOllPricesRes', ($resource) => {
    return $resource(
        '/api/v1/ticker/allPrices'
    )
})
