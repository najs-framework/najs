"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var class_registry_circular_reference_check_1 = require("../private/class_registry_circular_reference_check");
var ClassRegistryCollection = /** @class */ (function () {
    function ClassRegistryCollection() {
        this.items = {};
    }
    ClassRegistryCollection.prototype.register = function (item) {
        this.assertRegistryItemCouldBeUpdated(item.className);
        this.assertNoCircularReference();
        this.items[item.className] = item;
    };
    ClassRegistryCollection.prototype.findOrFail = function (className) {
        if (!this.has(className)) {
            throw new ReferenceError(className + ' is not found or not registered yet');
        }
        return this.items[className];
    };
    ClassRegistryCollection.prototype.has = function (className) {
        return typeof this.items[className] !== 'undefined';
    };
    ClassRegistryCollection.prototype.assertRegistryItemCouldBeUpdated = function (className) {
        if (this.has(className)) {
            var registry = this.items[className];
            if (!registry.overridable) {
                throw new Error('Can not overridable ' + className);
            }
        }
    };
    ClassRegistryCollection.prototype.assertNoCircularReference = function (item) {
        var result = lodash_1.mapValues(this.items, 'concreteClassName');
        if (item) {
            result[item.className] = item.concreteClassName;
        }
        var circularReferences = class_registry_circular_reference_check_1.class_registry_circular_reference_check(result);
        if (class_registry_circular_reference_check_1.class_registry_circular_reference_check(result) !== false) {
            throw new Error('Circular reference detected "' + circularReferences.join(' => ') + '"');
        }
    };
    return ClassRegistryCollection;
}());
exports.ClassRegistryCollection = ClassRegistryCollection;
global['Najs'] = global['Najs'] || {};
global['Najs']['classRegistry'] = global['Najs']['classRegistry'] || {};
global['Najs']['classRegistry'] = new ClassRegistryCollection();
exports.ClassRegistry = global['Najs']['classRegistry'];
//# sourceMappingURL=ClassRegistry.js.map