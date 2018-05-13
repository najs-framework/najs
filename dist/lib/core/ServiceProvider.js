"use strict";
/// <reference path="../contracts/Application.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
class ServiceProvider {
    constructor(app) {
        this.app = app;
    }
    async register() { }
    async boot() { }
}
exports.ServiceProvider = ServiceProvider;
