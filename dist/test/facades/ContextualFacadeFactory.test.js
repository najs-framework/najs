"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const ContextualFacadeFactory_1 = require("../../lib/facades/ContextualFacadeFactory");
describe('ContextualFacadeFactory', function () {
    it('is created with a createContextualFacade function', function () {
        const creator = (context) => { };
        const factory = new ContextualFacadeFactory_1.ContextualFacadeFactory(creator);
        expect(factory.contextualFacadeCreator === creator).toBe(true);
    });
    const verbs = ['of', 'with', 'for', 'at', 'from'];
    for (const verb of verbs) {
        describe('.' + verb + '()', function () {
            it('just calls contextualFacadeCreator and passes a context', function () {
                const creator = (context) => { };
                const factory = new ContextualFacadeFactory_1.ContextualFacadeFactory(creator);
                const contextualFacadeCreatorSpy = Sinon.spy(factory, 'contextualFacadeCreator');
                factory[verb]('anything');
                expect(contextualFacadeCreatorSpy.calledWith('anything')).toBe(true);
            });
        });
    }
});
