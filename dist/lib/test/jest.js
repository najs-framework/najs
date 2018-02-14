"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
function jest(group = 'test') {
    return function decorator(Target) {
        generateTestFromTestSuite(Target);
    };
}
exports.jest = jest;
function generateTestFromTestSuite(suite) {
    const functions = Object.getOwnPropertyNames(suite.prototype);
    const tests = [];
    for (const name of functions) {
        if (name === 'constructor' || name.indexOf('test') !== 0) {
            continue;
        }
        tests.push(name);
    }
    const instance = Reflect.construct(suite, []);
    describe(suite.name, function () {
        beforeEach(instance.setUp.bind(instance));
        afterEach(instance.tearDown.bind(instance));
        for (const testName of tests) {
            it(testName, instance[testName].bind(instance));
        }
    });
}
