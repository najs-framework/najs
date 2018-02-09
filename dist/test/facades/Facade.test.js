"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
describe('Facade', function () {
    it('proof of concept that Facade can be use as a base class and factory function', function () {
        class ContextualFacade {
            of(context) { }
            with(context) { }
        }
        // ----------------------------------------------------------------------
        class ContextualFacadeMatcher {
            with(context) {
                console.log('running ContextualFacadeMatcher for context', context);
                return this;
            }
            spy(method) {
                console.log('spy method from matcher', method);
            }
        }
        // ----------------------------------------------------------------------
        function facade(arg) {
            if (arg instanceof ContextualFacade) {
                // make a ContextualFacadeMatcher
                return new ContextualFacadeMatcher();
            }
            this.container = arg || {};
        }
        facade.prototype = {
            spy(method) {
                console.log('spy method', method);
            }
        };
        const Facade = facade;
        // ----------------------------------------------------------------------
        class AppFacade extends Facade {
        }
        const App = new AppFacade();
        App.spy('any');
        class AuthContextualFacade extends ContextualFacade {
        }
        const Auth = new AuthContextualFacade();
        Facade(Auth)
            .with('Context')
            .spy('any');
    });
    it.skip('is a concept of Facade', function () {
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
