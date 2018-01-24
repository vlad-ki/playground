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

function assetsTableCtrl($scope, DragAndDrop) {
    this.setAsset = setAsset;
    this.$onInit = () => {
        DragAndDrop.init('assets-table__scroll', 'ul', '#chart', this.o);
        $scope.$watch(() => { return this.o},
            (newElement) => { console.log(this.o)});
    }

    function setAsset(asset) {
        this.symbol = asset.symbol;
        this.setSymbol({symbol: asset});
    }
}