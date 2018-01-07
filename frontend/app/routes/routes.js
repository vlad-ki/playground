/* global angular */
'use strict'
angular.module('InvestX').config(function($routeProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: './components/login-component/login.html',
    })
    .when('/', {
      templateUrl: './home.html'
    })
    .when('/correlation', {
      templateUrl: 'templates/correlation/correlation.html',
      controller: 'correlationCtrl',
      controllerAs: 'corrCtrl'
    })
    .when('/three', {
      templateUrl: 'three.html'
    })
    .otherwise({ redirectTo: '/'})
})
