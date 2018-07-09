"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { INajs } from '../core/INajs'
const najs_facade_1 = require("najs-facade");
class TestSuite {
    // static start(najs: INajs) {
    //   this.najs = najs
    // }
    // async setUpExpressIfNeeded() {
    //   // if (!TestSuite.isSetUpExpress) {
    //   //   await Najs.start({
    //   //     createServer: false
    //   //   })
    //   //   TestSuite.isSetUpExpress = true
    //   //   this.express = Najs['httpDriver']['express']
    //   // }
    // }
    setUp() { }
    tearDown() {
        najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
    }
}
exports.TestSuite = TestSuite;
