"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const HttpMethod_1 = require("../../lib/http/HttpMethod");
const RouteBuilder_1 = require("../../lib/http/routing/RouteBuilder");
describe('RouteBuilder', function () {
    describe('constructor', function () {
        it('can create new builder without argument', function () {
            const builder = new RouteBuilder_1.RouteBuilder();
            expect(builder['data'].method).toEqual(HttpMethod_1.HttpMethod.GET);
            expect(builder['data'].path).toEqual('');
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
            it('returns private.data', function () {
                const builder = new RouteBuilder_1.RouteBuilder('GET', '/');
                expect(builder.getRouteData() === builder['data']).toBe(true);
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
        // TODO: write test
        describe('use()', function () {
            const builder = new RouteBuilder_1.RouteBuilder();
            builder.use('test');
        });
        // TODO: write test
        describe('middleware()', function () {
            const builder = new RouteBuilder_1.RouteBuilder();
            builder.middleware('test');
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
    describe('IRouteGrammarGroup functions', function () {
        // TODO: write test
        describe('group()', function () {
            it('does something', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                builder.group(function () { });
                builder.group(function () { });
            });
        });
    });
    describe('IRouteGrammarNamed functions', function () {
        // TODO: write test
        describe('name()', function () {
            it('does something', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                builder.name('test');
            });
        });
    });
    describe('IRouteGrammarVerbs functions', function () {
        describe('method()', function () {
            // TODO: write test
            it('does something', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                builder.method('GET');
            });
        });
        describe('get()', function () {
            it('does something', function () {
                const builder = new RouteBuilder_1.RouteBuilder();
                builder.get('/');
            });
        });
    });
});
//# sourceMappingURL=RouteBuilder.test.js.map