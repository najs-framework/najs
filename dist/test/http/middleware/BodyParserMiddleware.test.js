"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Middleware = require("../../../lib/http/middleware/BodyParserMiddleware");
const najs_binding_1 = require("najs-binding");
const isPromise_1 = require("../../../lib/private/isPromise");
describe('BodyParserMiddleware', function () {
    it('is fit for najs-binding', function () {
        expect(Middleware.BodyParserMiddleware.className).toEqual('Najs.BodyParserMiddleware');
    });
    it('has shared Express.RequestHandler called JsonParser which not init by default', function () {
        expect(Middleware.JsonParser).toBeUndefined();
    });
    it('has shared Express.RequestHandler called UrlEncodedParser which not init by default', function () {
        expect(Middleware.UrlEncodedParser).toBeUndefined();
    });
    it('creates CookieParser from "cookie-parser" module with secret = "najs" by default when constructor called', function () {
        const getUrlEncodedOptionsSpy = Sinon.spy(Middleware.BodyParserMiddleware.prototype, 'getUrlEncodedOptions');
        najs_binding_1.make(Middleware.BodyParserMiddleware.className);
        expect(typeof Middleware.JsonParser === 'function').toBe(true);
        expect(typeof Middleware.UrlEncodedParser === 'function').toBe(true);
        expect(getUrlEncodedOptionsSpy.called).toBe(true);
        getUrlEncodedOptionsSpy.restore();
    });
    describe('.before()', function () {
        it('returns a promise, which calls CookieParser with request, response and fake next function', async function () {
            const request = {};
            const response = {};
            const instance = new Middleware.BodyParserMiddleware();
            function fakeJsonParser(request, response, done) {
                done();
            }
            function fakeUrlEncodedParser(request, response, done) {
                done();
            }
            const jsonParserStub = Sinon.stub(Middleware, 'JsonParser');
            jsonParserStub.callsFake(fakeJsonParser);
            const urlEncodedParserStub = Sinon.stub(Middleware, 'UrlEncodedParser');
            urlEncodedParserStub.callsFake(fakeUrlEncodedParser);
            const result = instance.before(request, response);
            expect(isPromise_1.isPromise(result)).toBe(true);
            expect(jsonParserStub.firstCall.args[0] === request).toBe(true);
            expect(jsonParserStub.firstCall.args[1] === response).toBe(true);
            expect(typeof jsonParserStub.firstCall.args[2] === 'function').toBe(true);
            expect(urlEncodedParserStub.firstCall.args[0] === request).toBe(true);
            expect(urlEncodedParserStub.firstCall.args[1] === response).toBe(true);
            expect(typeof urlEncodedParserStub.firstCall.args[2] === 'function').toBe(true);
            jsonParserStub.restore();
            urlEncodedParserStub.restore();
        });
        it('sets promise to Rejected if there is an error', async function () {
            const instance = new Middleware.BodyParserMiddleware();
            function fakeJsonParser(request, response, done) {
                done(new Error('Test'));
            }
            function fakeUrlEncodedParser(request, response, done) {
                done();
            }
            const jsonParserStub = Sinon.stub(Middleware, 'JsonParser');
            jsonParserStub.callsFake(fakeJsonParser);
            const urlEncodedParserStub = Sinon.stub(Middleware, 'UrlEncodedParser');
            urlEncodedParserStub.callsFake(fakeUrlEncodedParser);
            try {
                await instance.before({}, {});
            }
            catch (error) {
                expect(error.message).toEqual('Test');
                jsonParserStub.restore();
                urlEncodedParserStub.restore();
                return;
            }
            expect('should not reach this line').toEqual('hmm');
        });
        it('sets promise to Rejected if there is an error', async function () {
            const instance = new Middleware.BodyParserMiddleware();
            function fakeJsonParser(request, response, done) {
                done();
            }
            function fakeUrlEncodedParser(request, response, done) {
                done(new Error('Test'));
            }
            const jsonParserStub = Sinon.stub(Middleware, 'JsonParser');
            jsonParserStub.callsFake(fakeJsonParser);
            const urlEncodedParserStub = Sinon.stub(Middleware, 'UrlEncodedParser');
            urlEncodedParserStub.callsFake(fakeUrlEncodedParser);
            try {
                await instance.before({}, {});
            }
            catch (error) {
                expect(error.message).toEqual('Test');
                jsonParserStub.restore();
                urlEncodedParserStub.restore();
                return;
            }
            expect('should not reach this line').toEqual('hmm');
        });
    });
});
