/* gloval angular */
'use strict';

import '../../modules/drag-and-drop.js'

angular.module('InvestX')
    .component('assetsTable', {
        bindings: {
            setSymbol: '&',
            prices: '<'
        },
        templateUrl: './components/assets-table/assets-table.html',
        controller: assetsTableCtrl
    })

function assetsTableCtrl(DragAndDrop) {
    this.setAsset = setAsset;
    this.$onInit = () => {
        DragAndDrop();
    }

    function setAsset(asset) {
        this.symbol = asset.symbol;
        this.setSymbol({symbol: asset});
    }
}