import { IFacade } from './interfaces/IFacadeGrammar'
import { Facade } from './Facade'
import { FacadeContainer } from './FacadeContainer'
import { ContextualFacade } from './ContextualFacade'
import { ContextualFacadeFactory } from './ContextualFacadeFactory'

let count: number = 0
export const ContextualFacadeContainer = new FacadeContainer()

export class ContextualFacadeMatcher {
  count: number
  factory: ContextualFacadeFactory<any, any>
  createContextualFacade: any

  constructor(contextualFacadeFactory: ContextualFacadeFactory<any, any>) {
    this.count = 0
    this.factory = contextualFacadeFactory
    this.createContextualFacade = this.factory.contextualFacadeCreator
    this.factory.contextualFacadeCreator = this.boundCreateByContext.bind(this)
  }

  boundCreateByContext(context: any): any {
    // matcher should be implemented in here
    for (const availableKey in ContextualFacadeContainer) {
      const createdFacade: ContextualFacade = ContextualFacadeContainer[availableKey]
      if (typeof createdFacade.context !== 'function') {
        continue
      }

      const match = createdFacade.context(context)
      if (match) {
        return createdFacade
      }
    }

    const key = `context#${++count}`
    const result = Facade.create(ContextualFacadeContainer, key, () => {
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
