"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Register = require("../../lib/core/register");
const Make = require("../../lib/core/make");
const Bind = require("../../lib/core/bind");
const Najs_1 = require("../../lib/core/Najs");
class Test {
}
Test.className = 'Test';
class FakeHttpDriver {
    start(options) { }
}
FakeHttpDriver.className = 'FakeHttpDriver';
const DefaultOptions = {
    port: 3000,
    host: 'localhost',
    httpDriver: 'ExpressHttpDriver'
};
describe('Najs', function () {
    describe('use(options: Object)', function () {
        it('assigns default options if use is not called', function () {
            expect(Najs_1.Najs['options']).toEqual(DefaultOptions);
        });
        it('assigns default options if options is undefined', function () {
            Najs_1.Najs.use(undefined);
            expect(Najs_1.Najs['options']).toEqual(DefaultOptions);
        });
        it('assigns default options if options is empty', function () {
            Najs_1.Najs.use({});
            expect(Najs_1.Najs['options']).toEqual(DefaultOptions);
        });
        it('modified options by parameter', function () {
            Najs_1.Najs.use({ port: 30000 });
            expect(Najs_1.Najs['options']).toEqual(Object.assign({}, DefaultOptions, { port: 30000 }));
        });
    });
    describe('Najs.register()', function () {
        it('proxies register() function', function () {
            const registerSpy = Sinon.spy(Register, 'register');
            Najs_1.Najs.register(FakeHttpDriver);
            expect(registerSpy.calledWith(FakeHttpDriver)).toBe(true);
            Najs_1.Najs.register(Test, 'Test');
            expect(registerSpy.calledWith(Test, 'Test')).toBe(true);
            Najs_1.Najs.register(Test, 'Something', false);
            expect(registerSpy.calledWith(Test, 'Something', false)).toBe(true);
            Najs_1.Najs.register(Test, 'SomethingNew', true, false);
            expect(registerSpy.calledWith(Test, 'SomethingNew', true, false)).toBe(true);
        });
    });
    describe('Najs.make()', function () {
        it('proxies make() function', function () {
            const makeSpy = Sinon.spy(Make, 'make');
            Najs_1.Najs.make(Test);
            expect(makeSpy.calledWith(Test)).toBe(true);
            Najs_1.Najs.make('Test');
            expect(makeSpy.calledWith('Test')).toBe(true);
            Najs_1.Najs.make('Something', { data: 'any' });
            expect(makeSpy.calledWith('Something', { data: 'any' })).toBe(true);
        });
    });
    describe('Najs.bind()', function () {
        it('proxies bind() function', function () {
            const bindSpy = Sinon.spy(Bind, 'bind');
            Najs_1.Najs.bind('Cache', 'RedisCached');
            expect(bindSpy.calledWith('Cache', 'RedisCached')).toBe(true);
            const servicePoolInstanceCreator = function () { };
            Najs_1.Najs.bind('ServicePool', servicePoolInstanceCreator);
            expect(bindSpy.calledWith('ServicePool', servicePoolInstanceCreator)).toBe(true);
        });
    });
    describe('start(options?: Object)', function () {
        it('called use(options) if provided', function () {
            const useSpy = Sinon.spy(Najs_1.Najs, 'use');
            Najs_1.Najs.start({
                httpDriver: FakeHttpDriver.className
            });
            expect(useSpy.calledWith({
                httpDriver: FakeHttpDriver.className
            })).toBe(true);
        });
        it('use Najs.options if do not pass options', function () {
            Najs_1.Najs.use({
                httpDriver: FakeHttpDriver.className
            });
            Najs_1.Najs.start();
        });
    });
});
