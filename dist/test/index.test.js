"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
var lib_1 = require("../lib");
var Test = /** @class */ (function () {
    function Test() {
    }
    Test.className = 'Test';
    return Test;
}());
describe('Najs', function () {
    it('proxies register() function', function () {
        lib_1.default.register(Test);
    });
    it('proxies make() function', function () {
        expect(lib_1.default.make(Test)).toBeInstanceOf(Test);
    });
});
//# sourceMappingURL=index.test.js.map