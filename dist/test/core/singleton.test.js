"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Register = require("../../lib/core/register");
const singleton_1 = require("../../lib/core/singleton");
const spy = Sinon.spy(Register, 'register');
describe('Najs.singleton', function () {
    it('just a shortcut of register()', function () { });
    it('always passes true to singleton param of register()', function () {
        class Test {
        }
        Test.className = 'Test';
        singleton_1.singleton(Test);
        expect(spy.calledWith(Test, undefined, undefined, true)).toBe(true);
        spy.reset();
    });
    describe('<typeof T>(classDefinition: T)', function () {
        it('calls register(classDefinition, undefined, undefined, true)', function () {
            class Test {
            }
            Test.className = 'Test';
            singleton_1.singleton(Test);
            expect(spy.calledWith(Test, undefined, undefined, true)).toBe(true);
            spy.reset();
        });
    });
    describe('<typeof T>(classDefinition: T, className: string)', function () {
        it('calls register(classDefinition, className, undefined, true)', function () {
            class Test {
            }
            Test.className = 'Test';
            singleton_1.singleton(Test, 'Any');
            expect(spy.calledWith(Test, 'Any', undefined, true)).toBe(true);
            spy.reset();
        });
    });
    describe('<typeof T>(classDefinition: T, className: string, overridable: boolean)', function () {
        it('calls register(classDefinition, className, overridable, true)', function () {
            class Test {
            }
            Test.className = 'Test';
            singleton_1.singleton(Test, 'Any', true);
            expect(spy.calledWith(Test, 'Any', true, true)).toBe(true);
            spy.reset();
            singleton_1.singleton(Test, 'Any', false);
            expect(spy.calledWith(Test, 'Any', false, true)).toBe(true);
            spy.reset();
        });
    });
    describe('@singleton(name?: string)', function () {
        it('calls register(name, undefined, undefined, true)', function () {
            let Test = class Test {
            };
            Test.className = 'Decorate';
            Test = __decorate([
                singleton_1.singleton()
            ], Test);
            expect(spy.calledWith(Test, undefined, false, true)).toBe(true);
            spy.reset();
            let Class = class Class {
            };
            Class.className = 'Class';
            Class = __decorate([
                singleton_1.singleton('CustomClass')
            ], Class);
            expect(spy.calledWith(Class, 'CustomClass', false, true)).toBe(true);
            spy.reset();
        });
    });
});
//# sourceMappingURL=singleton.test.js.map