/* gloval angular */
'use strict';

angular.module('InvestX')
    .component('assetsTable', {
        bindings: {
            setSymbol: '&',
            prices: '<'
        },
        templateUrl: './components/assets-table/assets-table.html',
        controller: assetsTableCtrl
    })

function assetsTableCtrl() {
    let symbol;
    this.setAsset = setAsset;
    this.$onInit = () => {
        //
    }

    function setAsset(asset) {
        this.setSymbol({symbol: asset});
    }

    function calculate() {

    }
}