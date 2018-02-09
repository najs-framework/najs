describe('Facade', function () {
    it('is a concept of Facade', function () {
        class WrapperClass {
            doSomething(...args) {
                this.test();
                console.log('do something', args);
            }
            test() {
                console.log('test');
            }
        }
        class Facade {
            constructor(instance) {
                this.instance = instance;
            }
            spy() {
                console.log('facade spy');
            }
            static create(instance) {
                const facade = new Facade(instance);
                const prototype = Object.getPrototypeOf(instance);
                for (const name of Object.getOwnPropertyNames(prototype)) {
                    if (name === 'constructor') {
                        continue;
                    }
                    facade[name] = prototype[name].bind(instance);
                }
                return facade;
            }
        }
        const facadeInstance = Facade.create(new WrapperClass());
        facadeInstance.doSomething('any thing');
        facadeInstance.spy();
        console.log(facadeInstance instanceof Facade);
        console.log(facadeInstance instanceof WrapperClass);
        class ChildClass extends Facade {
            doSomething(...args) {
                this.test();
                console.log('do something', args);
            }
            test() {
                console.log('test');
            }
        }
        const childFacade = new ChildClass({});
        childFacade.doSomething('any thing');
        childFacade.spy();
        console.log(childFacade instanceof Facade);
        console.log(childFacade instanceof ChildClass);
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
    });
});
