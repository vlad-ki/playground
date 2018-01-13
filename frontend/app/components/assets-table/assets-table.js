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
    this.setAsset = setAsset;
    this.$onInit = () => {
        //
    }

    function setAsset(asset) {
        this.symbol = asset.symbol;
        this.setSymbol({symbol: asset});
    }
}