"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClassRegistry_1 = require("./../core/ClassRegistry");
const lodash_1 = require("lodash");
class ClassRegistryItem {
    constructor(className, instanceConstructor, instanceCreator, instance, overridable, singleton) {
        this.className = className;
        this.concreteClassName = undefined;
        this.instanceConstructor = instanceConstructor;
        this.instanceCreator = instanceCreator;
        this.instance = instance;
        this.overridable = overridable === false ? false : true;
        this.singleton = singleton === true ? true : false;
    }
    createInstance() {
        if (this.concreteClassName) {
            if (ClassRegistry_1.ClassRegistry.has(this.concreteClassName)) {
                return ClassRegistry_1.ClassRegistry.findOrFail(this.concreteClassName).createInstance();
            }
            return undefined;
        }
        if (lodash_1.isFunction(this.instanceConstructor)) {
            return Object.create(this.instanceConstructor.prototype);
        }
        if (lodash_1.isFunction(this.instanceCreator)) {
            return this.instanceCreator.call(undefined);
        }
        if (this.singleton) {
            return this.instance;
        }
        return undefined;
    }
    make(data) {
        if (this.singleton && this.instance) {
            return this.instance;
        }
        let instance = this.createInstance();
        if (typeof data !== 'undefined' && lodash_1.isFunction(instance['createClassInstance'])) {
            instance = instance.createClassInstance(data);
        }
        if (this.singleton) {
            this.instance = instance;
        }
        return instance;
    }
}
exports.ClassRegistryItem = ClassRegistryItem;
//# sourceMappingURL=ClassRegistryItem.js.map