"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Facade_1 = require("./Facade");
const FacadeContainer_1 = require("./FacadeContainer");
class ContextualFacadeMatcher {
    constructor(contextualFacadeFactory) {
        this.count = 0;
        this.container = new FacadeContainer_1.FacadeContainer(true);
        this.factory = contextualFacadeFactory;
        this.createContextualFacade = this.factory.contextualFacadeCreator;
        this.factory.contextualFacadeCreator = this.boundCreateByContext.bind(this);
    }
    boundCreateByContext(context) {
        for (const availableKey in this.container) {
            const createdFacade = this.container[availableKey];
            if (typeof createdFacade['isContextMatch'] !== 'function') {
                continue;
            }
            const match = createdFacade['isContextMatch'](context);
            if (match) {
                createdFacade.context = context;
                return createdFacade;
            }
        }
        const key = this.container.getKeyByCount(`context#{count}`);
        const result = Facade_1.Facade.create(this.container, key, () => {
            return this.createContextualFacade(context);
        });
        return result;
    }
    createMatcher(matcher) {
        const facade = this.boundCreateByContext(undefined);
        facade['isContextMatch'] = matcher;
        return facade;
    }
    with(arg) {
        if (typeof arg === 'function') {
            return this.createMatcher(arg);
        }
        return this.createMatcher(function (creatingContext) {
            return creatingContext === arg;
        });
    }
    withAny() {
        return this.createMatcher(function () {
            return true;
        });
    }
}
exports.ContextualFacadeMatcher = ContextualFacadeMatcher;
