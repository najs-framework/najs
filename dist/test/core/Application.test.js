"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Register = require("../../lib/core/register");
const Make = require("../../lib/core/make");
const Bind = require("../../lib/core/bind");
const Application_1 = require("../../lib/core/Application");
const Facade_1 = require("../../lib/facades/Facade");
const constants_1 = require("../../lib/constants");
const ClassRegistry_1 = require("../../lib/core/ClassRegistry");
class Test {
}
Test.className = 'Test';
class FakeHttpDriver {
    start(options) { }
}
FakeHttpDriver.className = 'FakeHttpDriver';
describe('Application', function () {
    it('extends from Facade so it definitely a FacadeClass', function () {
        const app = new Application_1.Application();
        expect(app).toBeInstanceOf(Facade_1.Facade);
        expect(app.getClassName()).toEqual(constants_1.GlobalFacade.Application);
        expect(ClassRegistry_1.ClassRegistry.has(constants_1.GlobalFacade.Application)).toBe(true);
    });
    describe('.register()', function () {
        it('proxies register() function', function () {
            const app = new Application_1.Application();
            const registerSpy = Sinon.spy(Register, 'register');
            app.register(FakeHttpDriver);
            expect(registerSpy.calledWith(FakeHttpDriver)).toBe(true);
            app.register(Test, 'Test');
            expect(registerSpy.calledWith(Test, 'Test')).toBe(true);
            app.register(Test, 'Something', false);
            expect(registerSpy.calledWith(Test, 'Something', false)).toBe(true);
            app.register(Test, 'SomethingNew', true, false);
            expect(registerSpy.calledWith(Test, 'SomethingNew', true, false)).toBe(true);
        });
    });
    describe('.make()', function () {
        it('proxies make() function', function () {
            const app = new Application_1.Application();
            const makeSpy = Sinon.spy(Make, 'make');
            app.make(Test);
            expect(makeSpy.calledWith(Test)).toBe(true);
            app.make('Test');
            expect(makeSpy.calledWith('Test')).toBe(true);
            app.make('Something', { data: 'any' });
            expect(makeSpy.calledWith('Something', { data: 'any' })).toBe(true);
        });
    });
    describe('.bind()', function () {
        it('proxies bind() function', function () {
            const app = new Application_1.Application();
            const bindSpy = Sinon.spy(Bind, 'bind');
            app.bind('Cache', 'RedisCached');
            expect(bindSpy.calledWith('Cache', 'RedisCached')).toBe(true);
            const servicePoolInstanceCreator = function () { };
            app.bind('ServicePool', servicePoolInstanceCreator);
            expect(bindSpy.calledWith('ServicePool', servicePoolInstanceCreator)).toBe(true);
        });
    });
});
