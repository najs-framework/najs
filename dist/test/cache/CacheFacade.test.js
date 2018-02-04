"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const RedisCache_1 = require("../../lib/cache/RedisCache");
const constants_1 = require("./../../lib/constants");
const CacheFacade_1 = require("../../lib/cache/CacheFacade");
const register_1 = require("../../lib/core/register");
describe('Log', function () {
    it('implements ICache and registers to CacheClass by default', function () {
        expect(CacheFacade_1.CacheFacade).toBeInstanceOf(RedisCache_1.RedisCache);
    });
    it('.reload() can be used to reload the new instance of Cache after binding', function () {
        class Custom {
        }
        Custom.className = 'Custom';
        register_1.register(Custom, constants_1.CacheClass);
        expect(CacheFacade_1.CacheFacade).toBeInstanceOf(RedisCache_1.RedisCache);
        CacheFacade_1.reload();
        expect(CacheFacade_1.CacheFacade).toBeInstanceOf(Custom);
    });
});
