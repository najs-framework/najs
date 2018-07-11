import 'jest'
import * as Sinon from 'sinon'
import * as Middleware from '../../../../lib/http/middleware/built-ins/StaticMiddleware'
import * as Express from 'express'
import { ClassRegistry } from 'najs-binding'
import { FacadeContainer } from 'najs-facade'
import { PathFacade } from '../../../../lib/facades/global/PathFacade'
import { ExpressMiddlewareBase } from '../../../../lib/http/middleware/ExpressMiddlewareBase'

describe('StaticMiddleware', function() {
  it('extends ExpressMiddlewareBase', function() {
    const middleware = new Middleware.StaticMiddleware('test')
    expect(middleware).toBeInstanceOf(ExpressMiddlewareBase)
  })

  it('implements IAutoload and register automatically', function() {
    const middleware = new Middleware.StaticMiddleware('test')
    expect(middleware.getClassName()).toEqual(Middleware.StaticMiddleware.className)
    expect(ClassRegistry.has(Middleware.StaticMiddleware.className)).toBe(true)
  })

  describe('protected .parseParams()', function() {
    it('calls Path.public() and set publicPath = / if there is no options', function() {
      PathFacade.shouldReceive('public')
        .withArgs()
        .once()
      const middleware = new Middleware.StaticMiddleware('test')
      expect(middleware['publicPath']).toEqual('/')
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('parse directory to this.directory with Path.cwd()', function() {
      PathFacade.shouldReceive('cwd')
        .withArgs('public')
        .once()
      const middleware = new Middleware.StaticMiddleware('test', '~/public')
      expect(middleware['publicPath']).toEqual('/')
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('can pass directory without ~/', function() {
      PathFacade.shouldReceive('cwd')
        .withArgs('any')
        .once()
      const middleware = new Middleware.StaticMiddleware('test', 'any', '/path')
      expect(middleware['publicPath']).toEqual('/path')
      FacadeContainer.verifyAndRestoreAllFacades()
    })
  })

  describe('.createMiddleware()', function() {
    it('calls Express.static() and passes this.directory', function() {
      const staticStub = Sinon.stub(Express, 'static')
      staticStub.returns(undefined)
      const middleware = new Middleware.StaticMiddleware('test')
      middleware['directory'] = '/tmp'
      middleware.createMiddleware()
      expect(staticStub.calledWith('/tmp'))
      staticStub.restore()
    })
  })

  describe('.native()', function() {
    it('only supports app level middleware, calls Express.use(publicPath, this.createMiddleware())', function() {
      const app = {
        use() {}
      }
      const driver = {
        getNativeDriver() {
          return app
        }
      }

      const useSpy = Sinon.spy(app, 'use')
      const middleware = new Middleware.StaticMiddleware('test')
      middleware['publicPath'] = '/any'

      const createMiddlewareStub = Sinon.stub(middleware, 'createMiddleware')
      createMiddlewareStub.returns('middleware')

      middleware.native(<any>driver)
      expect(useSpy.calledWith('/any', 'middleware')).toBe(true)
    })
  })
})
