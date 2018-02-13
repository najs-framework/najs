"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sinon = require("sinon");
exports.FacadeContainers = [];
function facade(arg) {
    // if (arg instanceof ContextualFacade) {
    // make a ContextualFacadeMatcher
    // }
    this.container = undefined;
    this.accessorKey = undefined;
    this.facadeInstanceCreator = undefined;
    this.createdSpies = {};
    this.createdStubs = {};
    this.createdMocks = [];
}
facade['create'] = function (container, key, facadeInstanceCreator) {
    const registered = !exports.FacadeContainers.find(item => item === container);
    if (registered) {
        exports.FacadeContainers.push(container);
    }
    if (typeof container[key] === 'undefined') {
        container[key] = facadeInstanceCreator();
    }
    container[key].container = container;
    container[key].accessorKey = key;
    container[key].facadeInstanceCreator = facadeInstanceCreator;
    return container[key];
};
facade['verifyMocks'] = function () {
    for (const container of exports.FacadeContainers) {
        container.verifyMocks();
    }
};
facade['restoreAll'] = function () {
    for (const container of exports.FacadeContainers) {
        container.restoreFacades();
    }
};
facade.prototype = {
    spy(method) {
        const spy = Sinon.spy(this, method);
        this.container.markFacadeWasUsed(this.accessorKey, 'spy');
        this.createdSpies[method] = spy;
        return spy;
    },
    createStub(method) {
        const stub = Sinon.stub(this, method);
        this.container.markFacadeWasUsed(this.accessorKey, 'stub');
        this.createdStubs[method] = stub;
        return stub;
    },
    createMock() {
        const mock = Sinon.mock(this);
        this.container.markFacadeWasUsed(this.accessorKey, 'mock');
        this.createdMocks.push(mock);
        return mock;
    },
    restoreFacade() {
        for (const method in this.createdSpies) {
            this.createdSpies[method].restore();
        }
        for (const method in this.createdStubs) {
            this.createdStubs[method].restore();
        }
        for (const mock of this.createdMocks) {
            mock.restore();
        }
        this.createdMocks = [];
    },
    reloadFacadeRoot() {
        this.container[this.accessorKey] = this.facadeInstanceCreator();
        return this;
    }
};
exports.Facade = facade;
