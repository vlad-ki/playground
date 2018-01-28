/* global angular */
'use strict';

import pcorr from 'compute-pcorr';
import _ from 'lodash';

angular.module('InvestX')
    .controller('correlationCtrl', correlationCtrl);

function correlationCtrl($scope, $interval, binanceKlinesRes, binanseOllPricesRes) {
    let CHART, CHART_DATA, CHART_OPTIONS

    this.setSymbol = setSymbol;
    getAssetsData = getAssetsData.bind(this);
    calculateCorr = calculateCorr.bind(this);
    setClosePrices = setClosePrices.bind(this);
    setCorrObj = setCorrObj.bind(this);
    getChartData = getChartData.bind(this);
    drowGoogleChart = drowGoogleChart.bind(this);

    binanseOllPricesRes.query({}, (data) => {
        this.prices = data;
        google.charts.load('current', { 'packages': ['line'] });
        google.charts.setOnLoadCallback(getChartData);
    });

    function resize() {
        setTableHeight();
        if (!CHART_DATA) return;
        CHART_OPTIONS.height = getHeight();
        CHART.draw(CHART_DATA, google.charts.Line.convertOptions(CHART_OPTIONS))
        console.log('resize')
    }
    window.onload = resize;
    window.onresize = resize;

    function getChartData() {
        this.choosenAsset = this.prices[0];
        getAssetsData(this.choosenAsset)
            .then(drowGoogleChart)
    }

    function drowGoogleChart(klines) {
        CHART_DATA = new google.visualization.DataTable();
        CHART_DATA.addColumn('date', 'Day');
        CHART_DATA.addColumn('number', 'Prise ETH/BTC');
        this.choosenAsset.klines = klines;
        let rows = [];
        this.choosenAsset.klines.forEach(kline => {
            let date = new Date(kline[6]);
            rows.push([date, Number(kline[4])]);
        });
        CHART_DATA.addRows(rows)
        CHART_OPTIONS = {
            chart: {
                title: 'Table of prise',
                subtitle: '1 day interval'
            },
            vAxis: { format: 'decimal' },
            width: '100%',
            height: getHeight(),
        };
        CHART = new google.charts.Line(document.getElementById('chart'));
        CHART.draw(CHART_DATA, google.charts.Line.convertOptions(CHART_OPTIONS));
    }

    function getHeight() {
        const header = document.getElementsByTagName('header')[0];
        const footer = document.getElementsByTagName('footer')[0];
        const maxHeight = document.documentElement.clientHeight;
        const fullScreenHeight =  maxHeight - (header.clientHeight + footer.clientHeight);

        return fullScreenHeight + 'px';
    }

    function setTableHeight() {
        const assTable = document.getElementsByClassName('assets-table')[0];
        const header = document.getElementsByTagName('header')[0];
        const footer = document.getElementsByTagName('footer')[0];
        const maxHeight = document.documentElement.clientHeight;
        assTable.style.height = (maxHeight - (header.clientHeight + footer.clientHeight) + 'px');
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
