"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ContextualFacadeFactory {
    of(context) {
        return this.createContextualFacade(context);
    }
}
exports.ContextualFacadeFactory = ContextualFacadeFactory;
