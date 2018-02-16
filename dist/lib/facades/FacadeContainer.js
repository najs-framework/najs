"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FacadeContainer {
    constructor(cleanable) {
        this.cleanable = cleanable || false;
    }
    static clearBucket() {
        this.Bucket = this.Bucket.filter((container) => {
            return !container.clean();
        });
    }
    static verifyAndRestoreAllFacades() {
        for (const container of this.Bucket) {
            container.verifyMocks();
        }
        for (const container of this.Bucket) {
            container.restoreFacades();
        }
        this.clearBucket();
    }
    clean() {
        if (!this.cleanable) {
            return false;
        }
        const classMembers = [
            'constructor',
            'markFacadeWasUsed',
            'verifyMocks',
            'restoreFacades',
            'getKeyByCount',
            'cleanable'
        ];
        for (const name in this) {
            if (classMembers.indexOf(name) !== -1) {
                continue;
            }
            delete this[name];
        }
        return true;
    }
    getKeyByCount(key) {
        if (!this.keyByCount) {
            this.keyByCount = {};
        }
        if (!this.keyByCount[key]) {
            this.keyByCount[key] = 0;
        }
        const count = ++this.keyByCount[key];
        return key.replace('{count}', count.toString());
    }
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
FacadeContainer.Bucket = [];
exports.FacadeContainer = FacadeContainer;
