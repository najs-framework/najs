"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const LogFacade_1 = require("../../facades/global/LogFacade");
const supportedSettingKeys = [
    'chainable',
    'returnUndefined',
    'returnTrue',
    'returnFalse',
    'returnEmptyObject',
    'returnPromiseUndefined'
];
class MemberProxy {
    constructor(message, settings) {
        this.message = message;
        this.settings = settings;
        const members = [];
        for (const name in settings) {
            members.push(supportedSettingKeys.indexOf(name) === -1 ? [name] : this.settings[name]);
        }
        this.members = Array.from(new Set(lodash_1.flatten(members)));
        this.proxy = this.createProxy();
        return this.proxy;
    }
    getClassName() {
        return MemberProxy.className;
    }
    createProxy() {
        const proxy = new Proxy(this, {
            get(target, key) {
                const customReturns = {
                    chainable: target.proxy,
                    returnTrue: true,
                    returnFalse: false,
                    returnUndefined: undefined,
                    returnEmptyObject: {},
                    returnPromiseUndefined: Promise.resolve(undefined)
                };
                for (const name in customReturns) {
                    if (target.settings[name] && target.settings[name].indexOf(key) !== -1) {
                        return function () {
                            LogFacade_1.Log.warning(target.message.replace('{{key}}', key));
                            return customReturns[name];
                        };
                    }
                }
                return target.settings[key] || target[key];
            }
        });
        return proxy;
    }
}
MemberProxy.className = 'Najs.MemberProxy';
exports.MemberProxy = MemberProxy;
