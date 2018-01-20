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
class Repository {
    getSomething() {
        return 'something';
    }
}
Repository.className = 'Repository';
exports.Repository = Repository;
class TestAutoloadPropertyDecorator {
    getSomething() {
        return this.repository.getSomething();
    }
}
TestAutoloadPropertyDecorator.className = 'TestAutoloadDecorator';
__decorate([
    lib_1.autoload(Repository.className)
], TestAutoloadPropertyDecorator.prototype, "repository", void 0);
exports.TestAutoloadPropertyDecorator = TestAutoloadPropertyDecorator;
describe('@autoload', function () {
    lib_1.register(Repository);
    it('can be used for property inside a class to initialize automatically', function () {
        for (let i = 0; i < 10; i++) {
            const hosted = new TestAutoloadPropertyDecorator();
            expect(hosted.repository).toBeInstanceOf(Repository);
        }
    });
    it('creates new instance of autoload property for every instance of hosted class', function () {
        let previousInstance;
        for (let i = 0; i < 100; i++) {
            const hosted = new TestAutoloadPropertyDecorator();
            expect(hosted.repository).toBeInstanceOf(Repository);
            if (previousInstance) {
                expect(previousInstance === hosted.repository).toBe(false);
            }
            previousInstance = hosted.repository;
        }
    });
    it('creates single instance inside the hosted class', function () {
        const hosted = new TestAutoloadPropertyDecorator();
        let previousInstance = hosted.repository;
        for (let i = 0; i < 100; i++) {
            expect(previousInstance === hosted.repository).toBe(true);
            previousInstance = hosted.repository;
        }
    });
    it('prevents assign new value to autoload property', function () {
        const hosted = new TestAutoloadPropertyDecorator();
        try {
            hosted.repository = new Repository();
        }
        catch (error) {
            expect(error instanceof Error);
            expect(error.message).toEqual('Can not set autoload property "repository"');
            return;
        }
        expect('should throw a Error').toEqual('');
    });
    it('throws a TypeError if used to decorate a class', function () {
        try {
            let DecorateByAutoload = class DecorateByAutoload {
            };
            DecorateByAutoload = __decorate([
                lib_1.autoload('Repository')
            ], DecorateByAutoload);
            new DecorateByAutoload();
        }
        catch (error) {
            expect(error instanceof TypeError);
            expect(error.message).toEqual('Could not apply autoload decorator to Class');
            return;
        }
        expect('should throw a Error').toEqual('');
    });
    it('throws a TypeError if used to decorate a method', function () {
        try {
            class DecorateByAutoload {
                getSomething() { }
            }
            __decorate([
                lib_1.autoload('Repository')
            ], DecorateByAutoload.prototype, "getSomething", null);
            new DecorateByAutoload();
        }
        catch (error) {
            expect(error instanceof TypeError);
            expect(error.message).toEqual('Could not apply autoload decorator to Method');
            return;
        }
        expect('should throw a Error').toEqual('');
    });
});
