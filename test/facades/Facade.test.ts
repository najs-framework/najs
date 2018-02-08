describe('Facade', function() {
  it('is a concept of Facade', function() {
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

    const facade = Facade.create<IFacade & IWrapperClass>(new WrapperClass())
    facade.doSomething('any thing')
    facade.spy()
    console.log(facade instanceof Facade)
    console.log(facade instanceof WrapperClass)

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
  })
})
