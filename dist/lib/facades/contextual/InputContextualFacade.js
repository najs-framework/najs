"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ContextualFacadeFactory_1 = require("../ContextualFacadeFactory");
const ContextualFacade_1 = require("../ContextualFacade");
class InputFacade extends ContextualFacade_1.ContextualFacade {
    doSomething() {
        // console.log('do something with context', this.context)
    }
}
exports.InputFacade = InputFacade;
class InputContextualFacadeFactory extends ContextualFacadeFactory_1.ContextualFacadeFactory {
    createContextualFacade(context) {
        return new InputFacade(context);
    }
}
exports.InputContextualFacadeFactory = InputContextualFacadeFactory;
exports.InputContextualFacade = new InputContextualFacadeFactory();
