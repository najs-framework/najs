"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function class_registry_circular_reference_check(items) {
    for (const className in items) {
        if (typeof items[className] === 'undefined') {
            continue;
        }
        const traveled = [];
        let currentName = className;
        while (typeof items[currentName] !== 'undefined') {
            if (traveled.indexOf(currentName) !== -1) {
                traveled.push(currentName);
                return traveled;
            }
            traveled.push(currentName);
            currentName = items[currentName];
        }
    }
    return false;
}
exports.class_registry_circular_reference_check = class_registry_circular_reference_check;
