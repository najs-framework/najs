"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Route_1 = require("../../lib/http/routing/Route");
// import { RouteCollection } from '../../lib/http/routing/RouteCollection'
const HttpMethod_1 = require("../../lib/http/HttpMethod");
const RouteBuilder_1 = require("../../lib/http/routing/RouteBuilder");
describe('Route', function () {
    it('can route all http verbs', function () {
        Route_1.Route.get('test', '').name('');
        Route_1.Route.get('/', '');
        Route_1.Route.prefix('/retails').get('/', '');
        Route_1.Route.middleware('Something').group(function () {
            Route_1.Route.prefix('/warehouses')
                .middleware('CSRF')
                .post('/', '');
            Route_1.Route.prefix('/warehouses').get('/', '');
            Route_1.Route.prefix('/relationship').group(function () {
                Route_1.Route.get('/', '');
                Route_1.Route.post('/', '');
            });
        });
        Route_1.Route.post('/', '');
        // for (const route of RouteCollection.routes) {
        //   // console.log(route)
        // }
    });
    describe('Register and Forward Methods', function () {
        describe('IRouteGrammarVerbs functions', function () {
            it('use()', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                const registerStub = Sinon.stub(Route_1.Route, 'register');
                registerStub.returns(builder);
                const useSpy = Sinon.spy(builder, 'use');
                function a() { }
                const b = {};
                Route_1.Route.use(a, [b, 12], 'c');
                expect(useSpy.calledWith(a, [b, 12], 'c')).toBe(true);
                registerStub.restore();
            });
            it('middleware()', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                const registerStub = Sinon.stub(Route_1.Route, 'register');
                registerStub.returns(builder);
                const middlewareSpy = Sinon.spy(builder, 'middleware');
                function a() { }
                const b = {};
                Route_1.Route.middleware(a, [b, 12], 'c');
                expect(middlewareSpy.calledWith(a, [b, 12], 'c')).toBe(true);
                registerStub.restore();
            });
            it('prefix()', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                const registerStub = Sinon.stub(Route_1.Route, 'register');
                registerStub.returns(builder);
                const prefixSpy = Sinon.spy(builder, 'prefix');
                Route_1.Route.prefix('test');
                expect(prefixSpy.calledWith('test')).toBe(true);
                registerStub.restore();
            });
            it('name()', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                const registerStub = Sinon.stub(Route_1.Route, 'register');
                registerStub.returns(builder);
                const nameSpy = Sinon.spy(builder, 'name');
                Route_1.Route.name('test');
                expect(nameSpy.calledWith('test')).toBe(true);
                registerStub.restore();
            });
            it('group()', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                const registerStub = Sinon.stub(Route_1.Route, 'register');
                registerStub.returns(builder);
                const groupSpy = Sinon.spy(builder, 'group');
                function groupFunction() { }
                Route_1.Route.group(groupFunction);
                expect(groupSpy.calledWith(groupFunction)).toBe(true);
                registerStub.restore();
            });
            it('method()', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                const registerStub = Sinon.stub(Route_1.Route, 'register');
                registerStub.returns(builder);
                const methodSpy = Sinon.spy(builder, 'method');
                function handler() { }
                Route_1.Route.method(HttpMethod_1.HttpMethod.DELETE, 'path', handler);
                expect(methodSpy.calledWith(HttpMethod_1.HttpMethod.DELETE, 'path', handler)).toBe(true);
                const Controller = {
                    endpoint: function () { }
                };
                Route_1.Route.method(HttpMethod_1.HttpMethod.M_SEARCH, 'path', Controller, 'endpoint');
                expect(methodSpy.calledWith(HttpMethod_1.HttpMethod.M_SEARCH, 'path', Controller, 'endpoint')).toBe(true);
                Route_1.Route.method(HttpMethod_1.HttpMethod.CHECKOUT, 'path', 'Controller@endpoint');
                expect(methodSpy.calledWith(HttpMethod_1.HttpMethod.CHECKOUT, 'path', 'Controller@endpoint')).toBe(true);
                registerStub.restore();
            });
            const list = {
                checkout: HttpMethod_1.HttpMethod.CHECKOUT,
                copy: HttpMethod_1.HttpMethod.COPY,
                delete: HttpMethod_1.HttpMethod.DELETE,
                get: HttpMethod_1.HttpMethod.GET,
                head: HttpMethod_1.HttpMethod.HEAD,
                lock: HttpMethod_1.HttpMethod.LOCK,
                merge: HttpMethod_1.HttpMethod.MERGE,
                mkactivity: HttpMethod_1.HttpMethod.MKACTIVITY,
                mkcol: HttpMethod_1.HttpMethod.MKCOL,
                move: HttpMethod_1.HttpMethod.MOVE,
                msearch: HttpMethod_1.HttpMethod.M_SEARCH,
                notify: HttpMethod_1.HttpMethod.NOTIFY,
                options: HttpMethod_1.HttpMethod.OPTIONS,
                patch: HttpMethod_1.HttpMethod.PATCH,
                post: HttpMethod_1.HttpMethod.POST,
                purge: HttpMethod_1.HttpMethod.PURGE,
                put: HttpMethod_1.HttpMethod.PUT,
                report: HttpMethod_1.HttpMethod.REPORT,
                search: HttpMethod_1.HttpMethod.SEARCH,
                subscribe: HttpMethod_1.HttpMethod.SUBSCRIBE,
                trace: HttpMethod_1.HttpMethod.TRACE,
                unlock: HttpMethod_1.HttpMethod.UNLOCK,
                unsubscribe: HttpMethod_1.HttpMethod.UNSUBSCRIBE
            };
            for (const name in list) {
                it(name + '() registers and calls RouteBuilder.' + name + '()', function () {
                    const builder = new RouteBuilder_1.RouteBuilder();
                    const registerStub = Sinon.stub(Route_1.Route, 'register');
                    registerStub.returns(builder);
                    const methodSpy = Sinon.spy(builder, 'method');
                    Reflect.apply(Route_1.Route[name], Route_1.Route, ['path', 'target']);
                    expect(methodSpy.calledWith(list[name], 'path', 'target')).toBe(true);
                    function handler() { }
                    Reflect.apply(Route_1.Route[name], Route_1.Route, ['path', handler]);
                    expect(methodSpy.calledWith(list[name], 'path', handler)).toBe(true);
                    const Controller = {
                        endpoint: function () { }
                    };
                    Reflect.apply(Route_1.Route[name], Route_1.Route, ['path', Controller, 'endpoint']);
                    expect(methodSpy.calledWith(list[name], 'path', Controller, 'endpoint')).toBe(true);
                    registerStub.restore();
                });
            }
        });
    });
});
