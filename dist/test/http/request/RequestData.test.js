"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Lodash = require("lodash");
const RequestData_1 = require("../../../lib/http/request/RequestData");
describe('RequestData', function () {
    describe('.constructor()', function () {
        it('is constructed by an Object data', function () {
            const data = {};
            const requestData = new RequestData_1.RequestData(data);
            expect(requestData['data'] === data).toBe(true);
        });
    });
    describe('.all()', function () {
        it('returns raw data which passed to constructor before', function () {
            const data = {};
            const requestData = new RequestData_1.RequestData(data);
            expect(requestData.all() === data).toBe(true);
        });
    });
    describe('.has()', function () {
        it('uses Lodash.has() to determine the path exists in this.data', function () {
            const requestData = new RequestData_1.RequestData({});
            const hasSpy = Sinon.spy(Lodash, 'has');
            requestData.has('test');
            expect(hasSpy.calledWith(requestData['data'], 'test')).toBe(true);
        });
    });
    describe('.get()', function () {
        it('uses Lodash.get() to get a value in this.data', function () {
            const requestData = new RequestData_1.RequestData({});
            const getSpy = Sinon.spy(Lodash, 'get');
            requestData.get('test');
            expect(getSpy.calledWith(requestData['data'], 'test')).toBe(true);
        });
    });
    describe('.only()', function () {
        it('should be immutable', function () {
            const requestData = new RequestData_1.RequestData({});
            expect(requestData.only('a') === requestData.all()).toBe(false);
        });
        it('returns fresh object with keys passed in arguments', function () {
            const requestData = new RequestData_1.RequestData({ a: 'a', b: undefined, c: 1, d: true, e: false, f: { a: 1, b: 2 }, g: [] });
            expect(requestData.only('a')).toEqual({ a: 'a' });
            expect(requestData.only('a', 'b')).toEqual({ a: 'a', b: undefined });
            expect(requestData.only(['a', 'b', 'c'])).toEqual({ a: 'a', b: undefined, c: 1 });
            expect(requestData.only('a', ['b', 'c'], 'd', 'f')).toEqual({
                a: 'a',
                b: undefined,
                c: 1,
                d: true,
                f: { a: 1, b: 2 }
            });
            expect(requestData.only('a', ['b', 'c'], 'd', 'f.a')).toEqual({
                a: 'a',
                b: undefined,
                c: 1,
                d: true,
                f: { a: 1 }
            });
        });
    });
    describe('.except()', function () {
        it('should be immutable', function () {
            const requestData = new RequestData_1.RequestData({});
            expect(requestData.except('a') === requestData.all()).toBe(false);
        });
        it('returns fresh object with keys not passed in arguments', function () {
            const requestData = new RequestData_1.RequestData({ a: 'a', b: undefined, c: 1, d: true, e: false, f: { a: 1, b: 2 }, g: [] });
            expect(requestData.except('a')).toEqual({ b: undefined, c: 1, d: true, e: false, f: { a: 1, b: 2 }, g: [] });
            expect(requestData.except('a', 'b')).toEqual({ c: 1, d: true, e: false, f: { a: 1, b: 2 }, g: [] });
            expect(requestData.except(['a', 'b', 'c'])).toEqual({ d: true, e: false, f: { a: 1, b: 2 }, g: [] });
            expect(requestData.except('a', ['b', 'c'], 'd', 'f')).toEqual({ e: false, g: [] });
            expect(requestData.except('a', ['b', 'c'], 'd', 'f.a')).toEqual({ e: false, f: { b: 2 }, g: [] });
        });
    });
});
