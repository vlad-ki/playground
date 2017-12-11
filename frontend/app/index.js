(function() {
   'use strict';
	angular.module('InvestX', [])
		.controller('HeaderCtrl', HeaderCtrl)

	function HeaderCtrl($scope, $location) {
    this.name = 'PlayGround';
    const routes = {
       '/': 'home.html',
       '/2': 'two.html',
       '/3': 'three.html'
     }
    const defaultRoute = routes['/'];

    // $scope.$watch(function () {
    //   return $location.path();
    // }, function (newPath) {
    //     this.newPath = $location.path();
    //     this.currentUrl = routes[newPath] || defaultRoute;
    //  }.bind(this))

    $scope.$watch(() => {
      return $location.absUrl();
    }, (newPath) => {
      // this.currentUrl = routes[newPath] || defaultRoute;
      this.newPath = $location.path()
    });
	};
})()