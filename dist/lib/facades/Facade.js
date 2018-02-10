"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function facade(arg) {
    // if (arg instanceof ContextualFacade) {
    // make a ContextualFacadeMatcher
    // }
    this.container = undefined;
    this.accessorKey = undefined;
    this.facadeInstanceCreator = undefined;
}
facade['create'] = function (container, key, facadeInstanceCreator) {
    if (typeof container[key] === 'undefined') {
        container[key] = facadeInstanceCreator();
    }
    container[key].container = container;
    container[key].accessorKey = key;
    container[key].facadeInstanceCreator = facadeInstanceCreator;
    return container[key];
};
exports.Facade = facade;
