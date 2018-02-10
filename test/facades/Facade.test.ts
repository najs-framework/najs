import 'jest'
import * as Sinon from 'sinon'
import { Facade } from '../../lib/facades/Facade'
// import { AppFacade } from './../../lib/facades/global/AppFacade'

describe('Facade', function() {
  describe('Facade.create()', function() {
    it('creates a facade by assume that facade instance already in container[key]', function() {
      const container = { key: {} }
      const key = 'key'
      const instanceCreator = () => {}
      const facade = Facade.create(container, key, instanceCreator)
      expect(facade === container[key]).toBe(true)
    })

    it('calls instanceCreator if container[key] is not found', function() {
      const container = {}
      const instance = {}
      const instanceCreator = () => {
        return instance
      }
      const instanceCreatorSpy = Sinon.spy(instanceCreator)
      const facade = Facade.create(container, 'key', instanceCreatorSpy)
      expect(facade === container['key']).toBe(true)
      expect(instanceCreatorSpy.called).toBe(true)
    })

    it('assigns container, key, instanceCreator into facade instance', function() {
      const container = { key: {} }
      const key = 'key'
      const instanceCreator = () => {}
      const facade = Facade.create(container, key, instanceCreator)
      expect(facade === container[key]).toBe(true)
      expect(facade['container'] === container).toBe(true)
      expect(facade['accessorKey'] === key).toBe(true)
      expect(facade['facadeInstanceCreator'] === instanceCreator).toBe(true)
    })
  })

  describe('.spy()', function() {
    it('creates a spy by using Sinon.spy() and put the result to createdSpies bag', function() {
      class FacadeClass extends Facade {
        method() {}
      }
      const instance = new FacadeClass()
      const container = { key: instance }
      const key = 'key'
      const instanceCreator = () => {
        return instance
      }
      const facade = Facade.create(container, key, instanceCreator)

      expect(facade['createdSpies']).toEqual({})

      const result = facade.spy('method')
      expect(result['isSinonProxy']).toBe(true)
      expect(facade['createdSpies']['method'] === result).toBe(true)
      expect(facade['method'] === result).toBe(true)
      facade.restoreFacade()
    })
  })

  describe('.createStub()', function() {
    it('creates a spy by using Sinon.stub() and put the result to createdStubs bag', function() {
      class FacadeClass extends Facade {
        method() {}
      }
      const instance = new FacadeClass()
      const container = { key: instance }
      const key = 'key'
      const instanceCreator = () => {
        return instance
      }
      const facade = Facade.create(container, key, instanceCreator)

      expect(facade['createdStubs']).toEqual({})

      const result = facade.createStub('method')
      expect(result['isSinonProxy']).toBe(true)
      expect(facade['createdStubs']['method'] === result).toBe(true)
      expect(facade['method'] === result).toBe(true)
      facade.restoreFacade()
    })
  })

  describe('.restoreFacade()', function() {
    it('loops all createdSpies + createdStubs and calls restore function', function() {
      class FacadeClass extends Facade {
        methodSpy() {}
        methodStub() {}
      }
      const instance = new FacadeClass()
      const container = { key: instance }
      const key = 'key'
      const instanceCreator = () => {
        return instance
      }
      const facade = Facade.create(container, key, instanceCreator)

      expect(facade['createdSpies']).toEqual({})

      const spy = facade.spy('methodSpy')
      expect(facade['methodSpy'].name).toEqual(spy.name)

      const stub = facade.createStub('methodStub')
      expect(facade['methodStub'].name).toEqual(stub.name)
      facade.restoreFacade()
      expect(facade['methodSpy'].name).toEqual(FacadeClass.prototype.methodSpy.name)
      expect(facade['methodStub'].name).toEqual(FacadeClass.prototype.methodStub.name)
    })
  })
})
