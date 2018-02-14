"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Facade_1 = require("./Facade");
class ContextualFacade extends Facade_1.Facade {
    constructor(context) {
        super();
        this.context = context;
    }
}
exports.ContextualFacade = ContextualFacade;
