"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Middleware = require("../../../../lib/http/middleware/built-ins/StaticMiddleware");
const Express = require("express");
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const PathFacade_1 = require("./../../../../lib/facades/global/PathFacade");
const ExpressMiddlewareBase_1 = require("../../../../lib/http/middleware/ExpressMiddlewareBase");
describe('StaticMiddleware', function () {
    it('extends ExpressMiddlewareBase', function () {
        const middleware = new Middleware.StaticMiddleware('test');
        expect(middleware).toBeInstanceOf(ExpressMiddlewareBase_1.ExpressMiddlewareBase);
    });
    it('implements IAutoload and register automatically', function () {
        const middleware = new Middleware.StaticMiddleware('test');
        expect(middleware.getClassName()).toEqual(Middleware.StaticMiddleware.className);
        expect(najs_binding_1.ClassRegistry.has(Middleware.StaticMiddleware.className)).toBe(true);
    });
    describe('protected .parseParams()', function () {
        it('calls Path.public() and set publicPath = / if there is no options', function () {
            PathFacade_1.PathFacade.shouldReceive('public')
                .withArgs()
                .once();
            const middleware = new Middleware.StaticMiddleware('test');
            expect(middleware['publicPath']).toEqual('/');
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
        it('parse directory to this.directory with Path.cwd()', function () {
            PathFacade_1.PathFacade.shouldReceive('cwd')
                .withArgs('public')
                .once();
            const middleware = new Middleware.StaticMiddleware('test', '~/public');
            expect(middleware['publicPath']).toEqual('/');
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
        it('can pass directory without ~/', function () {
            PathFacade_1.PathFacade.shouldReceive('cwd')
                .withArgs('any')
                .once();
            const middleware = new Middleware.StaticMiddleware('test', 'any', '/path');
            expect(middleware['publicPath']).toEqual('/path');
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
    });
    describe('.createMiddleware()', function () {
        it('calls Express.static() and passes this.directory', function () {
            const staticStub = Sinon.stub(Express, 'static');
            staticStub.returns(undefined);
            const middleware = new Middleware.StaticMiddleware('test');
            middleware['directory'] = '/tmp';
            middleware.createMiddleware();
            expect(staticStub.calledWith('/tmp'));
            staticStub.restore();
        });
    });
    describe('.native()', function () {
        it('only supports app level middleware, calls Express.use(publicPath, this.createMiddleware())', function () {
            const app = {
                use() { }
            };
            const driver = {
                getNativeDriver() {
                    return app;
                }
            };
            const useSpy = Sinon.spy(app, 'use');
            const middleware = new Middleware.StaticMiddleware('test');
            middleware['publicPath'] = '/any';
            const createMiddlewareStub = Sinon.stub(middleware, 'createMiddleware');
            createMiddlewareStub.returns('middleware');
            middleware.native(driver);
            expect(useSpy.calledWith('/any', 'middleware')).toBe(true);
        });
    });
});
