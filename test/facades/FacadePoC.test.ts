import {
  IContextualFacadeVerbOf,
  IContextualFacadeVerbWith,
  FacadeSpecs
} from '../../lib/facades/interfaces/IFacadeGrammar'

describe('Facade Proof of Concept', function() {
  it.skip('proof of concept that Facade can be use as a base class and factory function', function() {
    class ContextualFacade {
      of(context: any): any {}
      with(context: any): any {}
    }
    // ----------------------------------------------------------------------
    class ContextualFacadeMatcher {
      with(context: any) {
        console.log('running ContextualFacadeMatcher for context', context)
        return this
      }

      spy(method: string) {
        console.log('spy method from matcher', method)
      }
    }
    // ----------------------------------------------------------------------
    function facade(this: any, arg: ContextualFacade | Object | undefined): any {
      if (arg instanceof ContextualFacade) {
        // make a ContextualFacadeMatcher
        return new ContextualFacadeMatcher()
      }
      this.container = arg || {}
    }
    facade.prototype = {
      spy(method: string) {
        console.log('spy method', method)
      }
    }
    const Facade: FacadeSpecs = <any>facade

    // ----------------------------------------------------------------------
    class AppFacade extends Facade {}
    const App = new AppFacade()
    App.spy('any')

    class AuthContextualFacade extends ContextualFacade {}
    const Auth: IContextualFacadeVerbWith<any, any> & IContextualFacadeVerbOf<any, any> = new AuthContextualFacade()

    Facade(Auth)
      .with('Context')
      .spy('any')
  })

  it.skip('is a concept of Facade', function() {
    interface IWrapperClass {
      doSomething(...args: any[]): void
    }
    interface IFacade {
      spy(): void
    }

    class WrapperClass implements IWrapperClass {
      doSomething(...args: any[]) {
        this.test()
        console.log('do something', args)
      }

      test() {
        console.log('test')
      }
    }
    class Facade implements IFacade {
      instance: any

      constructor(instance: any) {
        this.instance = instance
      }

      spy() {
        console.log('facade spy')
      }

      static create<T>(instance: any): T {
        const facade = new Facade(instance)
        const prototype = Object.getPrototypeOf(instance)
        for (const name of Object.getOwnPropertyNames(prototype)) {
          if (name === 'constructor') {
            continue
          }
          facade[name] = prototype[name].bind(instance)
        }
        return <any>facade
      }
    }

    const facadeInstance = Facade.create<IFacade & IWrapperClass>(new WrapperClass())
    facadeInstance.doSomething('any thing')
    facadeInstance.spy()
    console.log(facadeInstance instanceof Facade)
    console.log(facadeInstance instanceof WrapperClass)

    class ChildClass extends Facade implements IWrapperClass {
      doSomething(...args: any[]) {
        this.test()
        console.log('do something', args)
      }

      test() {
        console.log('test')
      }
    }
    const childFacade = new ChildClass({})
    childFacade.doSomething('any thing')
    childFacade.spy()
    console.log(childFacade instanceof Facade)
    console.log(childFacade instanceof ChildClass)

    // class ContextualFacade<T, F> {
    //   constructor() {}

    //   of(context: T): F {
    //     return <F>{}
    //   }

    //   protected facade(): Facade {
    //     return <Facade>{}
    //   }
    // }
    // const Auth = new ContextualFacade<any, IWrapperClass>()
    // Auth.of({}).doSomething()
    // ;(Auth['facade']() as Facade).spy()

    // function facade(contextualFacade: ContextualFacade<any, any>): ContextualFacade<any, any> {
    //   return contextualFacade
    // }
    // facade(Auth).
    // const Auth = <any>{}
    // Auth.of({}).user()

    // facade(Auth).withAny().shouldReceive('get')
  })
})
