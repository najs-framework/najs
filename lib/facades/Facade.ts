import { FacadeSpecs } from './interfaces/IFacadeGrammar'
import { ContextualFacade } from './ContextualFacade'

function facade(this: any, arg: ContextualFacade<any> | Object | undefined): any {
  // if (arg instanceof ContextualFacade) {
  // make a ContextualFacadeMatcher
  // }
  this.container = undefined
  this.accessorKey = undefined
  this.facadeInstanceCreator = undefined
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

export const Facade: FacadeSpecs = <any>facade
