/* global angular */
'use strict';

import pcorr from 'compute-pcorr';

angular.module('InvestX')
    .controller('correlationCtrl', correlationCtrl);

function correlationCtrl(binanceKlinesRes, binanseOllPricesRes) {
    // моки для теста графика
    this.attrs = {

        "caption": "Sales Comparison: 2013 versus 2014",
        "subCaption": 'Harry’s SuperMart',
        "numberprefix": "$",
        "plotgradientcolor": "",
        "bgcolor": "FFFFFF",
        "showalternatehgridcolor": "0",
        "divlinecolor": "CCCCCC",
        "showcanvasborder": "0",
        "canvasborderalpha": "0",
        "canvasbordercolor": "CCCCCC",
        "canvasborderthickness": "1",
        "yaxismaxvalue": "100",
        "captionpadding": "30",
        "linethickness": "3",
        "yaxisvaluespadding": "15",
        "legendshadow": "0",
        "legendborderalpha": "0",
        "palettecolors": "#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
        "showborder": "0",
        "base": "10",
        "numberprefix": "$",
        "drawCrossLine": "1",
        "crossLineAlpha": "100",
        "canvasPadding": "10",
        "divLineAlpha": "80"
    };

    this.categories = [{
        "category": [{
            "label": "1990"
        }, {
            "label": "1995"
        }, {
            "label": "2000"
        }, {
            "label": "2005"
        }, {
            "label": "2010"
        }]
    }];

    this.dataset = [{
            "seriesname": "Heating Oil",
            "anchorBgColor": "#876EA1",
            "data": [{
                "value": "25.2"
            }, {
                "value": "33.5"
            }, {
                "value": "42.3"
            }, {
                "value": "54.6"
            }, {
                "value": "62.8"
            }]
        }, {
            "seriesname": "Electricity",
            "anchorBgColor": "#72D7B2",
            "data": [{
                "value": "11.3"
            }, {
                "value": "14.4"
            }, {
                "value": "16.9"
            }, {
                "value": "18.4"
            }, {
                "value": "20.5"
            }]
        }, {
            "seriesname": "Natural Gas",
            "anchorBgColor": "#77BCE9",
            "data": [{
                "value": "3"
            }, {
                "value": "4.2"
            }, {
                "value": "5.8"
            }, {
                "value": "6.9"
            }, {
                "value": "8"
            }]
        }];

    this.chartOptions = {
        //
    }
    this.setSymbol = setSymbol;
    getAssetsData = getAssetsData.bind(this);
    getCorr = getCorr.bind(this);
    setClosePrices = setClosePrices.bind(this);

    binanseOllPricesRes.query({}, (data) => {
        this.prices = data
    });

    function getAssetsData(asset, interval) {
        interval = interval || '1M';
        binanceKlinesRes.query({ symbol: asset.symbol, interval: interval },
            (data) => {
                asset.klines = data;
                asset.corr = {};
                asset.corr.with = this.choosenAsset.symbol;
                asset.corr.closePrices = setClosePrices(asset);
                asset.corr.value = getCorr(asset);
            },
            function (err) {
                console.log('err', err)
            })
    }

    /*
    * Генерирует сортированный массив
    * Сопоставляя время закрытия цен
    */
    function setClosePrices(asset) {
        const closePrices = [];
        asset.klines.forEach(kline => {
            this.choosenAsset.klines.forEach(choosenAssetKline => {
                if (kline[6] === choosenAssetKline[6]) // close time;
                closePrices.push(Number(kline[4])) // close price;
            })
        })
        return closePrices;
    }

    function getCorr(asset) {
        if(asset.symbol === this.choosenAsset.symbol) {
            this.choosenAsset.corr.closePrices = asset.corr.closePrices;
        }
        // массивы должны быть одной длины
        let arrLength = getMinLength(this.choosenAsset.corr.closePrices,
            asset.corr.closePrices)
        asset.corr.value = pcorr(this.choosenAsset.corr.closePrices.slice(0, arrLength),
            asset.corr.closePrices.slice(0, arrLength))
        return asset.corr.value;
    }

    function getMinLength(firstArr, secondArr) {
        return firstArr.length < secondArr.length ?
               firstArr.length :
               secondArr.length;
    }

    function setSymbol(symbol) {
        this.choosenAsset = symbol;
        getAssetsData(this.choosenAsset)
        console.log('1 ', this.choosenAsset)
        this.prices.forEach(element => {
            getAssetsData(element);
        });
        console.log(this.prices)
    }


}