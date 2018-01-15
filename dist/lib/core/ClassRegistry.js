"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const class_registry_circular_reference_check_1 = require("../private/class_registry_circular_reference_check");
class ClassRegistryCollection {
    constructor() {
        this.items = {};
    }
    register(item) {
        this.assertRegistryItemCouldBeUpdated(item.className);
        this.assertNoCircularReference(item);
        this.items[item.className] = item;
    }
    findOrFail(className) {
        if (!this.has(className)) {
            throw new ReferenceError(className + ' is not found or not registered yet');
        }
        return this.items[className];
    }
    has(className) {
        return typeof this.items[className] !== 'undefined';
    }
    assertRegistryItemCouldBeUpdated(className) {
        if (this.has(className)) {
            const registry = this.items[className];
            if (!registry.overridable) {
                throw new Error('Can not overridable ' + className);
            }
        }
    }
    assertNoCircularReference(item) {
        const result = lodash_1.mapValues(this.items, 'concreteClassName');
        result[item.className] = item.concreteClassName;
        const circularReferences = class_registry_circular_reference_check_1.class_registry_circular_reference_check(result);
        if (class_registry_circular_reference_check_1.class_registry_circular_reference_check(result) !== false) {
            throw new Error('Circular reference detected "' + circularReferences.join(' => ') + '"');
        }
    }
}
exports.ClassRegistryCollection = ClassRegistryCollection;
global['Najs'] = global['Najs'] || {};
global['Najs']['classRegistry'] = global['Najs']['classRegistry'] || {};
global['Najs']['classRegistry'] = new ClassRegistryCollection();
exports.ClassRegistry = global['Najs']['classRegistry'];
//# sourceMappingURL=ClassRegistry.js.map