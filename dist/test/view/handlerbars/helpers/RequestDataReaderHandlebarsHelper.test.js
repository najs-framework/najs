"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const RequestDataReaderHandlebarsHelper_1 = require("../../../../lib/view/handlebars/helpers/RequestDataReaderHandlebarsHelper");
describe('RequestDataReaderHandlebarsHelper', function () {
    it('implements IAutoload interface', function () {
        const helper = Reflect.construct(RequestDataReaderHandlebarsHelper_1.RequestDataReaderHandlebarsHelper, []);
        expect(helper.getClassName()).toEqual('Najs.RequestDataReaderHandlebarsHelper');
    });
    describe('BlockHelper: {{#Input ...}} body {{/Input}}', function () {
        it('does nothing if the controller not found, return undefined', function () {
            const helper = Reflect.construct(RequestDataReaderHandlebarsHelper_1.RequestDataReaderHandlebarsHelper, []);
            const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
            isBlockHelperStub.returns(true);
            expect(helper.run('test')).toBeUndefined();
            isBlockHelperStub.restore();
        });
        it('does nothing if input (or body/query/params) in the controller not found, return undefined', function () {
            const helper = Reflect.construct(RequestDataReaderHandlebarsHelper_1.RequestDataReaderHandlebarsHelper, []);
            helper['controller'] = {};
            const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
            isBlockHelperStub.returns(true);
            expect(helper.run('test')).toBeUndefined();
            isBlockHelperStub.restore();
        });
        it('proxies "has" function if it is a block helper', function () { });
        it('calls .renderChildren() if has key in input (or body/query/params)', function () {
            const helper = Reflect.construct(RequestDataReaderHandlebarsHelper_1.RequestDataReaderHandlebarsHelper, []);
            const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
            isBlockHelperStub.returns(true);
            helper['property'] = 'input';
            helper['controller'] = {
                input: {
                    has() {
                        return true;
                    }
                }
            };
            const renderChildrenStub = Sinon.stub(helper, 'renderChildren');
            expect(helper.run('test')).toBeUndefined();
            expect(renderChildrenStub.called).toBe(true);
            isBlockHelperStub.restore();
            renderChildrenStub.restore();
        });
        it('returns undefined if has no key in input (or body/query/params)', function () {
            const helper = Reflect.construct(RequestDataReaderHandlebarsHelper_1.RequestDataReaderHandlebarsHelper, []);
            const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
            isBlockHelperStub.returns(true);
            helper['property'] = 'input';
            helper['controller'] = {
                input: {
                    has() {
                        return false;
                    }
                }
            };
            const renderChildrenStub = Sinon.stub(helper, 'renderChildren');
            expect(helper.run('test')).toBeUndefined();
            expect(renderChildrenStub.called).toBe(false);
            isBlockHelperStub.restore();
            renderChildrenStub.restore();
        });
    });
    describe('Helper: {{Input ...}}', function () {
        it('does nothing if the controller not found, return empty string', function () {
            const helper = Reflect.construct(RequestDataReaderHandlebarsHelper_1.RequestDataReaderHandlebarsHelper, []);
            const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
            isBlockHelperStub.returns(false);
            expect(helper.run('test')).toEqual('');
            isBlockHelperStub.restore();
        });
        it('does nothing if the controller not found, return empty string', function () {
            const helper = Reflect.construct(RequestDataReaderHandlebarsHelper_1.RequestDataReaderHandlebarsHelper, []);
            helper['controller'] = {};
            const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
            isBlockHelperStub.returns(false);
            expect(helper.run('test')).toEqual('');
            isBlockHelperStub.restore();
        });
        const returnSomethingActions = ['all', 'has', 'exists', 'except', 'only'];
        for (const action of returnSomethingActions) {
            describe('{{Input ' + action + ' ...}}', function () {
                it('proxies "' + action + '" returns the result', function () {
                    const helper = Reflect.construct(RequestDataReaderHandlebarsHelper_1.RequestDataReaderHandlebarsHelper, []);
                    const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
                    isBlockHelperStub.returns(false);
                    const input = {
                        [action]: function () {
                            return 'anything';
                        }
                    };
                    helper['property'] = 'input';
                    helper['controller'] = {
                        input
                    };
                    const actionSpy = Sinon.spy(helper['controller']['input'], action);
                    expect(helper.run(action)).toEqual('anything');
                    expect(actionSpy.calledWith()).toBe(true);
                    expect(actionSpy.lastCall.thisValue === input).toBe(true);
                    expect(helper.run(action, 'first')).toEqual('anything');
                    expect(actionSpy.calledWith('first')).toBe(true);
                    expect(actionSpy.lastCall.thisValue === input).toBe(true);
                    expect(helper.run(action, 'first', 'second')).toEqual('anything');
                    expect(actionSpy.calledWith('first', 'second')).toBe(true);
                    expect(actionSpy.lastCall.thisValue === input).toBe(true);
                    expect(helper.run(action, 'first', 'second', 'third')).toEqual('anything');
                    expect(actionSpy.calledWith('first', 'second', 'third')).toBe(true);
                    expect(actionSpy.lastCall.thisValue === input).toBe(true);
                    expect(helper.run(action, 'first', ['second', 'third'])).toEqual('anything');
                    expect(actionSpy.calledWith('first', ['second', 'third'])).toBe(true);
                    expect(actionSpy.lastCall.thisValue === input).toBe(true);
                    isBlockHelperStub.restore();
                    actionSpy.restore();
                });
            });
        }
        describe('{{Input get [key]}}', function () {
            it('proxies "get" returns the result', function () {
                const helper = Reflect.construct(RequestDataReaderHandlebarsHelper_1.RequestDataReaderHandlebarsHelper, []);
                const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
                isBlockHelperStub.returns(false);
                const input = {
                    get() {
                        return 'anything';
                    }
                };
                helper['property'] = 'input';
                helper['controller'] = {
                    input
                };
                const actionSpy = Sinon.spy(helper['controller']['input'], 'get');
                expect(helper.run('get', 'something', {})).toEqual('anything');
                expect(actionSpy.calledWith('something')).toBe(true);
                expect(actionSpy.lastCall.thisValue === input).toBe(true);
                isBlockHelperStub.restore();
                actionSpy.restore();
            });
        });
        describe('{{Input [key]}}', function () {
            it('proxies "get" returns the result', function () {
                const helper = Reflect.construct(RequestDataReaderHandlebarsHelper_1.RequestDataReaderHandlebarsHelper, []);
                const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
                isBlockHelperStub.returns(false);
                const input = {
                    get() {
                        return 'anything';
                    }
                };
                helper['property'] = 'input';
                helper['controller'] = {
                    input
                };
                const actionSpy = Sinon.spy(helper['controller']['input'], 'get');
                expect(helper.run('something', {})).toEqual('anything');
                expect(actionSpy.calledWith('something')).toBe(true);
                expect(actionSpy.lastCall.thisValue === input).toBe(true);
                isBlockHelperStub.restore();
                actionSpy.restore();
            });
        });
    });
});
