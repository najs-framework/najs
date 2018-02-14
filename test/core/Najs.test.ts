import 'jest'
import * as Make from '../../lib/core/make'
import * as Sinon from 'sinon'
import * as Path from 'path'
import { Application } from '../../lib/core/Application'
import { Najs } from '../../lib/core/Najs'
import { EventEmitter } from 'events'
import { SystemClass } from '../../lib'

describe('Najs', function() {
  it('is an instance of NajsFramework class which is not a public class', function() {
    expect(typeof Najs === 'object').toBe(true)
    class FakeHttpDriver {
      static className = SystemClass.HttpDriver
      start() {}
    }
    Najs['app'].register(FakeHttpDriver)
  })

  describe('NajsFramework', function() {
    describe('constructor()', function() {
      it('initials cwd = ../../../../', function() {
        expect(Najs['cwd']).toEqual(Path.resolve(__dirname, '..', '..', '..', '..'))
      })
      it('initials "internalEventEmitter" = EventEmitter', function() {
        expect(Najs['internalEventEmitter']).toBeInstanceOf(EventEmitter)
      })
      it('initials "serviceProviders" = []', function() {
        expect(Najs['serviceProviders']).toEqual([])
      })
      it('initials "app" = new Application()', function() {
        expect(Najs['app']).toBeInstanceOf(Application)
      })
    })

    describe('.workingDirectory()', function() {
      it('is chain-able and sets "cwd" of application', function() {
        expect(Najs.workingDirectory('test') === Najs).toBe(true)
        expect(Najs['cwd']).toEqual('test')
      })
    })

    describe('.classes()', function() {
      it('is chain-able', function() {
        expect(Najs.classes() === Najs).toBe(true)
      })

      it('calls native .require(path) to load resources, path is resolved base on "cwd"', function() {
        Najs.workingDirectory(__dirname)
        expect(global['test_require_function_1']).toBeUndefined()
        expect(global['test_require_function_2']).toBeUndefined()
        Najs.classes('./files/require_one', './files/require_two')
        expect(global['test_require_function_1']).toEqual('require_function_1')
        expect(global['test_require_function_2']).toEqual('require_function_2')
      })
    })

    describe('.providers()', function() {
      it('calls .resolveProvider() and skipped if the result is undefined', function() {
        const resolveProviderStub = Sinon.stub(Najs, <any>'resolveProvider')
        resolveProviderStub.returns(undefined)
        expect(Najs['serviceProviders']).toHaveLength(0)
        Najs.providers(['test'])
        expect(Najs['serviceProviders']).toHaveLength(0)
        resolveProviderStub.restore()
      })

      it('calls .resolveProvider() and push to "serviceProviders" if the result is not undefined', function() {
        const result = {}
        const resolveProviderStub = Sinon.stub(Najs, <any>'resolveProvider')
        resolveProviderStub.returns(result)
        expect(Najs['serviceProviders']).toHaveLength(0)
        Najs.providers(['test'])
        expect(Najs['serviceProviders']).toHaveLength(1)
        expect(Najs['serviceProviders'][0] === result).toBe(true)
        Najs['serviceProviders'] = []
        resolveProviderStub.restore()
      })
    })

    describe('.on()', function() {
      it('is chain-able and calls "internalEventEmitter".on(...)', function() {
        const internalEventEmitterOnSpy = Sinon.spy(Najs['internalEventEmitter'], 'on')

        const handler = () => {}
        expect(Najs.on('start', handler) === Najs).toBe(true)

        expect(internalEventEmitterOnSpy.calledWith('start', handler)).toBe(true)
        internalEventEmitterOnSpy.restore()
      })
    })

    describe('.start()', function() {
      it('fires event "start" then calls registerServiceProviders, then bootServiceProviders() and fires "started"', async function() {
        const registerServiceProvidersSpy = Sinon.spy(Najs, <any>'registerServiceProviders')
        const bootServiceProvidersSpy = Sinon.spy(Najs, <any>'bootServiceProviders')
        const fireEventIfNeededSpy = Sinon.spy(Najs, <any>'fireEventIfNeeded')
        await Najs.start()

        expect(registerServiceProvidersSpy.called).toBe(true)
        expect(bootServiceProvidersSpy.called).toBe(true)
        expect(fireEventIfNeededSpy.firstCall.args[0] === 'start').toBe(true)
        expect(fireEventIfNeededSpy.firstCall.args[1] === Najs).toBe(true)
        expect(fireEventIfNeededSpy.secondCall.args[0] === 'started').toBe(true)
        expect(fireEventIfNeededSpy.secondCall.args[1] === Najs).toBe(true)

        registerServiceProvidersSpy.restore()
        bootServiceProvidersSpy.restore()
        fireEventIfNeededSpy.restore()
      })

      it('calls handleError() if there is any error', async function() {
        Najs['serviceProviders'] = [{}]
        const handleErrorStub = Sinon.stub(Najs, <any>'handleError')
        await Najs.start()
        expect(handleErrorStub.called).toBe(true)
        handleErrorStub.restore()
        Najs['serviceProviders'] = []
      })
    })

    describe('protected .handleError()', function() {
      beforeAll(function() {
        Najs['serviceProviders'] = [{}]
      })

      afterAll(function() {
        Najs['serviceProviders'] = []
      })

      it('fires event "crash" and returns if there is a handler', async function() {
        const eventEmitter = new EventEmitter()
        const emitSpy = Sinon.spy(eventEmitter, 'emit')
        Najs['internalEventEmitter'] = eventEmitter

        eventEmitter.on('crash', () => {})
        try {
          await Najs.start()
        } catch (error) {
          expect('should not reach here').toEqual('hmm')
        }
        expect(emitSpy.called).toBe(true)
      })

      it('fires event "crashed" and returns if there is a handler', async function() {
        const eventEmitter = new EventEmitter()
        const emitSpy = Sinon.spy(eventEmitter, 'emit')
        Najs['internalEventEmitter'] = eventEmitter

        eventEmitter.on('crashed', () => {})
        try {
          await Najs.start()
        } catch (error) {
          expect('should not reach here').toEqual('hmm')
        }
        expect(emitSpy.called).toBe(true)
      })

      it('throws error if there is no "crash"/"crashed" event handler', async function() {
        Najs['internalEventEmitter'] = new EventEmitter()
        try {
          await Najs.start()
        } catch (error) {
          expect(error).toBeInstanceOf(Error)
          return
        }
        expect('should not reach here').toEqual('hmm')
      })
    })

    describe('protected .resolveProvider()', function() {
      it('calls make() if provider is a string', function() {
        const makeStub = Sinon.stub(Make, 'make')
        Najs['resolveProvider']('ClassName')
        const call = makeStub.getCalls()[0]
        expect(call.args[0] === 'ClassName').toBe(true)
        expect(call.args[1][0] === Najs['app']).toBe(true)
        makeStub.restore()
      })

      it('calls Reflect.construct() if provider is typeof ServiceProvider', function() {
        const fakeServiceProvider = function(app: any, func: any) {}
        const constructStub = Sinon.stub(Reflect, 'construct')
        Najs['resolveProvider'](fakeServiceProvider)
        const call = constructStub.getCalls()[0]
        expect(call.args[0] === fakeServiceProvider).toBe(true)
        expect(call.args[1][0] === Najs['app']).toBe(true)
        constructStub.restore()
      })
    })

    describe('protected .registerServiceProviders()', function() {
      it('loops "serviceProviders" and call ServiceProvider.register(), fire "registered" for each one', async function() {
        const ServiceProviderOne = { async register() {} }
        const ServiceProviderTwo = { async register() {} }
        const registerOneSpy = Sinon.spy(ServiceProviderOne, 'register')
        const registerTwoSpy = Sinon.spy(ServiceProviderTwo, 'register')
        const fireEventIfNeededSpy = Sinon.spy(Najs, <any>'fireEventIfNeeded')

        Najs['serviceProviders'] = [ServiceProviderOne, ServiceProviderTwo]
        await Najs['registerServiceProviders']()

        expect(registerOneSpy.called).toBe(true)
        expect(registerTwoSpy.called).toBe(true)
        expect(fireEventIfNeededSpy.firstCall.args[0] === 'registered').toBe(true)
        expect(fireEventIfNeededSpy.firstCall.args[1] === Najs).toBe(true)
        expect(fireEventIfNeededSpy.firstCall.args[2] === ServiceProviderOne).toBe(true)
        expect(fireEventIfNeededSpy.secondCall.args[0] === 'registered').toBe(true)
        expect(fireEventIfNeededSpy.secondCall.args[1] === Najs).toBe(true)
        expect(fireEventIfNeededSpy.secondCall.args[2] === ServiceProviderTwo).toBe(true)
        fireEventIfNeededSpy.restore()
      })
    })

    describe('protected .bootServiceProviders()', function() {
      it('loops "serviceProviders" and call ServiceProvider.register(), fire "registered" for each one', async function() {
        const ServiceProviderOne = { async boot() {} }
        const ServiceProviderTwo = { async boot() {} }
        const bootOneSpy = Sinon.spy(ServiceProviderOne, 'boot')
        const bootTwoSpy = Sinon.spy(ServiceProviderTwo, 'boot')
        const fireEventIfNeededSpy = Sinon.spy(Najs, <any>'fireEventIfNeeded')

        Najs['serviceProviders'] = [ServiceProviderOne, ServiceProviderTwo]
        await Najs['bootServiceProviders']()

        expect(bootOneSpy.called).toBe(true)
        expect(bootTwoSpy.called).toBe(true)
        expect(fireEventIfNeededSpy.firstCall.args[0] === 'booted').toBe(true)
        expect(fireEventIfNeededSpy.firstCall.args[1] === Najs).toBe(true)
        expect(fireEventIfNeededSpy.firstCall.args[2] === ServiceProviderOne).toBe(true)
        expect(fireEventIfNeededSpy.secondCall.args[0] === 'booted').toBe(true)
        expect(fireEventIfNeededSpy.secondCall.args[1] === Najs).toBe(true)
        expect(fireEventIfNeededSpy.secondCall.args[2] === ServiceProviderTwo).toBe(true)
        fireEventIfNeededSpy.restore()
      })
    })

    describe('protected .fireEventIfNeeded()', function() {
      it('fire event of "internalEventEmitter" if has handlers and returns true, otherwise returns false', function() {
        const eventEmitter = new EventEmitter()
        const emitSpy = Sinon.spy(eventEmitter, 'emit')

        Najs['internalEventEmitter'] = eventEmitter
        expect(Najs['fireEventIfNeeded']('test')).toBe(false)
        eventEmitter.on('test', function() {})
        expect(Najs['fireEventIfNeeded']('test', 'something')).toBe(true)
        expect(emitSpy.calledWith('test', 'something')).toBe(true)
      })
    })
  })
})
