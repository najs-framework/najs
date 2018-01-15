"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const lib_1 = require("../../lib");
describe('ClassRegistryItem', function () {
    describe('private createInstance', function () {
        it('creates instance from instanceConstructor if it set', function () {
            let Test = class Test {
            };
            Test.className = 'Test';
            Test = __decorate([
                lib_1.register()
            ], Test);
            expect(lib_1.ClassRegistry.findOrFail('Test')['createInstance']()).toBeInstanceOf(Test);
        });
        it('creates instance from instanceCreator if instanceConstructor not found', function () {
            const classRegistryItem = lib_1.ClassRegistry.findOrFail('Test');
            classRegistryItem.instanceConstructor = undefined;
            classRegistryItem.instanceCreator = function () {
                return new Date();
            };
            expect(classRegistryItem['createInstance']()).toBeInstanceOf(Date);
        });
        it('return instance if instanceConstructor and instanceCreator not found and singleton is true', function () {
            const classRegistryItem = lib_1.ClassRegistry.findOrFail('Test');
            classRegistryItem.instanceConstructor = undefined;
            classRegistryItem.instanceCreator = undefined;
            classRegistryItem.instance = new Date();
            classRegistryItem.singleton = true;
            expect(classRegistryItem['createInstance']()).toBeInstanceOf(Date);
        });
        it('return undefined if instanceConstructor and instanceCreator not found', function () {
            const classRegistryItem = lib_1.ClassRegistry.findOrFail('Test');
            classRegistryItem.instanceConstructor = undefined;
            classRegistryItem.instanceCreator = undefined;
            classRegistryItem.singleton = false;
            expect(classRegistryItem['createInstance']()).toBeUndefined();
        });
    });
});
//# sourceMappingURL=ClassRegistryItem.test.js.map