"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FacadeContainer_1 = require("./FacadeContainer");
const ContextualFacadeMatcher_1 = require("./ContextualFacadeMatcher");
const ContextualFacadeFactory_1 = require("./ContextualFacadeFactory");
const Sinon = require("sinon");
function facade(arg) {
    if (arg instanceof exports.Facade) {
        return arg;
    }
    if (arg instanceof ContextualFacadeFactory_1.ContextualFacadeFactory) {
        if (!arg['contextualFacadeMatcher']) {
            arg['contextualFacadeMatcher'] = new ContextualFacadeMatcher_1.ContextualFacadeMatcher(arg);
        }
        return arg['contextualFacadeMatcher'];
    }
    this.container = undefined;
    this.accessorKey = undefined;
    this.facadeInstanceCreator = undefined;
    this.createdSpies = {};
    this.createdStubs = {};
    this.createdMocks = [];
}
facade['create'] = function (mixed, key, facadeInstanceCreator) {
    if (typeof mixed === 'function') {
        return new ContextualFacadeFactory_1.ContextualFacadeFactory(mixed);
    }
    const container = mixed;
    const registered = !FacadeContainer_1.FacadeContainer.Bucket.find(item => item === container);
    if (registered) {
        FacadeContainer_1.FacadeContainer.Bucket.push(container);
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
    for (const container of FacadeContainer_1.FacadeContainer.Bucket) {
        container.verifyMocks();
    }
};
facade['restoreAll'] = function () {
    for (const container of FacadeContainer_1.FacadeContainer.Bucket) {
        container.restoreFacades();
    }
};
facade.prototype = {
    getFacade() {
        return this;
    },
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
    shouldReceive(method) {
        const mock = this.createMock();
        return mock.expects(method);
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
