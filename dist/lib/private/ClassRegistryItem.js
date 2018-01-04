"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var ClassRegistryItem = /** @class */ (function () {
    function ClassRegistryItem(className, instanceConstructor, instanceCreator, instance, overridable, singleton) {
        this.className = className;
        this.concreteClassName = undefined;
        this.instanceConstructor = instanceConstructor;
        this.instanceCreator = instanceCreator;
        this.instance = instance;
        this.overridable = overridable === false ? false : true;
        this.singleton = singleton === true ? true : false;
    }
    ClassRegistryItem.prototype.createInstance = function () {
        if (lodash_1.isFunction(this.instanceConstructor)) {
            return Object.create(this.instanceConstructor.prototype);
        }
    };
    ClassRegistryItem.prototype.make = function (data) {
        if (this.singleton && this.instance) {
            return this.instance;
        }
        var instance = this.createInstance();
        if (typeof data !== 'undefined' && lodash_1.isFunction(instance['createClassInstance'])) {
            instance = instance.createClassInstance(data);
        }
        if (this.singleton) {
            this.instance = instance;
        }
        return instance;
    };
    return ClassRegistryItem;
}());
exports.ClassRegistryItem = ClassRegistryItem;
//# sourceMappingURL=ClassRegistryItem.js.map