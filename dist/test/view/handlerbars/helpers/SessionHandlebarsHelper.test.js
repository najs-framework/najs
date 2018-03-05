"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const SessionHandlebarsHelper_1 = require("../../../../lib/view/handlebars/helpers/SessionHandlebarsHelper");
describe('SessionHandlebarsHelper', function () {
    it('implements IAutoload interface', function () {
        const helper = Reflect.construct(SessionHandlebarsHelper_1.SessionHandlebarsHelper, []);
        expect(helper.getClassName()).toEqual('Najs.SessionHandlebarsHelper');
    });
    describe('BlockHelper: {{#Session ...}} body {{/Session}}', function () {
        it('does nothing if the controller not found, return undefined', function () {
            const helper = Reflect.construct(SessionHandlebarsHelper_1.SessionHandlebarsHelper, []);
            const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
            isBlockHelperStub.returns(true);
            expect(helper.run('test')).toBeUndefined();
            isBlockHelperStub.restore();
        });
        it('does nothing if session in the controller not found, return undefined', function () {
            const helper = Reflect.construct(SessionHandlebarsHelper_1.SessionHandlebarsHelper, []);
            helper['controller'] = {};
            const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
            isBlockHelperStub.returns(true);
            expect(helper.run('test')).toBeUndefined();
            isBlockHelperStub.restore();
        });
        it('proxies "has" function if it is a block helper', function () { });
        it('calls .renderChildren() if has key in Session', function () {
            const helper = Reflect.construct(SessionHandlebarsHelper_1.SessionHandlebarsHelper, []);
            const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
            isBlockHelperStub.returns(true);
            helper['controller'] = {
                session: {
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
        it('returns undefined if has no key in Session', function () {
            const helper = Reflect.construct(SessionHandlebarsHelper_1.SessionHandlebarsHelper, []);
            const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
            isBlockHelperStub.returns(true);
            helper['controller'] = {
                session: {
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
    describe('Helper: {{Session ...}}', function () {
        it('does nothing if the controller not found, return empty string', function () {
            const helper = Reflect.construct(SessionHandlebarsHelper_1.SessionHandlebarsHelper, []);
            const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
            isBlockHelperStub.returns(false);
            expect(helper.run('test')).toEqual('');
            isBlockHelperStub.restore();
        });
        it('does nothing if the controller not found, return empty string', function () {
            const helper = Reflect.construct(SessionHandlebarsHelper_1.SessionHandlebarsHelper, []);
            helper['controller'] = {};
            const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
            isBlockHelperStub.returns(false);
            expect(helper.run('test')).toEqual('');
            isBlockHelperStub.restore();
        });
        const doSomethingActions = [
            'reflash',
            'keep',
            'flash',
            'clear',
            'flush',
            'delete',
            'remove',
            'forget',
            'set',
            'put',
            'push'
        ];
        for (const action of doSomethingActions) {
            describe('{{Session ' + action + ' ...}}', function () {
                it('proxies "' + action + '" returns undefined', function () {
                    const helper = Reflect.construct(SessionHandlebarsHelper_1.SessionHandlebarsHelper, []);
                    const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
                    isBlockHelperStub.returns(false);
                    const session = {
                        [action]: function () {
                            return 'anything';
                        }
                    };
                    helper['controller'] = {
                        session
                    };
                    const actionSpy = Sinon.stub(helper['controller']['session'], action);
                    expect(helper.run(action)).toBeUndefined();
                    expect(actionSpy.calledWith()).toBe(true);
                    expect(actionSpy.lastCall.thisValue === session).toBe(true);
                    expect(helper.run(action, 'first')).toBeUndefined();
                    expect(actionSpy.calledWith('first')).toBe(true);
                    expect(actionSpy.lastCall.thisValue === session).toBe(true);
                    expect(helper.run(action, 'first', 'second')).toBeUndefined();
                    expect(actionSpy.calledWith('first', 'second')).toBe(true);
                    expect(actionSpy.lastCall.thisValue === session).toBe(true);
                    expect(helper.run(action, 'first', 'second', 'third')).toBeUndefined();
                    expect(actionSpy.calledWith('first', 'second', 'third')).toBe(true);
                    expect(actionSpy.lastCall.thisValue === session).toBe(true);
                    expect(helper.run(action, 'first', ['second', 'third'])).toBeUndefined();
                    expect(actionSpy.calledWith('first', ['second', 'third'])).toBe(true);
                    expect(actionSpy.lastCall.thisValue === session).toBe(true);
                    isBlockHelperStub.restore();
                    actionSpy.restore();
                });
            });
        }
        const returnSomethingActions = ['all', 'has', 'exists', 'pull', 'except', 'only'];
        for (const action of returnSomethingActions) {
            describe('{{Session ' + action + ' ...}}', function () {
                it('proxies "' + action + '" returns the result', function () {
                    const helper = Reflect.construct(SessionHandlebarsHelper_1.SessionHandlebarsHelper, []);
                    const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
                    isBlockHelperStub.returns(false);
                    const session = {
                        [action]: function () {
                            return 'anything';
                        }
                    };
                    helper['controller'] = {
                        session
                    };
                    const actionSpy = Sinon.spy(helper['controller']['session'], action);
                    expect(helper.run(action)).toEqual('anything');
                    expect(actionSpy.calledWith()).toBe(true);
                    expect(actionSpy.lastCall.thisValue === session).toBe(true);
                    expect(helper.run(action, 'first')).toEqual('anything');
                    expect(actionSpy.calledWith('first')).toBe(true);
                    expect(actionSpy.lastCall.thisValue === session).toBe(true);
                    expect(helper.run(action, 'first', 'second')).toEqual('anything');
                    expect(actionSpy.calledWith('first', 'second')).toBe(true);
                    expect(actionSpy.lastCall.thisValue === session).toBe(true);
                    expect(helper.run(action, 'first', 'second', 'third')).toEqual('anything');
                    expect(actionSpy.calledWith('first', 'second', 'third')).toBe(true);
                    expect(actionSpy.lastCall.thisValue === session).toBe(true);
                    expect(helper.run(action, 'first', ['second', 'third'])).toEqual('anything');
                    expect(actionSpy.calledWith('first', ['second', 'third'])).toBe(true);
                    expect(actionSpy.lastCall.thisValue === session).toBe(true);
                    isBlockHelperStub.restore();
                    actionSpy.restore();
                });
            });
        }
        describe('{{Session get [key]}}', function () {
            it('proxies "get" returns the result', function () {
                const helper = Reflect.construct(SessionHandlebarsHelper_1.SessionHandlebarsHelper, []);
                const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
                isBlockHelperStub.returns(false);
                const session = {
                    get() {
                        return 'anything';
                    }
                };
                helper['controller'] = {
                    session
                };
                const actionSpy = Sinon.spy(helper['controller']['session'], 'get');
                expect(helper.run('get', 'something', {})).toEqual('anything');
                expect(actionSpy.calledWith('something')).toBe(true);
                expect(actionSpy.lastCall.thisValue === session).toBe(true);
                isBlockHelperStub.restore();
                actionSpy.restore();
            });
        });
        describe('{{Session [key]}}', function () {
            it('proxies "get" returns the result', function () {
                const helper = Reflect.construct(SessionHandlebarsHelper_1.SessionHandlebarsHelper, []);
                const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper');
                isBlockHelperStub.returns(false);
                const session = {
                    get() {
                        return 'anything';
                    }
                };
                helper['controller'] = {
                    session
                };
                const actionSpy = Sinon.spy(helper['controller']['session'], 'get');
                expect(helper.run('something', {})).toEqual('anything');
                expect(actionSpy.calledWith('something')).toBe(true);
                expect(actionSpy.lastCall.thisValue === session).toBe(true);
                isBlockHelperStub.restore();
                actionSpy.restore();
            });
        });
    });
});
