"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Facade_1 = require("./Facade");
const FacadeContainer_1 = require("./FacadeContainer");
let count = 0;
exports.ContextualFacadeContainer = new FacadeContainer_1.FacadeContainer();
class ContextualFacadeMatcher {
    constructor(contextualFacadeFactory) {
        this.count = 0;
        this.factory = contextualFacadeFactory;
        this.createContextualFacade = this.factory.contextualFacadeCreator;
        this.factory.contextualFacadeCreator = this.boundCreateByContext.bind(this);
    }
    boundCreateByContext(context) {
        // matcher should be implemented in here
        for (const availableKey in exports.ContextualFacadeContainer) {
            const createdFacade = exports.ContextualFacadeContainer[availableKey];
            if (typeof createdFacade.context !== 'function') {
                continue;
            }
            const match = createdFacade.context(context);
            if (match) {
                return createdFacade;
            }
        }
        const key = `context#${++count}`;
        const result = Facade_1.Facade.create(exports.ContextualFacadeContainer, key, () => {
            return this.createContextualFacade(context);
        });
        return result;
    }
    with(context) {
        return this.boundCreateByContext(function (creatingContext) {
            return creatingContext === context;
        });
    }
}
exports.ContextualFacadeMatcher = ContextualFacadeMatcher;
