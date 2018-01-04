"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
var lib_1 = require("../../lib");
var Test = /** @class */ (function () {
    function Test() {
    }
    Test.prototype.getClassName = function () {
        return 'Test';
    };
    Test.prototype.getSomething = function () {
        return 'something';
    };
    Test.prototype.getFromParent = function () {
        return 'gift';
    };
    return Test;
}());
var TestCached = /** @class */ (function (_super) {
    __extends(TestCached, _super);
    function TestCached() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestCached.prototype.getClassName = function () {
        return 'TestCached';
    };
    TestCached.prototype.getSomething = function () {
        return 'something cached';
    };
    TestCached.prototype.getFromParent = function () {
        return 'thanks for your ' + _super.prototype.getFromParent.call(this);
    };
    return TestCached;
}(Test));
var Singleton = /** @class */ (function (_super) {
    __extends(Singleton, _super);
    function Singleton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Singleton.prototype.getClassName = function () {
        return 'Singleton';
    };
    return Singleton;
}(Test));
var TestInstanceWithData = /** @class */ (function () {
    function TestInstanceWithData(any) {
        this.any = any || '';
    }
    TestInstanceWithData.prototype.getClassName = function () {
        return 'TestInstanceWithData';
    };
    TestInstanceWithData.prototype.createClassInstance = function (data) {
        var instance = new TestInstanceWithData();
        if (data) {
            for (var name in data) {
                instance[name] = data[name];
            }
        }
        return instance;
    };
    return TestInstanceWithData;
}());
describe('Najs.make', function () {
    lib_1.register(Test);
    it('throws an ReferenceError if the class definition was not register', function () {
        try {
            expect(lib_1.make('NotFound'));
        }
        catch (error) {
            expect(error instanceof ReferenceError);
            expect(error.message).toEqual('NotFound is not found or not registered yet');
            return;
        }
        expect('should throw a ReferenceError').toEqual('');
    });
    describe('<T>(classDefinition: T)', function () {
        it('can make an instance of class definition which was register by Najs.register()', function () {
            expect(lib_1.make(Test)).toBeInstanceOf(Test);
        });
        it('always returns new instance if class definitions was register by Najs.register()', function () {
            expect(lib_1.make(Test) === lib_1.make(Test)).toBe(false);
            expect(lib_1.make(Test).getSomething()).toEqual('something');
            expect(lib_1.make(Test).getFromParent()).toEqual('gift');
        });
        it('always returns same instance of class if it is singleton', function () {
            lib_1.register(Singleton, 'Singleton', true, true);
            expect(lib_1.make(Singleton) === lib_1.make(Singleton)).toBe(true);
            expect(lib_1.make(Singleton) === lib_1.make(Singleton)).toBe(true);
            expect(lib_1.make(Singleton) === lib_1.make(Singleton)).toBe(true);
            expect(lib_1.make(Singleton) === lib_1.make(Singleton)).toBe(true);
        });
        it('always returns newest instance of class definitions was overridden', function () {
            lib_1.register(TestCached, 'Test');
            expect(lib_1.make(Test)).toBeInstanceOf(Test);
            expect(lib_1.make(Test)).toBeInstanceOf(TestCached);
            expect(lib_1.make(Test).getClassName()).toEqual('TestCached');
            expect(lib_1.make(Test).getSomething()).toEqual('something cached');
            expect(lib_1.make(Test).getFromParent()).toEqual('thanks for your gift');
        });
    });
    describe('<T>(className: string)', function () {
        it('works same way like passing a class definition', function () {
            expect(lib_1.make('Test') === lib_1.make('Test')).toBe(false);
            expect(lib_1.make('Test')).toBeInstanceOf(Test);
            expect(lib_1.make('Test')).toBeInstanceOf(TestCached);
            expect(lib_1.make('Test').getClassName()).toEqual('TestCached');
            expect(lib_1.make('Test').getSomething()).toEqual('something cached');
            expect(lib_1.make('Test').getFromParent()).toEqual('thanks for your gift');
        });
    });
    describe('<T>(nameOrDefinition: T | string, data: Object)', function () {
        it('does not create instance with data if createClassInstance() is not implemented', function () {
            expect(lib_1.make(Test, { any: 'something' }).any).toBeUndefined();
        });
        it('calls createClassInstance() and pass data to create new instance', function () {
            lib_1.register(TestInstanceWithData);
            expect(lib_1.make(TestInstanceWithData, { any: 'something' }).any).toEqual('something');
        });
    });
});
//# sourceMappingURL=make.test.js.map