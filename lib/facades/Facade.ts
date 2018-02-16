import { FacadeContainer } from './FacadeContainer'
import { ContextualFacadeMatcher } from './ContextualFacadeMatcher'
import { ContextualFacadeFactory } from './ContextualFacadeFactory'
import { IFacadeContainer } from './interfaces/IFacadeContainer'
import { FacadeSpecs } from './interfaces/IFacadeGrammar'
import * as Sinon from 'sinon'

function facade(this: any, arg: ContextualFacadeFactory<any> | Object | undefined): any {
  if (arg instanceof Facade) {
    return arg
  }

  if (arg instanceof ContextualFacadeFactory) {
    if (!arg['contextualFacadeMatcher']) {
      arg['contextualFacadeMatcher'] = new ContextualFacadeMatcher(arg)
    }
    return arg['contextualFacadeMatcher']
  }

  this.container = undefined
  this.accessorKey = undefined
  this.facadeInstanceCreator = undefined
  this.createdSpies = {}
  this.createdStubs = {}
  this.createdMocks = []
}

facade['create'] = function(this: any, mixed: any, key: string, facadeInstanceCreator: () => void) {
  if (typeof mixed === 'function') {
    return new ContextualFacadeFactory(mixed)
  }

  const container: IFacadeContainer = mixed
  const registered: boolean = !FacadeContainer.Bucket.find(item => item === container)
  if (registered) {
    FacadeContainer.Bucket.push(container)
  }

  if (typeof container[key] === 'undefined') {
    container[key] = facadeInstanceCreator()
  }
  container[key].container = container
  container[key].accessorKey = key
  container[key].facadeInstanceCreator = facadeInstanceCreator
  return container[key]
}

facade['verifyMocks'] = function() {
  for (const container of FacadeContainer.Bucket) {
    container.verifyMocks()
  }
}

facade['restoreAll'] = function() {
  for (const container of FacadeContainer.Bucket) {
    container.restoreFacades()
  }
}

facade.prototype = {
  getFacade() {
    return this
  },

  spy(method: string) {
    const spy = Sinon.spy(this, method)
    this.container.markFacadeWasUsed(this.accessorKey, 'spy')
    this.createdSpies[method] = spy
    return spy
  },

  createStub(method: string) {
    const stub = Sinon.stub(this, method)
    this.container.markFacadeWasUsed(this.accessorKey, 'stub')
    this.createdStubs[method] = stub
    return stub
  },

  createMock() {
    const mock = Sinon.mock(this)
    this.container.markFacadeWasUsed(this.accessorKey, 'mock')
    this.createdMocks.push(mock)
    return mock
  },

  shouldReceive(method: string) {
    const mock: Sinon.SinonMock = this.createMock()
    return mock.expects(method)
  },

  restoreFacade() {
    for (const method in this.createdSpies) {
      this.createdSpies[method].restore()
    }

    for (const method in this.createdStubs) {
      this.createdStubs[method].restore()
    }

    for (const mock of this.createdMocks) {
      mock.restore()
    }
    this.createdMocks = []
  },

  reloadFacadeRoot() {
    this.container[this.accessorKey] = this.facadeInstanceCreator()
    return this
  }
}

export const Facade: FacadeSpecs = <any>facade
