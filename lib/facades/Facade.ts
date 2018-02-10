import { FacadeSpecs } from './interfaces/IFacadeGrammar'
import { ContextualFacade } from './ContextualFacade'
import * as Sinon from 'sinon'

function facade(this: any, arg: ContextualFacade<any> | Object | undefined): any {
  // if (arg instanceof ContextualFacade) {
  // make a ContextualFacadeMatcher
  // }
  this.container = undefined
  this.accessorKey = undefined
  this.facadeInstanceCreator = undefined
  this.createdSpies = {}
  this.createdStubs = {}
}

facade['create'] = function(this: any, container: Object, key: string, facadeInstanceCreator: () => void) {
  if (typeof container[key] === 'undefined') {
    container[key] = facadeInstanceCreator()
  }
  container[key].container = container
  container[key].accessorKey = key
  container[key].facadeInstanceCreator = facadeInstanceCreator
  return container[key]
}

facade.prototype = {
  spy(method: string) {
    const spy = Sinon.spy(this, method)
    this.createdSpies[method] = spy
    return spy
  },

  createStub(method: string) {
    const stub = Sinon.stub(this, method)
    this.createdStubs[method] = stub
    return stub
  },

  restoreFacade() {
    for (const method in this.createdSpies) {
      this.createdSpies[method].restore()
    }

    for (const method in this.createdStubs) {
      this.createdStubs[method].restore()
    }
  }
}

export const Facade: FacadeSpecs = <any>facade
