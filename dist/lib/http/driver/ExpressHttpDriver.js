"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var index_1 = require("../../index");
var Express = require("express");
var ExpressHttpDriver = /** @class */ (function () {
    function ExpressHttpDriver() {
    }
    ExpressHttpDriver_1 = ExpressHttpDriver;
    ExpressHttpDriver.prototype.getClassName = function () {
        return 'ExpressHttpDriver';
    };
    ExpressHttpDriver.prototype.getDriverName = function () {
        return ExpressHttpDriver_1.driverName;
    };
    ExpressHttpDriver.prototype.initialize = function () {
        this.express = lodash_1.isFunction(this.setupFunction) ? this.setupFunction() : this.defaultInitialize();
        if (lodash_1.isFunction(this.didSetupHandler)) {
            this.didSetupHandler(this.express);
        }
    };
    ExpressHttpDriver.prototype.defaultInitialize = function () {
        var app = Express();
        return app;
    };
    ExpressHttpDriver.prototype.setup = function (setupFunction) {
        this.setupFunction = setupFunction;
        return this;
    };
    ExpressHttpDriver.prototype.driverDidSetup = function (handler) {
        this.didSetupHandler = handler;
        return this;
    };
    // -------------------------------------------------------------------------------------------------------------------
    ExpressHttpDriver.prototype.route = function (route) { };
    ExpressHttpDriver.prototype.start = function (options) { };
    ExpressHttpDriver.prototype.respondJson = function (response, value) {
        response.json(value);
    };
    ExpressHttpDriver.prototype.respondRedirect = function (response, url, status) {
        response.redirect(status, url);
    };
    ExpressHttpDriver.driverName = 'express';
    ExpressHttpDriver = ExpressHttpDriver_1 = __decorate([
        index_1.register()
    ], ExpressHttpDriver);
    return ExpressHttpDriver;
    var ExpressHttpDriver_1;
}());
exports.ExpressHttpDriver = ExpressHttpDriver;
//# sourceMappingURL=ExpressHttpDriver.js.map