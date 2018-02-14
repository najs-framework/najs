"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ContextualFacadeFactory {
    constructor(createContextualFacade) {
        this.contextualFacadeCreator = createContextualFacade;
    }
    of(context) {
        return this.contextualFacadeCreator(context);
    }
    with(context) {
        return this.contextualFacadeCreator(context);
    }
    for(context) {
        return this.contextualFacadeCreator(context);
    }
    at(context) {
        return this.contextualFacadeCreator(context);
    }
    from(context) {
        return this.contextualFacadeCreator(context);
    }
}
exports.ContextualFacadeFactory = ContextualFacadeFactory;
