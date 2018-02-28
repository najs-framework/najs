"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const najs_binding_1 = require("najs-binding");
const HandlebarsHelper_1 = require("../../../lib/view/handlebars/HandlebarsHelper");
class TestHelper extends HandlebarsHelper_1.HandlebarsHelper {
    run() { }
}
TestHelper.className = 'TestHelper';
najs_binding_1.register(TestHelper);
describe('HandlebarsHelper', function () {
    describe('constructor()', function () {
        it('assigns context in param to "context", and assigns controller if exists', function () {
            const context = {};
            const helper = Reflect.construct(TestHelper, [context]);
            expect(helper['context'] === context).toBe(true);
            const controller = {};
            const helperWithController = Reflect.construct(TestHelper, [context, controller]);
            expect(helperWithController['controller'] === controller).toBe(true);
        });
    });
    describe('.isBlockHelper()', function () {
        it('return true if "this.options.fn" is a function', function () {
            const context = {};
            const helper = Reflect.construct(TestHelper, [context]);
            expect(helper.isBlockHelper()).toBe(false);
            helper['options'] = {};
            expect(helper.isBlockHelper()).toBe(false);
            helper['options'] = { fn: 'any' };
            expect(helper.isBlockHelper()).toBe(false);
            helper['options'] = { fn: function () { } };
            expect(helper.isBlockHelper()).toBe(true);
        });
    });
    describe('.renderChildren()', function () {
        it('calls "this.options.fn"', function () {
            const context = {};
            const options = { fn: () => { }, data: 'anything' };
            const optionsFnSpy = Sinon.spy(options, 'fn');
            const helper = Reflect.construct(TestHelper, [context]);
            helper['options'] = options;
            helper.renderChildren(['test']);
            expect(optionsFnSpy.calledWith(helper['context'], { data: options.data, blockParams: ['test'] })).toBe(true);
        });
    });
    describe('static create()', function () {
        it('returns a function', function () {
            const helper = HandlebarsHelper_1.HandlebarsHelper.create(TestHelper);
            expect(typeof helper).toEqual('function');
        });
        it('the return function will take the options (last argument), create instance and call .run()', function () {
            const options = {};
            const helper = HandlebarsHelper_1.HandlebarsHelper.create(TestHelper);
            const runStub = Sinon.stub(TestHelper.prototype, 'run');
            helper('test', options);
            expect(runStub.lastCall.thisValue).toBeInstanceOf(TestHelper);
            expect(runStub.lastCall.thisValue['options'] === options).toBe(true);
            runStub.restore();
        });
    });
});
