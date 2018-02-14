import 'jest'
import * as Sinon from 'sinon'
import { FacadeContainer } from '../../lib/facades/FacadeContainer'

describe('FacadeContainer', function() {
  describe('.markFacadeWasUsed()', function() {
    it('creates "usedFacades" based on "type" dynamically', function() {
      const container = new FacadeContainer()

      expect(container['usedFacades']).toBeUndefined()
      container['markFacadeWasUsed']('test', 'spy')
      expect(typeof container['usedFacades'] === 'undefined').toBe(false)
      expect(container['usedFacades']['spy']).toEqual(['test'])
      expect(container['usedFacades']['stub']).toBeUndefined()
      expect(container['usedFacades']['mock']).toBeUndefined()

      container['markFacadeWasUsed']('test', 'stub')
      expect(container['usedFacades']['spy']).toEqual(['test'])
      expect(container['usedFacades']['stub']).toEqual(['test'])
      expect(container['usedFacades']['mock']).toBeUndefined()

      container['markFacadeWasUsed']('test', 'spy')
      expect(container['usedFacades']['spy']).toEqual(['test', 'test'])
      expect(container['usedFacades']['stub']).toEqual(['test'])
      expect(container['usedFacades']['mock']).toBeUndefined()
    })
  })

  describe('.verifyMocks()', function() {
    it('does nothing if "usedFacades" or "usedFacades".mock is not found', function() {
      const container = new FacadeContainer()
      const mock = { verify() {} }
      container['test_facade'] = {
        createdMocks: [mock]
      }

      const verifySpy = Sinon.spy(mock, 'verify')
      container['verifyMocks']()
      expect(verifySpy.called).toBe(false)

      container['usedFacades'] = {}
      container['verifyMocks']()
      expect(verifySpy.called).toBe(false)
    })

    it('does nothing if "accessorKey" not found in container', function() {
      const container = new FacadeContainer()
      const mock = { verify() {} }
      container['usedFacades'] = { mock: ['not-found'] }
      container['test_facade'] = {
        createdMocks: [mock]
      }

      const verifySpy = Sinon.spy(mock, 'verify')
      container['verifyMocks']()
      expect(verifySpy.called).toBe(false)
    })

    it('does nothing if "accessorKey".createdMocks not found', function() {
      const container = new FacadeContainer()
      const mock = { verify() {} }
      container['usedFacades'] = { mock: ['test_facade'] }
      container['test_facade'] = {
        notCreatedMocks: [mock]
      }

      const verifySpy = Sinon.spy(mock, 'verify')
      container['verifyMocks']()
      expect(verifySpy.called).toBe(false)
    })

    it('calls verify() for each instance in "createdMocks", just only one time', function() {
      const container = new FacadeContainer()
      const mock = { verify() {} }
      container['usedFacades'] = { mock: ['test_facade', 'test_facade'] }
      container['test_facade'] = {
        createdMocks: [mock]
      }

      const verifySpy = Sinon.spy(mock, 'verify')
      container['verifyMocks']()
      expect(verifySpy.calledOnce).toBe(true)
    })
  })

  describe('.restoreFacades()', function() {
    it('does nothing if "usedFacades" is not found', function() {
      const container = new FacadeContainer()
      const facade = { restoreFacade() {} }
      container['test_facade'] = facade

      const restoreFacadeSpy = Sinon.spy(facade, 'restoreFacade')
      container['restoreFacades']()
      expect(restoreFacadeSpy.called).toBe(false)
    })

    it('merges and distinct facade instance, then loops all and call .restoreFacades()', function() {
      const container = new FacadeContainer()
      const facade = { restoreFacade() {} }
      container['usedFacades'] = {
        mock: ['facade1'],
        spy: ['facade1'],
        stub: ['facade2', 'not-found']
      }
      container['facade1'] = facade
      container['facade2'] = facade
      container['facade3'] = facade

      const restoreFacadeSpy = Sinon.spy(facade, 'restoreFacade')
      container['restoreFacades']()
      expect(restoreFacadeSpy.calledTwice).toBe(true)
    })

    it('works if "usedFacades".mock is missing', function() {
      const container = new FacadeContainer()
      const facade = { restoreFacade() {} }
      container['usedFacades'] = {
        spy: ['facade1'],
        stub: ['facade2', 'not-found']
      }
      container['facade1'] = facade
      container['facade2'] = facade
      container['facade3'] = facade

      const restoreFacadeSpy = Sinon.spy(facade, 'restoreFacade')
      container['restoreFacades']()
      expect(restoreFacadeSpy.calledTwice).toBe(true)
    })

    it('works if "usedFacades".spy is missing', function() {
      const container = new FacadeContainer()
      const facade = { restoreFacade() {} }
      container['usedFacades'] = {
        mock: ['facade1'],
        stub: ['facade2', 'not-found']
      }
      container['facade1'] = facade
      container['facade2'] = facade
      container['facade3'] = facade

      const restoreFacadeSpy = Sinon.spy(facade, 'restoreFacade')
      container['restoreFacades']()
      expect(restoreFacadeSpy.calledTwice).toBe(true)
    })

    it('works if "usedFacades".stub is missing', function() {
      const container = new FacadeContainer()
      const facade = { restoreFacade() {} }
      container['usedFacades'] = {
        spy: ['facade1'],
        mock: ['facade1']
      }
      container['facade1'] = facade
      container['facade2'] = facade
      container['facade3'] = facade

      const restoreFacadeSpy = Sinon.spy(facade, 'restoreFacade')
      container['restoreFacades']()
      expect(restoreFacadeSpy.calledOnce).toBe(true)
    })
  })
})
