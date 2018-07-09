"use strict";
/// <reference path="../contracts/types/http.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_facade_1 = require("najs-facade");
class TestSuite {
    static getFramework() {
        return this.najs;
    }
    static setFramework(najs, startOptions = { createServer: false }) {
        this.najs = najs;
        this.startOptions = startOptions;
        return this.najs;
    }
    static clear() {
        this.najs = undefined;
    }
    setUp() {
        if (typeof TestSuite.najs === 'undefined' || TestSuite.najs.isStarted()) {
            return;
        }
        return new Promise(resolve => {
            TestSuite.najs.start(TestSuite.startOptions).then(() => {
                this.nativeHttpDriver = TestSuite.najs.getNativeHttpDriver();
                resolve();
            });
        });
    }
    tearDown() {
        najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
    }
}
exports.TestSuite = TestSuite;
