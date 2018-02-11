"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const lib_1 = require("../../lib");
const isPromise_1 = require("../../lib/private/isPromise");
describe('ServiceProvider', function () {
    describe('.register()', function () {
        it('is used to bind or register class with special name', function () {
            const service = Reflect.construct(lib_1.ServiceProvider, [{}]);
            expect(isPromise_1.isPromise(service.register())).toBe(true);
        });
    });
    describe('.boot()', function () {
        it('is used to boot a service with special name', function () {
            const service = Reflect.construct(lib_1.ServiceProvider, [{}]);
            expect(isPromise_1.isPromise(service.boot())).toBe(true);
        });
    });
});
