import 'jest'
import * as Sinon from 'sinon'
import * as Register from '../../lib/core/register'
import * as Make from '../../lib/core/make'
import * as Bind from '../../lib/core/bind'
import * as Path from 'path'
import { NajsFacade as Najs } from '../../lib/core/NajsFacade'
import { IConfig } from 'config'
import { register } from '../../lib/core/register'
import { HttpDriverClass, ConfigurationKeys } from './../../lib/constants'

class Test {
  static className: string = 'Test'
}

class FakeHttpDriver {
  static className: string = 'FakeHttpDriver'
  start(options: Object) {}
}

const config: IConfig = {
  get<T>(setting: string): T {
    if (setting === 'port') {
      return <any>3001
    }
    return <any>undefined
  },
  has(setting: string): boolean {
    if (setting === 'port') {
      return true
    }
    return false
  },
  util: <any>{}
}

const DefaultOptions = {
  port: 3000
}
describe('Najs', function() {
  describe('.use(options: Object)', function() {
    it('assigns default options if use is not called', function() {
      expect(Najs['options']).toEqual(DefaultOptions)
    })

    it('assigns default options if options is empty', function() {
      Najs.use({})
      expect(Najs['options']).toEqual(DefaultOptions)
    })

    it('assigns default options if options is empty', function() {
      Najs.use({})
      expect(Najs['options']).toEqual(DefaultOptions)
    })

    it('applies options if argument is Partial<NajsOptions>', function() {
      Najs.use({ port: 30000 })
      expect(Najs['options']).toEqual(Object.assign({}, DefaultOptions, { port: 30000 }))
    })

    it('does not accepts IConfig which missing get()', function() {
      Najs.use(<any>{ has: 'any' })
      expect(Najs['config'] === config).toBe(false)
      expect(Najs['options']['has']).toEqual('any')
    })

    it('does not accepts IConfig which missing has()', function() {
      Najs.use(<any>{ get: 'any' })
      expect(Najs['config'] === config).toBe(false)
      expect(Najs['options']['get']).toEqual('any')
    })

    it('applies config if argument is IConfig', function() {
      Najs.use(config)
      expect(Najs['config'] === config).toBe(true)
    })

    it('reads and applies settings when config if argument is IConfig', function() {
      Najs.use(config)
      expect(Najs['config'] === config).toBe(true)
      expect(Najs['options']).toEqual(Object.assign({}, DefaultOptions, { port: 3001 }))
    })
  })

  describe('.register()', function() {
    it('proxies register() function', function() {
      const registerSpy = Sinon.spy(Register, 'register')

      Najs.register(FakeHttpDriver)
      expect(registerSpy.calledWith(FakeHttpDriver)).toBe(true)

      Najs.register(Test, 'Test')
      expect(registerSpy.calledWith(Test, 'Test')).toBe(true)

      Najs.register(Test, 'Something', false)
      expect(registerSpy.calledWith(Test, 'Something', false)).toBe(true)

      Najs.register(Test, 'SomethingNew', true, false)
      expect(registerSpy.calledWith(Test, 'SomethingNew', true, false)).toBe(true)
    })
  })

  describe('.make()', function() {
    it('proxies make() function', function() {
      const makeSpy = Sinon.spy(Make, 'make')
      Najs.make(Test)
      expect(makeSpy.calledWith(Test)).toBe(true)

      Najs.make('Test')
      expect(makeSpy.calledWith('Test')).toBe(true)

      Najs.make('Something', { data: 'any' })
      expect(makeSpy.calledWith('Something', { data: 'any' })).toBe(true)
    })
  })

  describe('.bind()', function() {
    it('proxies bind() function', function() {
      const bindSpy = Sinon.spy(Bind, 'bind')
      Najs.bind('Cache', 'RedisCached')
      expect(bindSpy.calledWith('Cache', 'RedisCached')).toBe(true)

      const servicePoolInstanceCreator = function() {}
      Najs.bind('ServicePool', servicePoolInstanceCreator)
      expect(bindSpy.calledWith('ServicePool', servicePoolInstanceCreator)).toBe(true)
    })
  })

  describe('.hasConfig()', function() {
    it('throws ReferenceError if config is not register yet', function() {
      Najs['config'] = <any>undefined
      try {
        Najs.hasConfig('test')
      } catch (error) {
        expect(error).toBeInstanceOf(ReferenceError)
        expect(error.message).toEqual('Please register config instance firstly: Najs.use(require("config"))')
        return
      }
      expect('should not reach this line').toEqual('hum')
    })

    it('proxies Najs.config.has() function', function() {
      const hasSpy = Sinon.spy(config, 'has')
      expect(Najs.use(config).hasConfig('port')).toBe(true)
      expect(hasSpy.calledWith('port')).toBe(true)
      hasSpy.restore()
    })
  })

  describe('.getConfig()', function() {
    it('throws ReferenceError if config is not register yet', function() {
      Najs['config'] = <any>undefined
      try {
        Najs.getConfig('test')
      } catch (error) {
        expect(error).toBeInstanceOf(ReferenceError)
        expect(error.message).toEqual('Please register config instance firstly: Najs.use(require("config"))')
        return
      }
      expect('should not reach this line').toEqual('hum')
    })

    it('proxies Najs.config.get() directly if there is no default value', function() {
      const getSpy = Sinon.spy(config, 'get')
      expect(Najs.use(config).getConfig('port')).toBe(3001)
      expect(getSpy.calledWith('port')).toBe(true)
      getSpy.restore()
    })

    it('uses Najs.config.has() for checking key exist or not before using get', function() {
      const hasSpy = Sinon.spy(config, 'has')
      const getSpy = Sinon.spy(config, 'get')
      expect(Najs.use(config).getConfig('httpDriver', 'test')).toEqual('test')
      expect(hasSpy.calledWith('httpDriver')).toBe(true)

      expect(Najs.getConfig('port', 3002)).toEqual(3001)
      expect(hasSpy.calledWith('port')).toBe(true)
      expect(getSpy.calledWith('port')).toBe(true)
    })
  })

  describe('.path()', function() {
    it('returns "cwd" in config file if there are no parameters', function() {
      const getConfigStub = Sinon.stub(Najs, 'getConfig')
      Najs.path()
      // Directory structure of the project
      //   + najs/dist
      //     - lib
      //       - core
      //         . NajsFacade
      //     - test
      //       - core
      //         . NajsFacade.test.js
      // => path will be the same path in implementation
      expect(getConfigStub.calledWith(ConfigurationKeys.CWD, Path.join(__dirname, '..', '..', '..', '..'))).toBe(true)
      getConfigStub.restore()
    })

    const systemPaths = {
      app: 'app',
      base: '',
      config: 'config',
      layout: Path.join('resources', 'view', 'layout'),
      public: 'public',
      resource: 'resources',
      route: 'routes',
      storage: Path.join('app', 'storage'),
      view: Path.join('resources', 'view')
    }
    for (const name in systemPaths) {
      it('allows to solve System Path "' + name + '" with paths since 2nd param', function() {
        const cwd = Path.join(__dirname, '..', '..', '..', '..')

        const getConfigStub = Sinon.stub(Najs, 'getConfig')
        getConfigStub.withArgs(ConfigurationKeys.CWD, cwd).returns('/')
        getConfigStub.returns(systemPaths[name])

        expect(Najs.path(name)).toEqual(Path.join('/', systemPaths[name]))
        const calls = getConfigStub.getCalls()
        expect(calls[1].args).toEqual([ConfigurationKeys.Paths[name], systemPaths[name]])

        expect(Najs.path(name, 'test')).toEqual(Path.join('/', systemPaths[name], 'test'))
        expect(Najs.path(name, 'test', 'any', 'thing')).toEqual(
          Path.join('/', systemPaths[name], 'test', 'any', 'thing')
        )
        expect(Najs.path(name, 'test', 'any', 'thing/else')).toEqual(
          Path.join('/', systemPaths[name], 'test', 'any', 'thing/else')
        )
        getConfigStub.restore()
      })
    }

    it('allows to solve paths since 1st param if the param is not system path', function() {
      const cwd = Path.join(__dirname, '..', '..', '..', '..')
      const getConfigStub = Sinon.stub(Najs, 'getConfig')
      getConfigStub.withArgs(ConfigurationKeys.CWD, cwd).returns('/')

      expect(Najs.path('any')).toEqual(Path.join('/', 'any'))
      expect(Najs.path('any', 'thing')).toEqual(Path.join('/', 'any', 'thing'))
      expect(Najs.path('any', 'thing/else')).toEqual(Path.join('/', 'any', 'thing/else'))
      getConfigStub.restore()
    })
  })

  describe('.start(options?: Object)', function() {
    it('called use(options) if provided', function() {
      register(FakeHttpDriver, HttpDriverClass)
      const useSpy = Sinon.spy(Najs, 'use')
      Najs.start({
        host: 'test.com'
      })
      expect(
        useSpy.calledWith({
          host: 'test.com'
        })
      ).toBe(true)
    })

    it('use Najs.options if do not pass options', function() {
      Najs.use({
        host: 'test.com'
      })
      Najs.start()
    })
  })
})
