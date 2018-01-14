/* global angular */
'use strict';

import pcorr from 'compute-pcorr';
import _ from 'lodash';

angular.module('InvestX')
    .controller('correlationCtrl', correlationCtrl);

function correlationCtrl(binanceKlinesRes, binanseOllPricesRes) {
    this.setSymbol = setSymbol;
    getAssetsData = getAssetsData.bind(this);
    calculateCorr = calculateCorr.bind(this);
    setClosePrices = setClosePrices.bind(this);
    setCorrObj = setCorrObj.bind(this);
    getChartData = getChartData.bind(this);
    getGoogleChartData = getGoogleChartData.bind(this);

    binanseOllPricesRes.query({}, (data) => {
        this.prices = data.slice(0, 10);
        google.charts.load('current', { 'packages': ['line'] });
        google.charts.setOnLoadCallback(getChartData);
    });

    function getChartData() {
        this.choosenAsset = this.prices[0];
        getAssetsData(this.choosenAsset)
            .then(getGoogleChartData)
    }

    function getGoogleChartData(klines) {
        let data = new google.visualization.DataTable();
        data.addColumn('date', 'Day');
        data.addColumn('number', 'Prise ETH/BTC');
        this.choosenAsset.klines = klines;
        let rows = [];
        this.choosenAsset.klines.forEach(kline => {
            let date = new Date(kline[6]);
            rows.push([date, Number(kline[4])]);
        });
        console.log(rows)
        data.addRows(rows)
        let options = {
            chart: {
                title: 'Table of prise',
                subtitle: '1 day interval'
            },
            vAxis: { format: 'decimal' },
            width: 900,
            height: 500,
        };

        let chart = new google.charts.Line(document.getElementById('chart'));
        chart.draw(data, google.charts.Line.convertOptions(options));
    }

    function getAssetsData(asset, interval='1d') {
        let symbol = asset.symbol
        if (typeof asset === 'string') {
            symbol = asset;
        }
        return binanceKlinesRes.query({symbol: symbol,
                                       interval: interval}).$promise;
    }

    /*
    * Генерирует сортированный массив
    * Сопоставляя время закрытия цен
    */
    function setClosePrices(asset) {
        asset.timeToPriceObj = {};
        this.choosenAsset.timeToPriceObj = {};

        this.choosenAsset.klines.forEach(kline => {
            this.choosenAsset.timeToPriceObj[kline[6]] = Number(kline[4]) // close time to close price;
        })
        asset.klines.forEach(kline => {
            asset.timeToPriceObj[kline[6]] = Number(kline[4]);
        })

        const bothTime = _.pick(asset.timeToPriceObj, Object.keys(this.choosenAsset.timeToPriceObj))
        const closePrices = Object.values(bothTime);
        return closePrices;
    }

    function calculateCorr(asset) {
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

    function setCorrObj(asset) {
        asset.corr = {};
        asset.corr.with = this.choosenAsset.symbol;
        asset.corr.closePrices = setClosePrices(asset);
        asset.corr.value = calculateCorr(asset);
    }

    function setSymbol(symbol) {
        this.choosenAsset = symbol;
        getAssetsData(this.choosenAsset)
            .then(data => {
                this.choosenAsset.klines = data;
                setCorrObj(this.choosenAsset);
                this.prices.forEach(asset => {
                    if (!asset.corr) {
                        getAssetsData(asset)
                            .then(data => {
                                asset.klines = data;
                                setCorrObj(asset)
                            });
                    } else {
                    setCorrObj(asset)
                    };
                });
            })
        console.log('1 ', this.choosenAsset)
        console.log(this.prices)
    }
}
