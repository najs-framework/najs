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
        const facade = Facade.create(new WrapperClass());
        facade.doSomething('any thing');
        facade.spy();
        console.log(facade instanceof Facade);
        console.log(facade instanceof WrapperClass);
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
    });
});
