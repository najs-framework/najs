"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const RouteFacade_1 = require("../../../lib/http/routing/RouteFacade");
const RouteCollection_1 = require("../../../lib/http/routing/RouteCollection");
const HttpMethod_1 = require("../../../lib/http/HttpMethod");
const RouteBuilder_1 = require("../../../lib/http/routing/RouteBuilder");
function clearRouteCollection() {
    RouteCollection_1.RouteCollection['routes'] = [];
}
function getRouteData(method, path, prefix, middleware, controller, endpoint, name, metadata) {
    return {
        name,
        metadata,
        method,
        path,
        prefix,
        middleware,
        controller,
        endpoint
    };
}
describe('Route', function () {
    describe('Routing Grammar', function () {
        afterEach(function () {
            clearRouteCollection();
        });
        it('allows .middleware() before or after .[HTTP METHOD]()', function () {
            RouteFacade_1.RouteFacade.get('/test', 'Controller@endpoint').middleware('a', 'b', 'c');
            RouteFacade_1.RouteFacade.middleware('a', 'b', 'c').post('/test', 'Controller@endpoint');
            expect(RouteCollection_1.RouteCollection.getData()).toEqual([
                getRouteData(HttpMethod_1.HttpMethod.GET, '/test', '', ['a', 'b', 'c'], 'Controller', 'endpoint'),
                getRouteData(HttpMethod_1.HttpMethod.POST, '/test', '', ['a', 'b', 'c'], 'Controller', 'endpoint')
            ]);
        });
        it('allows .prefix() before or after .[HTTP METHOD]()', function () {
            RouteFacade_1.RouteFacade.get('/test', 'Controller@endpoint').prefix('/prefix');
            RouteFacade_1.RouteFacade.prefix('/prefix').post('/test', 'Controller@endpoint');
            expect(RouteCollection_1.RouteCollection.getData()).toEqual([
                getRouteData(HttpMethod_1.HttpMethod.GET, '/test', '/prefix', [], 'Controller', 'endpoint'),
                getRouteData(HttpMethod_1.HttpMethod.POST, '/test', '/prefix', [], 'Controller', 'endpoint')
            ]);
        });
        it('allows .prefix() and .middleware() chain before or after .[HTTP METHOD]()', function () {
            RouteFacade_1.RouteFacade.get('/test', 'Controller@endpoint')
                .prefix('/prefix')
                .middleware('a', 'b', 'c');
            RouteFacade_1.RouteFacade.prefix('/prefix')
                .middleware('a', 'b', 'c')
                .post('/test', 'Controller@endpoint');
            RouteFacade_1.RouteFacade.delete('/test', 'Controller@endpoint')
                .middleware('a', 'b', 'c')
                .prefix('/prefix');
            RouteFacade_1.RouteFacade.middleware('a', 'b', 'c')
                .prefix('/prefix')
                .patch('/test', 'Controller@endpoint');
            expect(RouteCollection_1.RouteCollection.getData()).toEqual([
                getRouteData(HttpMethod_1.HttpMethod.GET, '/test', '/prefix', ['a', 'b', 'c'], 'Controller', 'endpoint'),
                getRouteData(HttpMethod_1.HttpMethod.POST, '/test', '/prefix', ['a', 'b', 'c'], 'Controller', 'endpoint'),
                getRouteData(HttpMethod_1.HttpMethod.DELETE, '/test', '/prefix', ['a', 'b', 'c'], 'Controller', 'endpoint'),
                getRouteData(HttpMethod_1.HttpMethod.PATCH, '/test', '/prefix', ['a', 'b', 'c'], 'Controller', 'endpoint')
            ]);
        });
        it('allows .name() before or after .[HTTP METHOD]()', function () {
            RouteFacade_1.RouteFacade.get('/test', 'Controller@endpoint').name('name-get');
            RouteFacade_1.RouteFacade.name('name-post').post('/test', 'Controller@endpoint');
            expect(RouteCollection_1.RouteCollection.getData()).toEqual([
                getRouteData(HttpMethod_1.HttpMethod.GET, '/test', '', [], 'Controller', 'endpoint', 'name-get'),
                getRouteData(HttpMethod_1.HttpMethod.POST, '/test', '', [], 'Controller', 'endpoint', 'name-post')
            ]);
        });
        it('allows .prefix() and .middleware() with .name() before or after .[HTTP METHOD]()', function () {
            RouteFacade_1.RouteFacade.get('/test', 'Controller@endpoint')
                .name('name-get')
                .prefix('/prefix')
                .middleware('a');
            RouteFacade_1.RouteFacade.prefix('/prefix')
                .middleware('a')
                .name('name-post')
                .post('/test', 'Controller@endpoint');
            RouteFacade_1.RouteFacade.delete('/test', 'Controller@endpoint')
                .prefix('/prefix')
                .name('name-delete')
                .middleware('a');
            RouteFacade_1.RouteFacade.put('/test', 'Controller@endpoint')
                .prefix('/prefix')
                .name('name-put')
                .middleware('a');
            expect(RouteCollection_1.RouteCollection.getData()).toEqual([
                getRouteData(HttpMethod_1.HttpMethod.GET, '/test', '/prefix', ['a'], 'Controller', 'endpoint', 'name-get'),
                getRouteData(HttpMethod_1.HttpMethod.POST, '/test', '/prefix', ['a'], 'Controller', 'endpoint', 'name-post'),
                getRouteData(HttpMethod_1.HttpMethod.DELETE, '/test', '/prefix', ['a'], 'Controller', 'endpoint', 'name-delete'),
                getRouteData(HttpMethod_1.HttpMethod.PUT, '/test', '/prefix', ['a'], 'Controller', 'endpoint', 'name-put')
            ]);
        });
        it('allows .prefix() before or after .group()', function () {
            RouteFacade_1.RouteFacade.prefix('/a').group(function () {
                RouteFacade_1.RouteFacade.get('/test', 'Controller@endpoint').name('name-get');
                RouteFacade_1.RouteFacade.name('name-post').post('/test', 'Controller@endpoint');
            });
            RouteFacade_1.RouteFacade.group(function () {
                RouteFacade_1.RouteFacade.get('/test', 'Controller@endpoint').name('name-get');
                RouteFacade_1.RouteFacade.name('name-post').post('/test', 'Controller@endpoint');
            }).prefix('/b');
            expect(RouteCollection_1.RouteCollection.getData()).toEqual([
                getRouteData(HttpMethod_1.HttpMethod.GET, '/test', '/a', [], 'Controller', 'endpoint', 'name-get'),
                getRouteData(HttpMethod_1.HttpMethod.POST, '/test', '/a', [], 'Controller', 'endpoint', 'name-post'),
                getRouteData(HttpMethod_1.HttpMethod.GET, '/test', '/b', [], 'Controller', 'endpoint', 'name-get'),
                getRouteData(HttpMethod_1.HttpMethod.POST, '/test', '/b', [], 'Controller', 'endpoint', 'name-post')
            ]);
        });
        it('allows to use single route and group of routes', function () {
            RouteFacade_1.RouteFacade.put('/test', 'Controller@endpoint').name('name-put');
            RouteFacade_1.RouteFacade.prefix('/a').group(function () {
                RouteFacade_1.RouteFacade.get('/test', 'Controller@endpoint').name('name-get');
                RouteFacade_1.RouteFacade.name('name-post').post('/test', 'Controller@endpoint');
            });
            expect(RouteCollection_1.RouteCollection.getData()).toEqual([
                getRouteData(HttpMethod_1.HttpMethod.PUT, '/test', '', [], 'Controller', 'endpoint', 'name-put'),
                getRouteData(HttpMethod_1.HttpMethod.GET, '/test', '/a', [], 'Controller', 'endpoint', 'name-get'),
                getRouteData(HttpMethod_1.HttpMethod.POST, '/test', '/a', [], 'Controller', 'endpoint', 'name-post')
            ]);
        });
        it('allows multiple .group() levels', function () {
            RouteFacade_1.RouteFacade.prefix('/a')
                .middleware('a')
                .group(function () {
                RouteFacade_1.RouteFacade.group(function () {
                    RouteFacade_1.RouteFacade.put('/test', 'Controller@endpoint').name('name-put');
                });
                RouteFacade_1.RouteFacade.middleware('b')
                    .prefix('/b')
                    .group(function () {
                    RouteFacade_1.RouteFacade.get('/test', 'Controller@endpoint').name('name-get');
                    RouteFacade_1.RouteFacade.group(function () {
                        RouteFacade_1.RouteFacade.name('name-post').post('/test', 'Controller@endpoint');
                    })
                        .prefix('/c')
                        .middleware('c');
                });
            });
            expect(RouteCollection_1.RouteCollection.getData()).toEqual([
                getRouteData(HttpMethod_1.HttpMethod.PUT, '/test', '/a', ['a'], 'Controller', 'endpoint', 'name-put'),
                getRouteData(HttpMethod_1.HttpMethod.GET, '/test', '/a/b', ['a', 'b'], 'Controller', 'endpoint', 'name-get'),
                getRouteData(HttpMethod_1.HttpMethod.POST, '/test', '/a/b/c', ['a', 'b', 'c'], 'Controller', 'endpoint', 'name-post')
            ]);
        });
    });
    describe('Register and Forward Methods', function () {
        describe('IRouteGrammarVerbs functions', function () {
            it('use()', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                const registerStub = Sinon.stub(RouteCollection_1.RouteCollection, 'register');
                registerStub.returns(builder);
                const useSpy = Sinon.spy(builder, 'use');
                function a() { }
                const b = {};
                RouteFacade_1.RouteFacade.use(a, [b, 12], 'c');
                expect(useSpy.calledWith(a, [b, 12], 'c')).toBe(true);
                registerStub.restore();
            });
            it('middleware()', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                const registerStub = Sinon.stub(RouteCollection_1.RouteCollection, 'register');
                registerStub.returns(builder);
                const middlewareSpy = Sinon.spy(builder, 'middleware');
                function a() { }
                const b = {};
                RouteFacade_1.RouteFacade.middleware(a, [b, 12], 'c');
                expect(middlewareSpy.calledWith(a, [b, 12], 'c')).toBe(true);
                registerStub.restore();
            });
            it('prefix()', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                const registerStub = Sinon.stub(RouteCollection_1.RouteCollection, 'register');
                registerStub.returns(builder);
                const prefixSpy = Sinon.spy(builder, 'prefix');
                RouteFacade_1.RouteFacade.prefix('test');
                expect(prefixSpy.calledWith('test')).toBe(true);
                registerStub.restore();
            });
            it('name()', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                const registerStub = Sinon.stub(RouteCollection_1.RouteCollection, 'register');
                registerStub.returns(builder);
                const nameSpy = Sinon.spy(builder, 'name');
                RouteFacade_1.RouteFacade.name('test');
                expect(nameSpy.calledWith('test')).toBe(true);
                registerStub.restore();
            });
            it('group()', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                const registerStub = Sinon.stub(RouteCollection_1.RouteCollection, 'register');
                registerStub.returns(builder);
                const groupSpy = Sinon.spy(builder, 'group');
                function groupFunction() { }
                RouteFacade_1.RouteFacade.group(groupFunction);
                expect(groupSpy.calledWith(groupFunction)).toBe(true);
                registerStub.restore();
            });
            it('method()', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                const registerStub = Sinon.stub(RouteCollection_1.RouteCollection, 'register');
                registerStub.returns(builder);
                const methodSpy = Sinon.spy(builder, 'method');
                function handler() { }
                RouteFacade_1.RouteFacade.method(HttpMethod_1.HttpMethod.DELETE, 'path', handler);
                expect(methodSpy.calledWith(HttpMethod_1.HttpMethod.DELETE, 'path', handler)).toBe(true);
                const Controller = {
                    endpoint: function () { }
                };
                RouteFacade_1.RouteFacade.method(HttpMethod_1.HttpMethod.M_SEARCH, 'path', Controller, 'endpoint');
                expect(methodSpy.calledWith(HttpMethod_1.HttpMethod.M_SEARCH, 'path', Controller, 'endpoint')).toBe(true);
                RouteFacade_1.RouteFacade.method(HttpMethod_1.HttpMethod.CHECKOUT, 'path', 'Controller@endpoint');
                expect(methodSpy.calledWith(HttpMethod_1.HttpMethod.CHECKOUT, 'path', 'Controller@endpoint')).toBe(true);
                registerStub.restore();
            });
            const list = {
                all: 'all',
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
                    const registerStub = Sinon.stub(RouteCollection_1.RouteCollection, 'register');
                    registerStub.returns(builder);
                    const methodSpy = Sinon.spy(builder, 'method');
                    Reflect.apply(RouteFacade_1.RouteFacade[name], RouteFacade_1.RouteFacade, ['path', 'controller@endpoint']);
                    expect(methodSpy.calledWith(list[name], 'path', 'controller@endpoint')).toBe(true);
                    function handler() { }
                    Reflect.apply(RouteFacade_1.RouteFacade[name], RouteFacade_1.RouteFacade, ['path', handler]);
                    expect(methodSpy.calledWith(list[name], 'path', handler)).toBe(true);
                    const Controller = {
                        endpoint: function () { }
                    };
                    Reflect.apply(RouteFacade_1.RouteFacade[name], RouteFacade_1.RouteFacade, ['path', Controller, 'endpoint']);
                    expect(methodSpy.calledWith(list[name], 'path', Controller, 'endpoint')).toBe(true);
                    registerStub.restore();
                });
            }
        });
    });
});
