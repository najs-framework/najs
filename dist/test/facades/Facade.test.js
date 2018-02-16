"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Facade_1 = require("../../lib/facades/Facade");
const FacadeContainer_1 = require("../../lib/facades/FacadeContainer");
describe('Facade', function () {
    describe('() => IFacade', function () {
        it('returns argument if the argument is Facade instance', function () {
            class FacadeClass extends Facade_1.Facade {
                method() { }
            }
            const instance = new FacadeClass();
            expect(Facade_1.Facade(instance) === instance).toBe(true);
        });
    });
    describe('Facade.verifyMocks()', function () {
        it('loops all containers in FacadeContainers and calls container.verifyMocks()', function () {
            const container = {
                verifyMocks() { },
                restoreFacades() { }
            };
            const verifyMocksSpy = Sinon.spy(container, 'verifyMocks');
            FacadeContainer_1.FacadeContainer.Bucket.push(container);
            Facade_1.Facade.verifyMocks();
            expect(verifyMocksSpy.called).toBe(true);
        });
    });
    describe('Facade.verifyMocks()', function () {
        it('loops all containers in FacadeContainers and calls container.restoreFacades()', function () {
            const container = {
                verifyMocks() { },
                restoreFacades() { }
            };
            const restoreFacadesSpy = Sinon.spy(container, 'restoreFacades');
            FacadeContainer_1.FacadeContainer.Bucket.push(container);
            Facade_1.Facade.restoreAll();
            expect(restoreFacadesSpy.called).toBe(true);
        });
    });
    describe('Facade.create()', function () {
        it('creates a facade by assume that facade instance already in container[key]', function () {
            const container = { key: {} };
            const key = 'key';
            const instanceCreator = () => { };
            const facade = Facade_1.Facade.create(container, key, instanceCreator);
            expect(facade === container[key]).toBe(true);
        });
        it('calls instanceCreator if container[key] is not found', function () {
            const container = {};
            const instance = {};
            const instanceCreator = () => {
                return instance;
            };
            const instanceCreatorSpy = Sinon.spy(instanceCreator);
            const facade = Facade_1.Facade.create(container, 'key', instanceCreatorSpy);
            expect(facade === container['key']).toBe(true);
            expect(instanceCreatorSpy.called).toBe(true);
        });
        it('assigns container, key, instanceCreator into facade instance', function () {
            const container = { key: {} };
            const key = 'key';
            const instanceCreator = () => { };
            const facade = Facade_1.Facade.create(container, key, instanceCreator);
            expect(facade === container[key]).toBe(true);
            expect(facade['container'] === container).toBe(true);
            expect(facade['accessorKey'] === key).toBe(true);
            expect(facade['facadeInstanceCreator'] === instanceCreator).toBe(true);
        });
    });
    describe('.getFacade()', function () {
        it('simply returns itself', function () {
            class FacadeClass extends Facade_1.Facade {
                method() { }
            }
            const instance = new FacadeClass();
            expect(instance.getFacade() === instance).toBe(true);
        });
    });
    describe('.spy()', function () {
        it('creates a spy by using Sinon.spy() and put the result to createdSpies bag', function () {
            class FacadeClass extends Facade_1.Facade {
                method() { }
            }
            const instance = new FacadeClass();
            const container = {
                key: instance,
                markFacadeWasUsed() { }
            };
            const key = 'key';
            const instanceCreator = () => {
                return instance;
            };
            const length = FacadeContainer_1.FacadeContainer.Bucket.length;
            const facade = Facade_1.Facade.create(container, key, instanceCreator);
            expect(FacadeContainer_1.FacadeContainer.Bucket).toHaveLength(length + 1);
            const markFacadeWasUsedSpy = Sinon.spy(container, 'markFacadeWasUsed');
            const originalMethod = facade['method'];
            expect(facade['createdSpies']).toEqual({});
            const result = facade.spy('method');
            expect(result['isSinonProxy']).toBe(true);
            expect(facade['createdSpies']['method'] === result).toBe(true);
            expect(facade['method'] === result).toBe(true);
            expect(result['wrappedMethod'] === originalMethod).toBe(true);
            expect(markFacadeWasUsedSpy.calledWith('key', 'spy')).toBe(true);
            facade.restoreFacade();
            // recreate facade with same container the container will not be appends to FacadeContainersBag
            Facade_1.Facade.create(container, key, instanceCreator);
            expect(FacadeContainer_1.FacadeContainer.Bucket).toHaveLength(length + 1);
        });
    });
    describe('.createStub()', function () {
        it('creates a stub by using Sinon.stub() and put the result to createdStubs bag', function () {
            class FacadeClass extends Facade_1.Facade {
                method() { }
            }
            const instance = new FacadeClass();
            const container = {
                key: instance,
                markFacadeWasUsed() { }
            };
            const key = 'key';
            const instanceCreator = () => {
                return instance;
            };
            const facade = Facade_1.Facade.create(container, key, instanceCreator);
            const markFacadeWasUsedStub = Sinon.spy(container, 'markFacadeWasUsed');
            expect(facade['createdStubs']).toEqual({});
            const result = facade.createStub('method');
            expect(result['isSinonProxy']).toBe(true);
            expect(facade['createdStubs']['method'] === result).toBe(true);
            expect(facade['method'] === result).toBe(true);
            expect(result['rootObj'] === facade).toBe(true);
            expect(markFacadeWasUsedStub.calledWith('key', 'stub')).toBe(true);
            facade.restoreFacade();
        });
    });
    describe('.createMock()', function () {
        it('creates a mock by using Sinon.createMock() and put the result to createdMocks bag', function () {
            class FacadeClass extends Facade_1.Facade {
                method() { }
            }
            const instance = new FacadeClass();
            const container = {
                key: instance,
                markFacadeWasUsed() { }
            };
            const key = 'key';
            const instanceCreator = () => {
                return instance;
            };
            const facade = Facade_1.Facade.create(container, key, instanceCreator);
            const markFacadeWasUsedMock = Sinon.spy(container, 'markFacadeWasUsed');
            expect(facade['createdMocks']).toHaveLength(0);
            const result = facade.createMock();
            expect(facade['createdMocks']).toHaveLength(1);
            expect(facade['createdMocks'][0] === result).toBe(true);
            expect(typeof result.expects === 'function').toBe(true);
            expect(typeof result.restore === 'function').toBe(true);
            expect(typeof result.verify === 'function').toBe(true);
            expect(markFacadeWasUsedMock.calledWith('key', 'mock')).toBe(true);
            facade.restoreFacade();
        });
    });
    describe('.shouldReceive()', function () {
        it('calls .createMock() to create a mock then call expects(method)', function () {
            class FacadeClass extends Facade_1.Facade {
                method() { }
            }
            const instance = new FacadeClass();
            const container = {
                key: instance,
                markFacadeWasUsed() { }
            };
            const key = 'key';
            const instanceCreator = () => {
                return instance;
            };
            const facade = Facade_1.Facade.create(container, key, instanceCreator);
            const createMockSpy = Sinon.spy(facade, 'createMock');
            expect(facade['createdMocks']).toHaveLength(0);
            facade.shouldReceive('method');
            expect(createMockSpy.called).toBe(true);
            expect(facade['createdMocks']).toHaveLength(1);
            facade.restoreFacade();
        });
    });
    describe('.restoreFacade()', function () {
        it('loops all createdSpies + createdStubs and calls restore function', function () {
            class FacadeClass extends Facade_1.Facade {
                methodSpy() { }
                methodStub() { }
            }
            const instance = new FacadeClass();
            const container = {
                key: instance,
                markFacadeWasUsed() { }
            };
            const key = 'key';
            const instanceCreator = () => {
                return instance;
            };
            const facade = Facade_1.Facade.create(container, key, instanceCreator);
            expect(facade['createdSpies']).toEqual({});
            expect(facade['createdStubs']).toEqual({});
            expect(facade['createdMocks']).toEqual([]);
            const spy = facade.spy('methodSpy');
            expect(facade['methodSpy'].name).toEqual(spy.name);
            const stub = facade.createStub('methodStub');
            expect(facade['methodStub'].name).toEqual(stub.name);
            const mock = facade.createMock();
            expect(facade['createdMocks']).toEqual([mock]);
            facade.restoreFacade();
            expect(facade['methodSpy'].name).toEqual(FacadeClass.prototype.methodSpy.name);
            expect(facade['methodStub'].name).toEqual(FacadeClass.prototype.methodStub.name);
            expect(facade['createdMocks']).toEqual([]);
        });
    });
    describe('.reloadFacadeRoot()', function () {
        it('calls facadeInstanceCreator() and assigns to container with key', function () {
            class FacadeClass extends Facade_1.Facade {
            }
            const instance = new FacadeClass();
            const container = {
                key: instance
            };
            const key = 'key';
            const instanceCreator = () => {
                return new FacadeClass();
            };
            const facade = Facade_1.Facade.create(container, key, instanceCreator);
            expect(container.key === instance).toBe(true);
            facade.reloadFacadeRoot();
            expect(container.key === instance).toBe(false);
        });
    });
});
