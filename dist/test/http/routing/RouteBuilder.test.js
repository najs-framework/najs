"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const HttpMethod_1 = require("../../../lib/http/HttpMethod");
const RouteBuilder_1 = require("../../../lib/http/routing/RouteBuilder");
const Controller_1 = require("../../../lib/http/controller/Controller");
describe('RouteBuilder', function () {
    describe('constructor', function () {
        it('can create new builder without argument', function () {
            const builder = new RouteBuilder_1.RouteBuilder();
            expect(builder['data'].method).toBeUndefined();
            expect(builder['data'].path).toBeUndefined();
            expect(builder['children']).toEqual([]);
        });
        it('can create new builder method and path', function () {
            const builder = new RouteBuilder_1.RouteBuilder('GET', '/');
            expect(builder['data'].method).toEqual('GET');
            expect(builder['data'].path).toEqual('/');
            expect(builder['children']).toEqual([]);
        });
    });
    describe('IRouteBuilder functions', function () {
        describe('getRouteData()', function () {
            it('returns empty array if builder is not valid route', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                expect(builder.getRouteData()).toEqual([]);
            });
            it('returns data itself if there is no children', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                builder.method(HttpMethod_1.HttpMethod.GET, '/test', 'Controller@endpoint');
                expect(builder.getRouteData()).toEqual([
                    {
                        method: 'GET',
                        path: '/test',
                        controller: 'Controller',
                        endpoint: 'endpoint',
                        prefix: '',
                        middleware: []
                    }
                ]);
            });
            it('returns children data which already merged', function () {
                const a = () => { };
                const b = {};
                const builder = new RouteBuilder_1.RouteBuilder();
                builder['data']['prefix'] = '/prefix';
                builder['data']['middleware'] = [a, b, 'c'];
                const childA = new RouteBuilder_1.RouteBuilder();
                childA.method(HttpMethod_1.HttpMethod.GET, '/test', 'Controller@endpointGet');
                const childB = new RouteBuilder_1.RouteBuilder();
                childB.method(HttpMethod_1.HttpMethod.POST, '/ok', 'Controller@endpointPost');
                builder['children'].push(childA);
                builder['children'].push(childB);
                expect(builder.getRouteData()).toEqual([
                    {
                        method: 'GET',
                        path: '/test',
                        controller: 'Controller',
                        endpoint: 'endpointGet',
                        prefix: '/prefix',
                        middleware: [a, b, 'c']
                    },
                    {
                        method: 'POST',
                        path: '/ok',
                        controller: 'Controller',
                        endpoint: 'endpointPost',
                        prefix: '/prefix',
                        middleware: [a, b, 'c']
                    }
                ]);
            });
            it('returns children data which already merged with multiple levels', function () {
                const a = () => { };
                const b = {};
                const builder = new RouteBuilder_1.RouteBuilder();
                builder['data']['prefix'] = '/prefix';
                builder['data']['middleware'] = [a, b, 'c'];
                const childA = new RouteBuilder_1.RouteBuilder();
                childA.method(HttpMethod_1.HttpMethod.GET, '/test', 'Controller@endpointGet');
                const childB = new RouteBuilder_1.RouteBuilder();
                childB['data']['prefix'] = '/b';
                childB['data']['middleware'] = ['d'];
                const grantChild = new RouteBuilder_1.RouteBuilder();
                grantChild.method(HttpMethod_1.HttpMethod.DELETE, '/hum', 'Controller@endpointDelete');
                childB['children'].push(grantChild);
                builder['children'].push(childA);
                builder['children'].push(childB);
                expect(builder.getRouteData()).toEqual([
                    {
                        method: 'GET',
                        path: '/test',
                        controller: 'Controller',
                        endpoint: 'endpointGet',
                        prefix: '/prefix',
                        middleware: [a, b, 'c']
                    },
                    {
                        method: 'DELETE',
                        path: '/hum',
                        controller: 'Controller',
                        endpoint: 'endpointDelete',
                        prefix: '/prefix/b',
                        middleware: [a, b, 'c', 'd']
                    }
                ]);
            });
        });
        describe('shouldRegisterChildRoute()', function () {
            it('does not register to child if there is no metadata', function () {
                const builder = new RouteBuilder_1.RouteBuilder('GET', '/');
                expect(builder.shouldRegisterChildRoute()).toBe(false);
            });
            it('does not register to child if metadata does not contain grouped', function () {
                const builder = new RouteBuilder_1.RouteBuilder('GET', '/');
                builder['data']['metadata'] = {};
                expect(builder.shouldRegisterChildRoute()).toBe(false);
            });
            it('does not register to child if metadata contains grouped but does not equal true', function () {
                const builder = new RouteBuilder_1.RouteBuilder('GET', '/');
                builder['data']['metadata'] = { grouped: false };
                expect(builder.shouldRegisterChildRoute()).toBe(false);
            });
            it('registers to child if metadata contains grouped equals true', function () {
                const builder = new RouteBuilder_1.RouteBuilder('GET', '/');
                builder['data']['metadata'] = { grouped: true };
                expect(builder.shouldRegisterChildRoute()).toBe(true);
            });
        });
        describe('hasChildRoute()', function () {
            it('returns false if this.children.length === 0', function () {
                const builder = new RouteBuilder_1.RouteBuilder('GET', '/');
                expect(builder.hasChildRoute()).toBe(false);
            });
            it('returns true if this.children.length === 0', function () {
                const builder = new RouteBuilder_1.RouteBuilder('GET', '/');
                builder['children'] = ['any'];
                expect(builder.hasChildRoute()).toBe(true);
            });
        });
        describe('registerChildRoute()', function () {
            it('pushes child to children if it empty', function () {
                const parent = new RouteBuilder_1.RouteBuilder();
                const child = new RouteBuilder_1.RouteBuilder('GET', '/');
                parent.registerChildRoute(child);
                expect(parent['children']).toHaveLength(1);
                expect(parent['children'][0]).toEqual(child);
            });
            it('pushes child to children if it not empty and the last-child has result shouldRegisterChildRoute() is false', function () {
                const parent = new RouteBuilder_1.RouteBuilder();
                const childAlpha = new RouteBuilder_1.RouteBuilder('GET', '/');
                const childBeta = new RouteBuilder_1.RouteBuilder('POST', '/');
                parent.registerChildRoute(childAlpha);
                parent.registerChildRoute(childBeta);
                expect(parent['children']).toHaveLength(2);
                expect(parent['children'][0]).toEqual(childAlpha);
                expect(parent['children'][1]).toEqual(childBeta);
            });
            it('calls last-child.registerChildRoute() if last-child.shouldRegisterChildRoute() is true', function () {
                const parent = new RouteBuilder_1.RouteBuilder();
                const lastChild = new RouteBuilder_1.RouteBuilder('GET', '/');
                lastChild['data']['metadata'] = { grouped: true };
                const childBeta = new RouteBuilder_1.RouteBuilder('POST', '/');
                parent.registerChildRoute(lastChild);
                parent.registerChildRoute(childBeta);
                expect(parent['children']).toHaveLength(1);
                expect(parent['children'][0]).toEqual(lastChild);
                expect(parent['children'][0]['children']).toHaveLength(1);
                expect(parent['children'][0]['children'][0]).toEqual(childBeta);
            });
        });
    });
    describe('IRouteGrammarControl functions', function () {
        describe('middleware()', function () {
            it('appends middleware with multiple parameters and flatten if any param is an array', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                expect(builder['data'].middleware).toEqual([]);
                builder.middleware('a', ['b', 'c'], 'd');
                expect(builder['data'].middleware).toEqual(['a', 'b', 'c', 'd']);
                builder.middleware('e', 'f');
                expect(builder['data'].middleware).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
            });
            it('accepts middleware as a function', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                function a() { }
                function b() { }
                function c() { }
                function d() { }
                expect(builder['data'].middleware).toEqual([]);
                builder.middleware([a, b, c], d, ['e', 'f']);
                expect(builder['data'].middleware).toEqual([a, b, c, d, 'e', 'f']);
            });
            it('accepts middleware as an object', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                const a = {};
                const b = {};
                const c = {};
                function d() { }
                expect(builder['data'].middleware).toEqual([]);
                builder.middleware([a], [b, c], d, ['e', 'f']);
                expect(builder['data'].middleware).toEqual([a, b, c, d, 'e', 'f']);
            });
            it('removes invalid type of middleware such as number or boolean', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                const a = {};
                function b() { }
                expect(builder['data'].middleware).toEqual([]);
                builder.middleware(true, a, [b, 12], 'c', 12, 'd');
                expect(builder['data'].middleware).toEqual([a, b, 'c', 'd']);
            });
        });
        describe('use()', function () {
            it('just .middleware() alias', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                const middlewareSpy = Sinon.spy(builder, 'middleware');
                builder.use('test', 'abc', ['a', 'b']);
                expect(middlewareSpy.calledWith('test', 'abc', ['a', 'b'])).toBe(true);
            });
        });
        describe('prefix()', function () {
            it('assigns parameter to data.prefix, and overrides if called again', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                expect(builder['data'].prefix).toEqual('');
                builder.prefix('test');
                expect(builder['data'].prefix).toEqual('test');
                builder.prefix('change');
                expect(builder['data'].prefix).toEqual('change');
            });
        });
    });
    describe('IRouteGrammarNamed functions', function () {
        describe('name()', function () {
            it('assign name to data.name', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                expect(builder['data'].name).toBeUndefined();
                builder.name('test');
                expect(builder['data'].name).toEqual('test');
                builder.name('change');
                expect(builder['data'].name).toEqual('change');
            });
        });
    });
    describe('IRouteGrammarGroup functions', function () {
        describe('group()', function () {
            it('creates metadata.grouped even metadata is undefined', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                expect(builder['data']['metadata']).toBeUndefined();
                builder.group(() => { });
                expect(builder['data']['metadata']).toEqual({});
            });
            it('set metadata.grouped and call callback, after that it deletes grouped', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                builder['data']['metadata'] = {};
                const metadata = builder['data']['metadata'];
                expect(metadata['grouped']).toBeUndefined();
                builder.group(function () {
                    expect(metadata['grouped']).toBe(true);
                });
                expect(metadata['grouped']).toBeUndefined();
            });
        });
    });
    describe('IRouteGrammarVerbs functions', function () {
        describe('method()', function () {
            it('assigns method, path to data.method/data.path', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                builder.method(HttpMethod_1.HttpMethod.OPTIONS, '/any/:id', function () { });
                expect(builder['data'].method).toEqual(HttpMethod_1.HttpMethod.OPTIONS);
                expect(builder['data'].path).toEqual('/any/:id');
            });
            it('allows endpoint as a function', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                function endpoint() { }
                builder.method(HttpMethod_1.HttpMethod.POST, '/path', endpoint);
                expect(builder['data'].method).toEqual(HttpMethod_1.HttpMethod.POST);
                expect(builder['data'].path).toEqual('/path');
                expect(builder['data'].endpoint).toEqual(endpoint);
                expect(builder['data'].controller).toBeUndefined;
            });
            it('allows endpoint with format ControllerName@endpointName', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                builder.method(HttpMethod_1.HttpMethod.POST, '/path', 'Controller@endpoint');
                expect(builder['data'].method).toEqual(HttpMethod_1.HttpMethod.POST);
                expect(builder['data'].path).toEqual('/path');
                expect(builder['data'].endpoint).toEqual('endpoint');
                expect(builder['data'].controller).toEqual('Controller');
            });
            it('allows 4 params format with Object and endpoint name', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                const controller = {
                    getUsers() { }
                };
                builder.method(HttpMethod_1.HttpMethod.POST, '/path', controller, 'getUsers');
                expect(builder['data'].method).toEqual(HttpMethod_1.HttpMethod.POST);
                expect(builder['data'].path).toEqual('/path');
                expect(builder['data'].endpoint).toEqual('getUsers');
                expect(builder['data'].controller).toEqual(controller);
            });
            it('allows 4 params format with Controller instance and endpoint name', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                class UsersController extends Controller_1.Controller {
                    getClassName() {
                        return 'UsersController';
                    }
                    getUsers() { }
                }
                const controller = new UsersController({}, {});
                builder.method(HttpMethod_1.HttpMethod.POST, '/path', controller, 'getUsers');
                expect(builder['data'].method).toEqual(HttpMethod_1.HttpMethod.POST);
                expect(builder['data'].path).toEqual('/path');
                expect(builder['data'].endpoint).toEqual('getUsers');
                expect(builder['data'].controller).toEqual(controller);
            });
            it('allows 4 params format with Controller class and endpoint name', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                class UsersController extends Controller_1.Controller {
                    getClassName() {
                        return 'UsersController';
                    }
                    getUsers() { }
                }
                builder.method(HttpMethod_1.HttpMethod.POST, '/path', UsersController, 'getUsers');
                expect(builder['data'].method).toEqual(HttpMethod_1.HttpMethod.POST);
                expect(builder['data'].path).toEqual('/path');
                expect(builder['data'].endpoint).toEqual('getUsers');
                expect(builder['data'].controller).toEqual(UsersController);
            });
            it('does not allow endpoint in Object and but endpoint name not found', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                const controller = {
                    getUsers() { }
                };
                try {
                    builder.method(HttpMethod_1.HttpMethod.POST, '/path', controller, 'getUsersNotFound');
                }
                catch (error) {
                    expect(error).toBeInstanceOf(ReferenceError);
                    expect(error.message).toEqual('Endpoint getUsersNotFound not found');
                    return;
                }
                expect('should not reach here').toEqual('hmm');
            });
            it('does not allow endpoint with Controller instance and but endpoint name not found', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                class UsersController extends Controller_1.Controller {
                    getClassName() {
                        return 'UsersController';
                    }
                    getUsers() { }
                }
                const controller = new UsersController({}, {});
                try {
                    builder.method(HttpMethod_1.HttpMethod.POST, '/path', controller, 'getUsersNotFound');
                }
                catch (error) {
                    expect(error).toBeInstanceOf(ReferenceError);
                    expect(error.message).toEqual('Endpoint getUsersNotFound not found');
                    return;
                }
                expect('should not reach here').toEqual('hmm');
            });
            it('does not allow endpoint with Controller class and but endpoint name not found', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                class UsersController extends Controller_1.Controller {
                    getClassName() {
                        return 'UsersController';
                    }
                    getUsers() { }
                }
                try {
                    builder.method(HttpMethod_1.HttpMethod.POST, '/path', UsersController, 'getUsersNotFound');
                }
                catch (error) {
                    expect(error).toBeInstanceOf(ReferenceError);
                    expect(error.message).toEqual('Endpoint getUsersNotFound not found');
                    return;
                }
                expect('should not reach here').toEqual('hmm');
            });
            it('throws Error if endpoint is a string but not in format ControllerName@endpointName', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                try {
                    builder.method(HttpMethod_1.HttpMethod.POST, '/path', 'Controller/Endpoint');
                }
                catch (error) {
                    expect(error).toBeInstanceOf(Error);
                    expect(error.message).toEqual('Target "Controller/Endpoint" is invalid. Correct format: ControllerName@endpointName');
                    return;
                }
                expect('should not reach here').toEqual('hmm');
            });
            it('throws TypeError if somehow use method in wrong way with 3 params', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                try {
                    builder.method(HttpMethod_1.HttpMethod.POST, '/path', 123);
                }
                catch (error) {
                    expect(error).toBeInstanceOf(TypeError);
                    expect(error.message).toEqual('Invalid Route');
                    return;
                }
                expect('should not reach here').toEqual('hmm');
            });
            it('throws TypeError if somehow use method in wrong way with 4 params', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                try {
                    builder.method(HttpMethod_1.HttpMethod.POST, '/path', 123, 'test');
                }
                catch (error) {
                    expect(error).toBeInstanceOf(TypeError);
                    expect(error.message).toEqual('Invalid Route');
                    return;
                }
                expect('should not reach here').toEqual('hmm');
            });
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
            it(name + '() calls .method() function with HttpMethod.' + list[name], function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                const methodSpy = Sinon.spy(builder, 'method');
                builder[name]('path', 'controller@endpoint');
                expect(methodSpy.calledWith(list[name], 'path', 'controller@endpoint')).toBe(true);
                function handler() { }
                builder[name]('path', handler);
                expect(methodSpy.calledWith(list[name], 'path', handler)).toBe(true);
                const Controller = {
                    endpoint: function () { }
                };
                builder[name]('path', Controller, 'endpoint');
                expect(methodSpy.calledWith(list[name], 'path', Controller, 'endpoint')).toBe(true);
            });
        }
    });
});
