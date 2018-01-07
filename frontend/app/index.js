/* global angular */
'use strict';
require('./angular-fusioncharts.js')

angular.module('InvestX', [require('angular-route'),
                           require('angular-resource'),
                           'ng-fusioncharts']);

require('./dependensis');

/*
если делать import './dependensis', то в сбоке webpack
он поднимается до обьявления require
*/
