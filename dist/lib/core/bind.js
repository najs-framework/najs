"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClassRegistry_1 = require("./ClassRegistry");
var ClassRegistryItem_1 = require("../private/ClassRegistryItem");
var lodash_1 = require("lodash");
function bind(abstract, concrete) {
    if (ClassRegistry_1.ClassRegistry.has(abstract)) {
        ClassRegistry_1.ClassRegistry.assertRegistryItemCouldBeUpdated(abstract);
        var item_1 = ClassRegistry_1.ClassRegistry.findOrFail(abstract);
        if (lodash_1.isString(concrete)) {
            item_1.concreteClassName = concrete;
        }
        else {
            item_1.instanceCreator = concrete;
        }
    }
    var item = new ClassRegistryItem_1.ClassRegistryItem(abstract, undefined, lodash_1.isFunction(concrete) ? concrete : undefined, undefined, undefined, undefined);
    if (lodash_1.isString(concrete)) {
        item.concreteClassName = concrete;
    }
    return ClassRegistry_1.ClassRegistry.register(item);
}
exports.bind = bind;
//# sourceMappingURL=bind.js.map