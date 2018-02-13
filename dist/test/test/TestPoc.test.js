"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jest_1 = require("../../lib/test/jest");
const TestSuite_1 = require("../../lib/test/TestSuite");
let TestPoc = class TestPoc extends TestSuite_1.TestSuite {
    testSomething() {
        // console.log('test')
    }
};
TestPoc = __decorate([
    jest_1.jest()
], TestPoc);
exports.TestPoc = TestPoc;
