"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Facade_1 = require("../../lib/facades/Facade");
const FacadeContainer_1 = require("../../lib/facades/FacadeContainer");
const InputContextualFacade_1 = require("../../lib/facades/contextual/InputContextualFacade");
describe('ContextualFacade', function () {
    it('does something', function () {
        Facade_1.Facade(InputContextualFacade_1.InputContextualFacade)
            .with('test')
            .shouldReceive('doSomething')
            .once();
        Facade_1.Facade(InputContextualFacade_1.InputContextualFacade)
            .with('testing')
            .shouldReceive('doSomething')
            .twice();
        InputContextualFacade_1.InputContextualFacade.of('test').doSomething();
        InputContextualFacade_1.InputContextualFacade.of('testing').doSomething();
        InputContextualFacade_1.InputContextualFacade.of('testing').doSomething();
        InputContextualFacade_1.InputContextualFacade.of('testing-not-match').doSomething();
        for (const container of FacadeContainer_1.FacadeContainersBag) {
            container.verifyMocks();
        }
        for (const container of FacadeContainer_1.FacadeContainersBag) {
            container.restoreFacades();
        }
    });
});
