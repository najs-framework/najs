// export class Facade {
//   protected constructor(instance: any) {
// this.instance = instance
// }
// }
// const test = Facade()
function facade() { }
const FacadeClass = facade;
// class Test extends FacadeClass {
// constructor(context: any) {}
// }
// this is a Facade
// class AppFacade extends Facade { ... }
// App = new AppFacade()
const App = {};
// this is a ContextualFacade
// class AuthContextualFacade extends ContextualFacade { ... }
// Auth = new AuthContextualFacade()
const Auth = {};
// How to test a Facade
// App.shouldReceive('register').once()
// How to test a ContextualFacade
// YES: I'm using this is base class Facade
// Facade(Auth).withAny().shouldReceive('user').once()
