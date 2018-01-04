/* global angular */
'use strict'
angular.module('InvestX').controller('HeaderCtrl', HeaderCtrl);

function HeaderCtrl($scope, $location) {
  this.name = 'PlayGround';
  const routes = {
    '/': 'home.html',
    '/two': 'two.html',
    '/three': 'three.html'
  }
  const defaultRoute = routes['/'];

  // $scope.$watch(function () {
  //   return $location.path();
  // }, function (newPath) {
  //     this.newPath = $location.path();
  //     this.currentUrl = routes[newPath] || defaultRoute;
  //  }.bind(this))

  $scope.$watch(() => {
    return $location.path();
  }, (newPath) => {
    console.log(newPath);
  });

  function isSelected(page) {
    // pass
  }
};
