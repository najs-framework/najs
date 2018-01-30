"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const RouteFacade_1 = require("../../../lib/http/routing/RouteFacade");
const RouteCollection_1 = require("../../../lib/http/routing/RouteCollection");
describe('RouteCollection', function () {
    it('is initialized with isChanged = false and empty routes, routeData', function () {
        expect(RouteCollection_1.RouteCollection['isChanged']).toBe(false);
        expect(RouteCollection_1.RouteCollection['routes']).toEqual([]);
        expect(RouteCollection_1.RouteCollection['routeData']).toEqual([]);
    });
    it('sets isChanged to true whenever register() get called', function () {
        expect(RouteCollection_1.RouteCollection['isChanged']).toBe(false);
        RouteFacade_1.RouteFacade.group(function () { });
        expect(RouteCollection_1.RouteCollection['isChanged']).toBe(true);
    });
    it('sets isChanged to false whenever getData() get called', function () {
        RouteCollection_1.RouteCollection['isChanged'] = true;
        RouteCollection_1.RouteCollection.getData();
        expect(RouteCollection_1.RouteCollection['isChanged']).toBe(false);
    });
    it('rebuilds fresh instance of data if isChanged = true', function () {
        RouteFacade_1.RouteFacade.get('/test', 'Controller@endpoint');
        const dataFirstCall = RouteCollection_1.RouteCollection.getData();
        const routeDataPointerFirstCall = RouteCollection_1.RouteCollection['routeData'];
        const routeDataNamedPointerFirstCall = RouteCollection_1.RouteCollection['routeDataNamed'];
        RouteCollection_1.RouteCollection['isChanged'] = true;
        const dataSecondCall = RouteCollection_1.RouteCollection.getData();
        const routeDataPointerSecondCall = RouteCollection_1.RouteCollection['routeData'];
        const routeDataNamedPointerSecondCall = RouteCollection_1.RouteCollection['routeDataNamed'];
        expect(dataFirstCall === dataSecondCall).toBe(false);
        expect(routeDataPointerFirstCall === routeDataPointerSecondCall).toBe(false);
        expect(routeDataNamedPointerFirstCall === routeDataNamedPointerSecondCall).toBe(false);
    });
    it('never rebuilds data if isChanged = false', function () {
        RouteFacade_1.RouteFacade.get('/test', 'Controller@endpoint');
        const dataFirstCall = RouteCollection_1.RouteCollection.getData();
        const routeDataPointerFirstCall = RouteCollection_1.RouteCollection['routeData'];
        const routeDataNamedPointerFirstCall = RouteCollection_1.RouteCollection['routeDataNamed'];
        const dataSecondCall = RouteCollection_1.RouteCollection.getData();
        const routeDataPointerSecondCall = RouteCollection_1.RouteCollection['routeData'];
        const routeDataNamedPointerSecondCall = RouteCollection_1.RouteCollection['routeDataNamed'];
        expect(dataFirstCall === dataSecondCall).toBe(true);
        expect(routeDataPointerFirstCall === routeDataPointerSecondCall).toBe(true);
        expect(routeDataNamedPointerFirstCall === routeDataNamedPointerSecondCall).toBe(true);
    });
    it('created routeDataNamed hash object for named routes, .hasName() use for check the named route exists or not', function () {
        RouteCollection_1.RouteCollection['routes'] = [];
        expect(RouteCollection_1.RouteCollection.hasName('named')).toBe(false);
        RouteFacade_1.RouteFacade.get('/test', 'Controller@endpoint');
        RouteFacade_1.RouteFacade.post('/test', 'Controller@endpoint').name('named');
        expect(RouteCollection_1.RouteCollection.getData()).toHaveLength(2);
        expect(RouteCollection_1.RouteCollection['routeDataNamed']).toEqual({
            named: {
                name: 'named',
                method: 'POST',
                path: '/test',
                prefix: '',
                middleware: [],
                controller: 'Controller',
                endpoint: 'endpoint'
            }
        });
        expect(RouteCollection_1.RouteCollection.hasName('named')).toBe(true);
        expect(RouteCollection_1.RouteCollection.hasName('not-found')).toBe(false);
    });
    describe('hasName()', function () {
        it('can be used to check named route exists or not after building data', function () {
            RouteCollection_1.RouteCollection['routes'] = [];
            RouteFacade_1.RouteFacade.get('/test', 'Controller@endpoint');
            RouteFacade_1.RouteFacade.post('/test', 'Controller@endpoint').name('named');
            expect(RouteCollection_1.RouteCollection.hasName('named')).toBe(true);
            expect(RouteCollection_1.RouteCollection.hasName('not-found')).toBe(false);
        });
    });
    describe('findOrFail()', function () {
        it('builds data by calls getData() and uses hasName() for checking', function () {
            RouteCollection_1.RouteCollection['routes'] = [];
            RouteFacade_1.RouteFacade.post('/test', 'Controller@endpoint').name('named');
            RouteCollection_1.RouteCollection['isChanged'] = true;
            RouteCollection_1.RouteCollection['routeData'] = [];
            RouteCollection_1.RouteCollection['routeDataNamed'] = {};
            expect(RouteCollection_1.RouteCollection.findOrFail('named')).toEqual({
                name: 'named',
                method: 'POST',
                path: '/test',
                prefix: '',
                middleware: [],
                controller: 'Controller',
                endpoint: 'endpoint'
            });
        });
        it('throws an Error if route not found', function () {
            RouteCollection_1.RouteCollection['routes'] = [];
            RouteCollection_1.RouteCollection['routeData'] = [];
            RouteCollection_1.RouteCollection['routeDataNamed'] = {};
            try {
                RouteCollection_1.RouteCollection.findOrFail('named');
            }
            catch (error) {
                expect(error).toBeInstanceOf(Error);
                return;
            }
            expect('should not reach this line').toEqual('hum');
        });
    });
});
