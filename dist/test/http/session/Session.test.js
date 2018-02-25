"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const najs_facade_1 = require("najs-facade");
const Controller_1 = require("../../../lib/http/controller/Controller");
const ExpressController_1 = require("../../../lib/http/controller/ExpressController");
const Session_1 = require("../../../lib/http/session/Session");
const RequestDataWriter_1 = require("../../../lib/http/request/RequestDataWriter");
const constants_1 = require("../../../lib/constants");
const isPromise_1 = require("../../../lib/private/isPromise");
describe('Session', function () {
    it('is a contextual facade', function () {
        const session = new Session_1.Session({});
        expect(session).toBeInstanceOf(najs_facade_1.ContextualFacade);
        expect(session.getClassName()).toEqual(constants_1.ContextualFacadeClass.Session);
    });
    describe('constructor()', function () {
        it('does nothing with controller is not ExpressController', function () {
            const rawSession = {};
            const controller = Reflect.construct(Controller_1.Controller, [{ method: 'get', session: rawSession }]);
            const session = new Session_1.Session(controller);
            expect(session['data']).toBeUndefined();
            session.set('test', 'value');
            expect(session['data']).toBeUndefined();
        });
        it('assigns controller.request.session to "data" if the controller is ExpressController', function () {
            const rawSession = {};
            const expressController = Reflect.construct(ExpressController_1.ExpressController, [{ method: 'get', session: rawSession }]);
            const session = new Session_1.Session(expressController);
            expect(session['data'] === rawSession).toBe(true);
            session.set('test', 'value');
            expect(rawSession).toEqual({ test: 'value' });
        });
        it('assigns "reflash" to false, "keep" to an empty array if there FlashRegistry structure exists', function () {
            const rawSession = { [Session_1.Session.FlashRegistryKey]: { reflash: true, keep: ['a', 'b'], flash: ['c'] } };
            const expressController = Reflect.construct(ExpressController_1.ExpressController, [{ method: 'get', session: rawSession }]);
            new Session_1.Session(expressController);
            expect(rawSession[Session_1.Session.FlashRegistryKey]['reflash']).toBe(false);
            expect(rawSession[Session_1.Session.FlashRegistryKey]['keep']).toEqual([]);
            expect(rawSession[Session_1.Session.FlashRegistryKey]['flash']).toEqual(['c']);
        });
        it('creates "flash" with empty array if there FlashRegistry structure exists and "flash" not found', function () {
            const rawSession = { [Session_1.Session.FlashRegistryKey]: { reflash: true, keep: ['a', 'b'] } };
            const expressController = Reflect.construct(ExpressController_1.ExpressController, [{ method: 'get', session: rawSession }]);
            new Session_1.Session(expressController);
            expect(rawSession[Session_1.Session.FlashRegistryKey]['flash']).toEqual([]);
        });
    });
    describe('.regenerate()', function () {
        it('returns a promise', function () {
            const rawSession = { regenerate() { } };
            const expressController = Reflect.construct(ExpressController_1.ExpressController, [{ method: 'get', session: rawSession }]);
            const session = new Session_1.Session(expressController);
            expect(isPromise_1.isPromise(session.regenerate())).toBe(true);
        });
        it('does nothing with controller is not ExpressController', async function () {
            const rawSession = { regenerate() { } };
            const regenerateSpy = Sinon.spy(rawSession, 'regenerate');
            const controller = Reflect.construct(Controller_1.Controller, [{ method: 'get', session: rawSession }]);
            const session = new Session_1.Session(controller);
            await session.regenerate();
            expect(regenerateSpy.called).toBe(false);
        });
        it('calls raw session .regenerate if controller is ExpressController', async function () {
            const rawSession = {
                regenerate(cb) {
                    cb();
                }
            };
            const regenerateSpy = Sinon.spy(rawSession, 'regenerate');
            const controller = Reflect.construct(ExpressController_1.ExpressController, [{ method: 'get', session: rawSession }]);
            const session = new Session_1.Session(controller);
            await session.regenerate();
            expect(regenerateSpy.called).toBe(true);
        });
    });
    describe('.getFlashRegistry()', function () {
        it('creates FlashRegistry structure if it does not exists in session', function () {
            const rawSession = {};
            const controller = Reflect.construct(ExpressController_1.ExpressController, [{ method: 'get', session: rawSession }]);
            const session = new Session_1.Session(controller);
            const registry = session.getFlashRegistry();
            expect(rawSession[Session_1.Session.FlashRegistryKey] === registry).toBe(true);
        });
        it('simply returns FlashRegistry structure if it already in session', function () {
            const rawSession = {};
            const controller = Reflect.construct(ExpressController_1.ExpressController, [{ method: 'get', session: rawSession }]);
            const session = new Session_1.Session(controller);
            rawSession[Session_1.Session.FlashRegistryKey] = {};
            expect(rawSession[Session_1.Session.FlashRegistryKey]).toEqual({});
            const registry = session.getFlashRegistry();
            expect(rawSession[Session_1.Session.FlashRegistryKey] === registry).toBe(true);
            expect(rawSession[Session_1.Session.FlashRegistryKey]).toEqual({});
        });
    });
    describe('.flash()', function () {
        it('auto creates "flash" in FlashRegistry structure', function () {
            const rawSession = {};
            const controller = Reflect.construct(ExpressController_1.ExpressController, [{ method: 'get', session: rawSession }]);
            const session = new Session_1.Session(controller);
            session['data'][Session_1.Session.FlashRegistryKey] = {};
            session.flash('test', 'value');
            expect(rawSession[Session_1.Session.FlashRegistryKey]['flash']).toEqual(['test']);
        });
        it('pushes path to "flash" of FlashRegistry if the path does not in there', function () {
            const rawSession = { [Session_1.Session.FlashRegistryKey]: {} };
            const controller = Reflect.construct(ExpressController_1.ExpressController, [{ method: 'get', session: rawSession }]);
            const session = new Session_1.Session(controller);
            session.flash('test', 'value');
            expect(rawSession[Session_1.Session.FlashRegistryKey]['flash']).toEqual(['test']);
            session.flash('test-1', 'value');
            expect(rawSession[Session_1.Session.FlashRegistryKey]['flash']).toEqual(['test', 'test-1']);
            session.flash('test', 'value');
            expect(rawSession[Session_1.Session.FlashRegistryKey]['flash']).toEqual(['test', 'test-1']);
        });
    });
    describe('.reflash()', function () {
        it('sets "reflash" in FlashRegistry to true', function () {
            const rawSession = { [Session_1.Session.FlashRegistryKey]: {} };
            const controller = Reflect.construct(ExpressController_1.ExpressController, [{ method: 'get', session: rawSession }]);
            const session = new Session_1.Session(controller);
            expect(rawSession[Session_1.Session.FlashRegistryKey]['reflash']).toBe(false);
            session.reflash();
            expect(rawSession[Session_1.Session.FlashRegistryKey]['reflash']).toBe(true);
        });
    });
    describe('.keep()', function () {
        it('auto creates "keep" in FlashRegistry structure', function () {
            const rawSession = {};
            const controller = Reflect.construct(ExpressController_1.ExpressController, [{ method: 'get', session: rawSession }]);
            const session = new Session_1.Session(controller);
            session['data'][Session_1.Session.FlashRegistryKey] = {};
            session.keep('a', 'b');
            expect(rawSession[Session_1.Session.FlashRegistryKey]['keep']).toEqual(['a', 'b']);
        });
        it('pushes path to "keep" of FlashRegistry if the path does not in there', function () {
            const rawSession = {};
            const controller = Reflect.construct(ExpressController_1.ExpressController, [{ method: 'get', session: rawSession }]);
            const session = new Session_1.Session(controller);
            session.keep('a');
            expect(rawSession[Session_1.Session.FlashRegistryKey]['keep']).toEqual(['a']);
            session.keep(['a', 'b']);
            expect(rawSession[Session_1.Session.FlashRegistryKey]['keep']).toEqual(['a', 'b']);
            session.keep('c', ['d'], 'a', 'e');
            expect(rawSession[Session_1.Session.FlashRegistryKey]['keep']).toEqual(['a', 'b', 'c', 'd', 'e']);
        });
    });
    describe('.isFlashPath()', function () {
        it('returns false if "reflash" is true', function () {
            const rawSession = {};
            const controller = Reflect.construct(ExpressController_1.ExpressController, [{ method: 'get', session: rawSession }]);
            const session = new Session_1.Session(controller);
            session['data'][Session_1.Session.FlashRegistryKey] = { reflash: true };
            expect(session.isFlashPath('any')).toBe(false);
        });
        it('returns false if path in "keep"', function () {
            const rawSession = {};
            const controller = Reflect.construct(ExpressController_1.ExpressController, [{ method: 'get', session: rawSession }]);
            const session = new Session_1.Session(controller);
            session['data'][Session_1.Session.FlashRegistryKey] = { keep: ['a', 'b'], flash: ['b'] };
            expect(session.isFlashPath('a')).toBe(false);
            expect(session.isFlashPath('b')).toBe(false);
            expect(session.isFlashPath('c')).toBe(false);
        });
        it('returns false if path not in "flash"', function () {
            const rawSession = {};
            const controller = Reflect.construct(ExpressController_1.ExpressController, [{ method: 'get', session: rawSession }]);
            const session = new Session_1.Session(controller);
            session['data'][Session_1.Session.FlashRegistryKey] = { flash: ['c'] };
            expect(session.isFlashPath('a')).toBe(false);
            expect(session.isFlashPath('b')).toBe(false);
            expect(session.isFlashPath('c')).toBe(true);
        });
    });
    describe('.clear()', function () {
        it('deletes this.data by `delete` operator', function () {
            const rawSession = {};
            const controller = Reflect.construct(Controller_1.Controller, [{ method: 'get', session: rawSession }]);
            const session = new Session_1.Session(controller);
            expect(session['data']).toBeUndefined();
            session['data'] = {};
            session.clear();
            expect(session['data']).toBeUndefined();
        });
        it('deletes this.data by `delete` operator, and session in request if controller is ExpressController', function () {
            const rawSession = {};
            const request = { method: 'get', session: rawSession };
            const expressController = Reflect.construct(ExpressController_1.ExpressController, [request]);
            const session = new Session_1.Session(expressController);
            session.clear();
            expect(session['data']).toBeUndefined();
            expect(request.session).toBeUndefined();
        });
    });
    describe('.get()', function () {
        it('calls implementation of RequestDataWriter.get() if the path is not flash', function () {
            const requestDataWriterSpy = Sinon.spy(RequestDataWriter_1.RequestDataWriter.prototype.get, 'apply');
            const session = new Session_1.Session({ request: { session: {} } });
            session['data'] = {};
            session.get('test');
            expect(requestDataWriterSpy.calledWith(session)).toBe(true);
            expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['test']);
            requestDataWriterSpy.restore();
        });
        it('calls implementation of RequestDataWriter.get(), then calls .delete() and remove path out of flash if it is', function () {
            const requestDataWriterSpy = Sinon.spy(RequestDataWriter_1.RequestDataWriter.prototype.get, 'apply');
            const session = new Session_1.Session({ request: { session: {} } });
            const deleteSpy = Sinon.spy(session, 'delete');
            session['data'] = {
                [Session_1.Session.FlashRegistryKey]: { flash: ['flash'] },
                flash: 'yeah'
            };
            session.get('flash');
            expect(requestDataWriterSpy.calledWith(session)).toBe(true);
            expect(deleteSpy.calledWith('flash')).toBe(true);
            expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['flash']);
            deleteSpy.restore();
            requestDataWriterSpy.restore();
        });
    });
    describe('.has()', function () {
        it('calls implementation of RequestDataWriter.has()', function () {
            const requestDataWriterSpy = Sinon.spy(RequestDataWriter_1.RequestDataWriter.prototype.has, 'apply');
            const session = new Session_1.Session({ request: { session: {} } });
            session.has('test');
            expect(requestDataWriterSpy.calledWith(session)).toBe(true);
            expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['test']);
            requestDataWriterSpy.restore();
        });
    });
    describe('.exists()', function () {
        it('calls implementation of RequestDataWriter.exists()', function () {
            const requestDataWriterSpy = Sinon.spy(RequestDataWriter_1.RequestDataWriter.prototype.exists, 'apply');
            const session = new Session_1.Session({ request: { session: {} } });
            session.exists('test');
            expect(requestDataWriterSpy.calledWith(session)).toBe(true);
            expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['test']);
            requestDataWriterSpy.restore();
        });
    });
    describe('.all()', function () {
        it('calls implementation of RequestDataWriter.exists()', function () {
            const requestDataWriterSpy = Sinon.spy(RequestDataWriter_1.RequestDataWriter.prototype.all, 'apply');
            const session = new Session_1.Session({ request: { session: {} } });
            session.all();
            expect(requestDataWriterSpy.calledWith(session)).toBe(true);
            expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual([]);
            requestDataWriterSpy.restore();
        });
    });
    describe('.only()', function () {
        it('calls implementation of RequestDataWriter.only()', function () {
            const requestDataWriterSpy = Sinon.spy(RequestDataWriter_1.RequestDataWriter.prototype.only, 'apply');
            const session = new Session_1.Session({ request: { session: {} } });
            session.only('test');
            expect(requestDataWriterSpy.calledWith(session)).toBe(true);
            expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['test']);
            requestDataWriterSpy.restore();
        });
    });
    describe('.except()', function () {
        it('calls implementation of RequestDataWriter.except()', function () {
            const requestDataWriterSpy = Sinon.spy(RequestDataWriter_1.RequestDataWriter.prototype.except, 'apply');
            const session = new Session_1.Session({ request: { session: {} } });
            session.except('test');
            expect(requestDataWriterSpy.calledWith(session)).toBe(true);
            expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['test']);
            requestDataWriterSpy.restore();
        });
    });
    describe('.set()', function () {
        it('calls implementation of RequestDataWriter.set()', function () {
            const requestDataWriterSpy = Sinon.spy(RequestDataWriter_1.RequestDataWriter.prototype.set, 'apply');
            const session = new Session_1.Session({ request: { session: {} } });
            session.set('test', 'value');
            expect(requestDataWriterSpy.calledWith(session)).toBe(true);
            expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['test', 'value']);
            requestDataWriterSpy.restore();
        });
    });
    describe('.put()', function () {
        it('is an alias of .set()', function () {
            const session = new Session_1.Session({ request: { session: {} } });
            const setSpy = Sinon.spy(session, 'set');
            session.put('test', 'value');
            expect(setSpy.calledWith('test', 'value')).toBe(true);
            setSpy.restore();
        });
    });
    describe('.push()', function () {
        it('is an alias of .set()', function () {
            const session = new Session_1.Session({ request: { session: {} } });
            const setSpy = Sinon.spy(session, 'set');
            session.push('test', 'value');
            expect(setSpy.calledWith('test', 'value')).toBe(true);
            setSpy.restore();
        });
    });
    describe('.pull()', function () {
        it('calls implementation of RequestDataWriter.pull()', function () {
            const requestDataWriterSpy = Sinon.spy(RequestDataWriter_1.RequestDataWriter.prototype.pull, 'apply');
            const session = new Session_1.Session({ request: { session: {} } });
            session['data'] = {};
            session.pull('test', 'value');
            expect(requestDataWriterSpy.calledWith(session)).toBe(true);
            expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['test', 'value']);
            requestDataWriterSpy.restore();
        });
    });
    describe('.delete()', function () {
        it('calls implementation of RequestDataWriter.delete()', function () {
            const requestDataWriterSpy = Sinon.spy(RequestDataWriter_1.RequestDataWriter.prototype.delete, 'apply');
            const session = new Session_1.Session({ request: { session: {} } });
            session.delete('test');
            expect(requestDataWriterSpy.calledWith(session)).toBe(true);
            expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['test']);
            requestDataWriterSpy.restore();
        });
    });
    describe('.remove()', function () {
        it('is an alias of .delete()', function () {
            const session = new Session_1.Session({ request: { session: {} } });
            const deleteSpy = Sinon.spy(session, 'delete');
            session.remove('test');
            expect(deleteSpy.calledWith('test')).toBe(true);
            deleteSpy.restore();
        });
    });
    describe('.forget()', function () {
        it('is an alias of .forget()', function () {
            const session = new Session_1.Session({ request: { session: {} } });
            const deleteSpy = Sinon.spy(session, 'delete');
            session.forget('test');
            expect(deleteSpy.calledWith('test')).toBe(true);
            deleteSpy.restore();
        });
    });
    describe('.flush()', function () {
        it('is an alias of .clear()', function () {
            const session = new Session_1.Session({ request: { session: {} } });
            const clearSpy = Sinon.spy(session, 'clear');
            session.flush();
            expect(clearSpy.calledWith()).toBe(true);
            clearSpy.restore();
        });
    });
});
