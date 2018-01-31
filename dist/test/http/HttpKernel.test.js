"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Make = require("../../lib/core/make");
const ClassRegistry_1 = require("../../lib/core/ClassRegistry");
const HttpKernel_1 = require("../../lib/http/HttpKernel");
describe('HttpKernel', function () {
    it('is a base class which contains middleware configuration', function () { });
    it('auto register to ClassRegistry with name HttpKernel', function () {
        expect(ClassRegistry_1.ClassRegistry.has(HttpKernel_1.HttpKernel.className)).toBe(true);
        const instance = new HttpKernel_1.HttpKernel();
        expect(instance.getClassName() === HttpKernel_1.HttpKernel.className);
    });
    describe('getMiddleware()', function () {
        it('returns empty array if middleware not found', function () {
            const instance = new HttpKernel_1.HttpKernel();
            expect(instance.getMiddleware('not-found')).toEqual([]);
        });
        it('calls make() and push middleware to result if middleware instance is exists', function () {
            const middleware = {};
            const makeStub = Sinon.stub(Make, 'make');
            makeStub.returns(middleware);
            const instance = new HttpKernel_1.HttpKernel();
            instance['middleware']['test'] = 'something';
            const result = instance.getMiddleware('test');
            expect(result).toHaveLength(1);
            expect(result[0] === middleware).toBe(true);
            expect(makeStub.calledWith('something'));
            makeStub.restore();
        });
        it('calls make() and does not push middleware to result if middleware instance not exists', function () {
            const makeStub = Sinon.stub(Make, 'make');
            makeStub.returns(undefined);
            const instance = new HttpKernel_1.HttpKernel();
            instance['middleware']['test'] = 'something';
            const result = instance.getMiddleware('test');
            expect(result).toHaveLength(0);
            expect(makeStub.calledWith('something'));
            makeStub.restore();
        });
        it('maps all if the middleware is an array, does the same thing as string param', function () {
            const middleware = {};
            const makeStub = Sinon.stub(Make, 'make');
            makeStub.withArgs('something').returns(middleware);
            makeStub.withArgs('not-found').returns(undefined);
            const instance = new HttpKernel_1.HttpKernel();
            instance['middleware']['test'] = ['something', 'not-found'];
            const result = instance.getMiddleware('test');
            expect(result).toHaveLength(1);
            expect(result[0] === middleware).toBe(true);
            expect(makeStub.calledWith('something'));
            makeStub.restore();
        });
    });
});
