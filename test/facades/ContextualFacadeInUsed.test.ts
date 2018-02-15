import 'jest'
import { Facade } from '../../lib/facades/Facade'
import { ContextualFacade } from '../../lib/facades/ContextualFacade'
import { App, AppFacade } from './../../lib/facades/global/AppFacade'
import { FacadeContainersBag, cleanFacadeContainersBag } from '../../lib/facades/FacadeContainer'
import { IContextualFacadeVerbOf } from '../../lib/facades/interfaces/IFacadeGrammar'

export class InputFacade extends ContextualFacade {
  doSomething() {
    // console.log('do something with context', this.context)
  }
}

const facade = Facade.create<InputFacade, any>(function(context: any) {
  return new InputFacade(context)
})
export const Input: IContextualFacadeVerbOf<InputFacade, any> = facade

describe('ContextualFacade', function() {
  afterEach(function() {
    for (const container of FacadeContainersBag) {
      container.verifyMocks()
    }

    for (const container of FacadeContainersBag) {
      container.restoreFacades()
    }

    cleanFacadeContainersBag()
  })

  it('can use Facade() with normal Facade', function() {
    Facade(App).spy('make')
    Facade(AppFacade).spy('register')
  })

  it('does something', function() {
    Facade(Input)
      .with('test')
      .shouldReceive('doSomething')
      .once()
    Facade(Input)
      .with('testing')
      .shouldReceive('doSomething')
      .twice()

    Input.of('test').doSomething()
    Input.of('testing').doSomething()
    Input.of('testing').doSomething()
    Input.of('testing-not-match').doSomething()
  })

  it('does something else', function() {
    Facade(Input)
      .with((context: any) => context === 'test')
      .shouldReceive('doSomething')
      .once()
    Facade(Input)
      .with('testing')
      .shouldReceive('doSomething')
      .once()

    // Facade(Input, withAnyContext())

    Input.of('test').doSomething()
    Input.of('testing').doSomething()
    Input.of('testing-not-match').doSomething()
  })

  it('can use .withAny()', function() {
    Facade(Input)
      .withAny()
      .shouldReceive('doSomething')
      .thrice()

    Input.of('test').doSomething()
    Input.of('testing').doSomething()
    Input.of('testing-not-match').doSomething()
  })
})
