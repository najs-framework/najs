"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServiceProvider {
    constructor(app, setFacadeRoot) {
        this.app = app;
        this.setFacadeRoot = setFacadeRoot;
    }
    async register() { }
    async boot() { }
}
exports.ServiceProvider = ServiceProvider;
