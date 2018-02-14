"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Facade_1 = require("../Facade");
const ContextualFacade_1 = require("../ContextualFacade");
class InputFacade extends ContextualFacade_1.ContextualFacade {
    doSomething() {
        // console.log('do something with context', this.context)
    }
}
exports.InputFacade = InputFacade;
const facade = Facade_1.Facade.create(function (context) {
    return new InputFacade(context);
});
exports.InputContextualFacade = facade;
