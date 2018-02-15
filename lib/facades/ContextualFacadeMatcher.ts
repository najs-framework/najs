import { IFacade } from './interfaces/IFacadeGrammar'
import { Facade } from './Facade'
import { FacadeContainer } from './FacadeContainer'
import { ContextualFacade } from './ContextualFacade'
import { ContextualFacadeFactory } from './ContextualFacadeFactory'

export class ContextualFacadeMatcher {
  count: number
  container: FacadeContainer
  factory: ContextualFacadeFactory<any, any>
  createContextualFacade: any

  constructor(contextualFacadeFactory: ContextualFacadeFactory<any, any>) {
    this.count = 0
    this.container = new FacadeContainer(true)
    this.factory = contextualFacadeFactory
    this.createContextualFacade = this.factory.contextualFacadeCreator
    this.factory.contextualFacadeCreator = this.boundCreateByContext.bind(this)
  }

  boundCreateByContext(context: any): any {
    for (const availableKey in this.container) {
      const createdFacade: ContextualFacade = this.container[availableKey]
      if (typeof createdFacade['isContextMatch'] !== 'function') {
        continue
      }

      const match = createdFacade['isContextMatch'](context)
      if (match) {
        createdFacade.context = context
        return createdFacade
      }
    }

    const key = this.container.getKeyByCount(`context#{count}`)
    const result = Facade.create(this.container, key, () => {
      return this.createContextualFacade(context)
    })
    return result
  }

  createMatcher(matcher: Function) {
    const facade = this.boundCreateByContext(undefined)
    facade['isContextMatch'] = matcher
    return facade
  }

  with(context: any): IFacade
  with(matcher: (context: any) => boolean): IFacade
  with(arg: any): IFacade {
    if (typeof arg === 'function') {
      return this.createMatcher(arg)
    }
    return this.createMatcher(function(creatingContext: any) {
      return creatingContext === arg
    })
  }

  withAny(): IFacade {
    return this.createMatcher(function() {
      return true
    })
  }
}
