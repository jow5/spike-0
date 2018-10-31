
global.chai = require("chai");
global.should = chai.should();
global.expect = chai.expect;
global.assert = chai.assert;
global.AssertionError = require("chai").AssertionError;

/*
global.sinon = require("sinon");

global.swallow = function (thrower) {
    try {
        thrower();
    } catch (e) { }
};

var sinonChai = require("sinon-chai");
chai.use(sinonChai);
*/

global.CONFIG = require('../config');
CONFIG.env = CONFIG.cloud9;

global.restify = require('restify');
global.mongoose = require('mongoose');
