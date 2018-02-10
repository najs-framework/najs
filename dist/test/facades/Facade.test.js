"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Facade_1 = require("../../lib/facades/Facade");
// import { AppFacade } from './../../lib/facades/global/AppFacade'
describe('Facade', function () {
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
});
