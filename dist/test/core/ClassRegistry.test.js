"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const ClassRegistryItem_1 = require("../../lib/private/ClassRegistryItem");
const lib_1 = require("../../lib");
describe('ClassRegistry', function () {
    describe('register', function () {
        it('can detect circular reference', function () {
            const noCircular = new ClassRegistryItem_1.ClassRegistryItem('NoCircular', undefined, undefined, true, false);
            lib_1.ClassRegistry.register(noCircular);
            try {
                const circular = new ClassRegistryItem_1.ClassRegistryItem('circular', undefined, undefined, true, false);
                circular.concreteClassName = 'circular';
                lib_1.ClassRegistry.register(circular);
            }
            catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toEqual('Circular reference detected "circular => circular"');
                return;
            }
            expect('should not reach here').toEqual('yay');
        });
    });
});
