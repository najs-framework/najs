"use strict";
/// <reference path="../contracts/HttpDriver.ts" />
/// <reference path="../contracts/types/http.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const Application_1 = require("./Application");
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../constants");
const najs_facade_1 = require("najs-facade");
const SystemPath = require("path");
class NajsFramework extends najs_facade_1.FacadeContainer {
    constructor() {
        super();
        this.cwd = SystemPath.resolve(__dirname, '..', '..', '..', '..');
        this.internalEventEmitter = new events_1.EventEmitter();
        this.serviceProviders = [];
        this.app = new Application_1.Application();
    }
    workingDirectory(cwd) {
        this.cwd = cwd;
        return this;
    }
    classes(...args) {
        for (const path of args) {
            require(SystemPath.resolve(this.cwd, path));
        }
        return this;
    }
    providers(providers) {
        for (const name of providers) {
            const provider = this.resolveProvider(name);
            if (!provider) {
                continue;
            }
            this.serviceProviders.push(provider);
        }
        return this;
    }
    on(event, listener) {
        this.internalEventEmitter.on(event, listener);
        return this;
    }
    async start(options) {
        try {
            this.fireEventIfNeeded('start', this);
            await this.applyServiceProviders(true, 'registered');
            await this.applyServiceProviders(false, 'booted');
            this.httpDriver = this.app.make(constants_1.SystemClass.HttpDriver);
            this.httpDriver.start(options);
            this.fireEventIfNeeded('started', this);
        }
        catch (error) {
            this.handleError(error);
        }
    }
    handleError(error) {
        if (this.fireEventIfNeeded('crash', error)) {
            return;
        }
        if (this.fireEventIfNeeded('crashed', error)) {
            return;
        }
        throw error;
    }
    async applyServiceProviders(register, event) {
        for (const provider of this.serviceProviders) {
            await (register ? provider.register() : provider.boot());
            this.fireEventIfNeeded(event, this, provider);
        }
    }
    resolveProvider(provider) {
        if (typeof provider === 'string') {
            return najs_binding_1.make(provider, [this.app]);
        }
        return Reflect.construct(provider, [this.app]);
    }
    fireEventIfNeeded(event, ...args) {
        if (events_1.EventEmitter.listenerCount(this.internalEventEmitter, event) > 0) {
            this.internalEventEmitter.emit(event, ...args);
            return true;
        }
        return false;
    }
}
exports.Najs = new NajsFramework();
