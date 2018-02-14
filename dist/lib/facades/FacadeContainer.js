"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacadeContainersBag = [];
class FacadeContainer {
    markFacadeWasUsed(key, type) {
        if (typeof this.usedFacades === 'undefined') {
            this.usedFacades = {};
        }
        if (typeof this.usedFacades[type] === 'undefined') {
            this.usedFacades[type] = [];
        }
        this.usedFacades[type].push(key);
    }
    verifyMocks() {
        if (!this.usedFacades || !this.usedFacades.mock) {
            return;
        }
        const facadeKeys = Array.from(new Set(this.usedFacades.mock));
        for (const key of facadeKeys) {
            if (!this[key] || !this[key].createdMocks) {
                continue;
            }
            for (const mock of this[key].createdMocks) {
                mock.verify();
            }
        }
    }
    restoreFacades() {
        if (!this.usedFacades) {
            return;
        }
        const facadeKeys = Array.from(new Set([].concat(this.usedFacades.spy || [], this.usedFacades.stub || [], this.usedFacades.mock || [])));
        for (const key of facadeKeys) {
            if (!this[key]) {
                continue;
            }
            this[key].restoreFacade();
        }
    }
}
exports.FacadeContainer = FacadeContainer;
