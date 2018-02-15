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
    // matcher should be implemented in here
    for (const availableKey in this.container) {
      const createdFacade: ContextualFacade = this.container[availableKey]
      if (typeof createdFacade.context !== 'function') {
        continue
      }

      const match = createdFacade.context(context)
      if (match) {
        return createdFacade
      }
    }

    const key = this.container.getKeyByCount(`context#{count}`)
    const result = Facade.create(this.container, key, () => {
      return this.createContextualFacade(context)
    })
    return result
  }

  with(context: any): IFacade {
    return this.boundCreateByContext(function(creatingContext: any) {
      return creatingContext === context
    })
  }

  // withAny(): IFacade {
  //   return this.boundCreateByContext(function(creatingContext: any) {
  //     return true
  //   })
  // }
}
