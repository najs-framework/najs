"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const index_1 = require("../../index");
const Express = require("express");
let ExpressHttpDriver = ExpressHttpDriver_1 = class ExpressHttpDriver {
    getClassName() {
        return 'ExpressHttpDriver';
    }
    getDriverName() {
        return ExpressHttpDriver_1.driverName;
    }
    getNativeDriver() {
        return this.express;
    }
    initialize() {
        this.express = lodash_1.isFunction(this.setupFunction) ? this.setupFunction() : this.defaultInitialize();
        if (lodash_1.isFunction(this.didSetupHandler)) {
            this.didSetupHandler(this.express);
        }
    }
    defaultInitialize() {
        const app = Express();
        return app;
    }
    setup(setupFunction) {
        this.setupFunction = setupFunction;
        return this;
    }
    driverDidSetup(handler) {
        this.didSetupHandler = handler;
        return this;
    }
    // -------------------------------------------------------------------------------------------------------------------
    route(route) { }
    start(options) { }
    respondJson(response, value) {
        response.json(value);
    }
    respondRedirect(response, url, status) {
        response.redirect(status, url);
    }
};
ExpressHttpDriver.driverName = 'express';
ExpressHttpDriver = ExpressHttpDriver_1 = __decorate([
    index_1.register()
], ExpressHttpDriver);
exports.ExpressHttpDriver = ExpressHttpDriver;
var ExpressHttpDriver_1;
