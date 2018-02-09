// export class Facade {
//   protected constructor(instance: any) {
// this.instance = instance
// }
// }

// const test = Facade()
function facade(): any {}

const FacadeClass: {
  (): boolean
  new (): any
} = <any>facade

// class Test extends FacadeClass {
// constructor(context: any) {}
// }

// this is a Facade
// class AppFacade extends Facade { ... }
// App = new AppFacade()
const App: any = {}

// this is a ContextualFacade
// class AuthContextualFacade extends ContextualFacade { ... }
// Auth = new AuthContextualFacade()
const Auth: any = {}

// How to test a Facade
// App.shouldReceive('register').once()

// How to test a ContextualFacade
// YES: I'm using this is base class Facade
// Facade(Auth).withAny().shouldReceive('user').once()
