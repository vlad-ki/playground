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
    .when('/two', {
      templateUrl: 'two.html'
    })
    .when('/three', {
      templateUrl: 'three.html'
    })
    .otherwise({ redirectTo: '/'})
})
