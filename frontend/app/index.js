/* global angular */
'use strict';
angular.module('InvestX', [require('angular-route')]);
require('./dependensis');

/*
если делать import './dependensis', то в сбоке webpack
он поднимается до обьявления require
*/
