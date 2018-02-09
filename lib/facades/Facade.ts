import { FacadeSpecs } from './interfaces/IFacadeGrammar'
import { ContextualFacade } from './ContextualFacade'

function facade(this: any, arg: ContextualFacade<any> | Object | undefined): any {
  if (arg instanceof ContextualFacade) {
    // make a ContextualFacadeMatcher
    return 'ContextualFacadeMatcher'
  }
  this.container = arg || {}
}
// facade.prototype = {
//   spy() {
//     console.log('spy method')
//   }
// }

export const Facade: FacadeSpecs = <any>facade

// class App extends Facade {}
// class AuthContextualFacade extends ContextualFacade {}
// const Auth: IContextualFacadeVerbWith<T> = new AuthContextualFacade()
// // const app = new App()
// // app.spy()

// Facade(Auth)
//   .with({})
//   .spy('test')

// class Test extends FacadeClass {
// constructor(context: any) {}
// }

// this is a Facade
// class AppFacade extends Facade { ... }
// App = new AppFacade()
// const App: any = {}

// this is a ContextualFacade
// class AuthContextualFacade extends ContextualFacade { ... }
// Auth = new AuthContextualFacade()
// const Auth: any = {}

// How to test a Facade
// App.shouldReceive('register').once()

// How to test a ContextualFacade
// YES: I'm using this is base class Facade
// Facade(Auth).withAny().shouldReceive('user').once()
