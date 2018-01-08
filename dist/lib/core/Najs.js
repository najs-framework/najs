"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var make_1 = require("./make");
var register_1 = require("./register");
var NajsDefaultOptions = {
    port: 3000,
    host: 'localhost',
    httpDriver: 'ExpressHttpDriver'
};
var Najs = /** @class */ (function () {
    function Najs() {
    }
    Najs.use = function (options) {
        this.options = Object.assign({}, NajsDefaultOptions, options);
        return Najs;
    };
    Najs.make = function (className, data) {
        return make_1.make(className, data);
    };
    Najs.register = function (classDefinition, className, overridable, singleton) {
        register_1.register(classDefinition, className, overridable, singleton);
        return this;
    };
    Najs.loadClasses = function (classes) {
        return this;
    };
    Najs.start = function (options) {
        if (options) {
            this.use(options);
        }
        var httpDriver = make_1.make(this.options.httpDriver);
        httpDriver.start(this.options);
    };
    Najs.options = NajsDefaultOptions;
    return Najs;
}());
exports.Najs = Najs;
//# sourceMappingURL=Najs.js.map