"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Facade_1 = require("../../lib/facades/Facade");
const ContextualFacade_1 = require("../../lib/facades/ContextualFacade");
const AppFacade_1 = require("./../../lib/facades/global/AppFacade");
const FacadeContainer_1 = require("../../lib/facades/FacadeContainer");
class InputFacade extends ContextualFacade_1.ContextualFacade {
    doSomething() {
        // console.log('do something with context', this.context)
    }
}
exports.InputFacade = InputFacade;
const facade = Facade_1.Facade.create(function (context) {
    return new InputFacade(context);
});
exports.Input = facade;
describe('ContextualFacade', function () {
    afterEach(function () {
        FacadeContainer_1.FacadeContainer.verifyAndRestoreAllFacades();
    });
    it('can use Facade() with normal Facade', function () {
        Facade_1.Facade(AppFacade_1.App).spy('make');
        Facade_1.Facade(AppFacade_1.AppFacade).spy('register');
    });
    it('does something', function () {
        Facade_1.Facade(exports.Input)
            .with('test')
            .shouldReceive('doSomething')
            .once();
        Facade_1.Facade(exports.Input)
            .with('testing')
            .shouldReceive('doSomething')
            .twice();
        exports.Input.of('test').doSomething();
        exports.Input.of('testing').doSomething();
        exports.Input.of('testing').doSomething();
        exports.Input.of('testing-not-match').doSomething();
    });
    it('does something else', function () {
        Facade_1.Facade(exports.Input)
            .with((context) => context === 'test')
            .shouldReceive('doSomething')
            .once();
        Facade_1.Facade(exports.Input)
            .with('testing')
            .shouldReceive('doSomething')
            .once();
        // Facade(Input, withAnyContext())
        exports.Input.of('test').doSomething();
        exports.Input.of('testing').doSomething();
        exports.Input.of('testing-not-match').doSomething();
    });
    it('can use .withAny()', function () {
        Facade_1.Facade(exports.Input)
            .withAny()
            .shouldReceive('doSomething')
            .thrice();
        exports.Input.of('test').doSomething();
        exports.Input.of('testing').doSomething();
        exports.Input.of('testing-not-match').doSomething();
    });
});
