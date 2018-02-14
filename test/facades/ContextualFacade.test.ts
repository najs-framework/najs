import { App, AppFacade } from './../../lib/facades/global/AppFacade'
import 'jest'
import { Facade } from '../../lib/facades/Facade'
import { FacadeContainersBag } from '../../lib/facades/FacadeContainer'
import { InputContextualFacade as Input } from '../../lib/facades/contextual/InputContextualFacade'

describe('ContextualFacade', function() {
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

    for (const container of FacadeContainersBag) {
      container.verifyMocks()
    }

    for (const container of FacadeContainersBag) {
      container.restoreFacades()
    }
  })
})
