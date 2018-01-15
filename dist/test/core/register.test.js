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
class TestAutoload {
    getClassName() {
        return 'TestAutoload';
    }
}
class TestClassName {
}
TestClassName.className = 'TestClassName';
class Invalid {
}
describe('Najs.register', function () {
    it('throws an TypeError if the class definition not implemented IAutoload or has no className', function () {
        try {
            expect(lib_1.register(Invalid));
        }
        catch (error) {
            expect(error instanceof TypeError);
            expect(error.message).toEqual('Please define "className" or "getClassName" for ' + Invalid);
            return;
        }
        expect('should throw a TypeError').toEqual('');
    });
    describe('<typeof T>(classDefinition: T)', function () {
        it('can registry a class definition by called IAutoload.getClassName()', function () {
            lib_1.register(TestAutoload);
            expect(lib_1.ClassRegistry.findOrFail('TestAutoload')).toEqual({
                className: 'TestAutoload',
                instanceConstructor: TestAutoload,
                overridable: true,
                singleton: false
            });
        });
        it('can registry a class definition get value of property Class.className', function () {
            lib_1.register(TestClassName);
            expect(lib_1.ClassRegistry.findOrFail('TestClassName')).toEqual({
                className: 'TestClassName',
                instanceConstructor: TestClassName,
                overridable: true,
                singleton: false
            });
        });
    });
    describe('<typeof T>(classDefinition: T, className: string)', function () {
        it('can register an class definition with custom name', function () {
            lib_1.register(TestAutoload, 'Najs.TestAutoload');
            expect(lib_1.ClassRegistry.findOrFail('Najs.TestAutoload')).toEqual({
                className: 'Najs.TestAutoload',
                instanceConstructor: TestAutoload,
                overridable: true,
                singleton: false
            });
        });
        it('we often use this param for overriding the class definition', function () {
            lib_1.register(TestClassName, 'Najs.TestAutoload');
            expect(lib_1.ClassRegistry.findOrFail('Najs.TestAutoload')).toEqual({
                className: 'Najs.TestAutoload',
                instanceConstructor: TestClassName,
                overridable: true,
                singleton: false
            });
        });
    });
    describe('<typeof T>(classDefinition: T, className: string, overridable: boolean)', function () {
        it('can lock the definition, no one can override it', function () {
            lib_1.register(TestAutoload, 'Not-Overridable', false);
            expect(lib_1.ClassRegistry.findOrFail('Not-Overridable')).toEqual({
                className: 'Not-Overridable',
                instanceConstructor: TestAutoload,
                overridable: false,
                singleton: false
            });
        });
        it('we often use this param for overriding the class definition', function () {
            try {
                lib_1.register(TestClassName, 'Not-Overridable');
            }
            catch (error) {
                expect(error instanceof Error);
                expect(error.message).toEqual('Can not overridable Not-Overridable');
                return;
            }
            expect('should throw an Error').toEqual('');
        });
    });
    describe('<typeof T>(classDefinition: T, className: string, overridable: boolean, singleton: boolean)', function () {
        it('has default value is false', function () {
            lib_1.register(TestAutoload, 'Singleton', true);
            expect(lib_1.ClassRegistry.findOrFail('Singleton')).toEqual({
                className: 'Singleton',
                instanceConstructor: TestAutoload,
                overridable: true,
                singleton: false
            });
        });
        it('can define a class is singleton', function () {
            lib_1.register(TestAutoload, 'Singleton', false, true);
            expect(lib_1.ClassRegistry.findOrFail('Singleton')).toEqual({
                className: 'Singleton',
                instanceConstructor: TestAutoload,
                overridable: false,
                singleton: true
            });
        });
    });
    describe('@register(name?: string)', function () {
        it('can be used as a decorator', function () {
            let A = class A {
                getClassName() {
                    return 'A';
                }
            };
            A = __decorate([
                lib_1.register()
            ], A);
            expect(new A()).toBeInstanceOf(A);
            expect(lib_1.ClassRegistry.findOrFail('A')).toEqual({
                className: 'A',
                instanceConstructor: A,
                overridable: true,
                singleton: false
            });
        });
        it('can be used if class has static className', function () {
            let B = class B {
            };
            B.className = 'B';
            B = __decorate([
                lib_1.register()
            ], B);
            expect(new B()).toBeInstanceOf(B);
            expect(lib_1.ClassRegistry.findOrFail('B')).toEqual({
                className: 'B',
                instanceConstructor: B,
                overridable: true,
                singleton: false
            });
        });
        it('can be used as a decorator with custom name', function () {
            let C = class C {
            };
            C = __decorate([
                lib_1.register('Cindy')
            ], C);
            expect(new C()).toBeInstanceOf(C);
            expect(lib_1.ClassRegistry.findOrFail('Cindy')).toEqual({
                className: 'Cindy',
                instanceConstructor: C,
                overridable: true,
                singleton: false
            });
        });
    });
});
//# sourceMappingURL=register.test.js.map