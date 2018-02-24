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
        it('calls implementation of RequestDataWriter.get()', function () {
            const requestDataWriterSpy = Sinon.spy(RequestDataWriter_1.RequestDataWriter.prototype.get, 'apply');
            const session = new Session_1.Session({ request: { session: {} } });
            session.get('test');
            expect(requestDataWriterSpy.calledWith(session)).toBe(true);
            expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['test']);
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
