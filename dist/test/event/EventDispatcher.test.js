"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const EventDispatcher_1 = require("../../lib/event/EventDispatcher");
const Facade_1 = require("../../lib/facades/Facade");
const constants_1 = require("../../lib/constants");
const najs_binding_1 = require("najs-binding");
describe('EventDispatcher', function () {
    it('extends from Facade so it definitely a FacadeClass', function () {
        const dispatcher = new EventDispatcher_1.EventDispatcher();
        expect(dispatcher).toBeInstanceOf(Facade_1.Facade);
        expect(dispatcher.getClassName()).toEqual(constants_1.GlobalFacadeClass.Event);
        expect(najs_binding_1.ClassRegistry.has(constants_1.GlobalFacadeClass.Event)).toBe(true);
    });
    describe('.listen()', function () {
        it('is chain-able', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const resolveListenerStub = Sinon.stub(dispatcher, 'resolveListener');
            resolveListenerStub.returns(undefined);
            expect(dispatcher.listen('any', 'Test') === dispatcher).toBe(true);
            resolveListenerStub.restore();
        });
        it('uses .resolveSubscriber() and calls eventEmitter.on() if the result is found', function () {
            const listener = () => { };
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const onStub = Sinon.stub(dispatcher['eventEmitter'], 'on');
            const resolveListenerStub = Sinon.stub(dispatcher, 'resolveListener');
            resolveListenerStub.returns(listener);
            expect(dispatcher.listen('event', 'Class@Test') === dispatcher).toBe(true);
            expect(onStub.calledWith('event', listener)).toBe(true);
            resolveListenerStub.restore();
        });
    });
    describe('.hasListeners()', function () {
        it('calls eventEmitter.listenerCount() to remove event handlers', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const listenerCountStub = Sinon.stub(dispatcher['eventEmitter'], 'listenerCount');
            dispatcher.hasListeners('test');
            expect(listenerCountStub.calledWith('test')).toBe(true);
            listenerCountStub.restore();
        });
    });
    describe('.fire()', function () {
        it('is chain-able', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            expect(dispatcher.fire('test', 1, 2, 3) === dispatcher).toBe(true);
        });
        it('calls eventEmitter.emit() to remove event handlers', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const emitStub = Sinon.stub(dispatcher['eventEmitter'], 'emit');
            dispatcher.fire('test', 1, 2, 3);
            expect(emitStub.calledWith('test', 1, 2, 3)).toBe(true);
            emitStub.restore();
        });
    });
    describe('.forget()', function () {
        it('is chain-able', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            expect(dispatcher.forget('test') === dispatcher).toBe(true);
        });
        it('calls eventEmitter.removeAllListeners() to remove event handlers', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const removeAllListenersStub = Sinon.stub(dispatcher['eventEmitter'], 'removeAllListeners');
            dispatcher.forget('test');
            expect(removeAllListenersStub.calledWith('test')).toBe(true);
            removeAllListenersStub.restore();
        });
    });
    describe('.subscribe()', function () {
        it('is chain-able', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const resolveSubscriberStub = Sinon.stub(dispatcher, 'resolveSubscriber');
            resolveSubscriberStub.returns(undefined);
            expect(dispatcher.subscribe('Test') === dispatcher).toBe(true);
            resolveSubscriberStub.restore();
        });
        it('uses .resolveSubscriber() and calls subscribe(this) if the result is found', function () {
            const subscriber = {
                subscribe() { }
            };
            const subscriberSpy = Sinon.spy(subscriber, 'subscribe');
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const resolveSubscriberStub = Sinon.stub(dispatcher, 'resolveSubscriber');
            resolveSubscriberStub.returns(subscriber);
            expect(dispatcher.subscribe('Test') === dispatcher).toBe(true);
            expect(subscriberSpy.calledWith(dispatcher)).toBe(true);
            resolveSubscriberStub.restore();
        });
    });
    describe('.resolveSubscriber()', function () {
        it('calls make() to get instance of EventSubscriber if param is a string', function () {
            const makeStub = Sinon.stub(NajsBinding, 'make');
            makeStub.returns({});
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            dispatcher.resolveSubscriber('Test');
            expect(makeStub.calledWith('Test')).toBe(true);
            makeStub.restore();
        });
        it('uses Reflect.construct() to get instance of EventSubscriber if param is a function', function () {
            const reflectConstructStub = Sinon.stub(Reflect, 'construct');
            reflectConstructStub.returns({});
            class Test {
            }
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            dispatcher.resolveSubscriber(Test);
            expect(reflectConstructStub.calledWith(Test, [])).toBe(true);
            reflectConstructStub.restore();
        });
    });
    describe('.resolveListener()', function () {
        it('simply returns listener if it is a function', function () {
            const listener = () => { };
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            expect(dispatcher.resolveListener(listener) === listener).toBe(true);
        });
        it('returns undefined if listener is string and has wrong format (format: Class@function)', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            expect(dispatcher.resolveListener('Any')).toBeUndefined();
        });
        it('returns undefined if listener is well format but Class can not be resolved by make()', function () {
            const makeStub = Sinon.stub(NajsBinding, 'make');
            makeStub.returns(undefined);
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            expect(dispatcher.resolveListener('Class@test')).toBeUndefined();
            makeStub.restore();
        });
        it('returns undefined if listener is well format but Class can be resolved by make() but function not found', function () {
            const makeStub = Sinon.stub(NajsBinding, 'make');
            makeStub.returns({});
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            expect(dispatcher.resolveListener('Class@test')).toBeUndefined();
            makeStub.restore();
        });
        it('returns resolved Class[function]', function () {
            const object = { test() { } };
            const makeStub = Sinon.stub(NajsBinding, 'make');
            makeStub.returns(object);
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            expect(dispatcher.resolveListener('Class@test') === object.test).toBe(true);
            makeStub.restore();
        });
    });
    // EventEmitter Proxy ------------------------------------------------------------------------------------------------
    describe('.addListener()', function () {
        it('is chain-able', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'addListener');
            eventEmitterStub.returns(undefined);
            expect(dispatcher.addListener('Test', () => { }) === dispatcher).toBe(true);
            eventEmitterStub.restore();
        });
        it('forwards to eventEmitter.addListener()', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'addListener');
            eventEmitterStub.returns(undefined);
            const listener = () => { };
            dispatcher.addListener('Test', listener);
            expect(eventEmitterStub.calledWith('Test', listener)).toBe(true);
            eventEmitterStub.restore();
        });
    });
    describe('.on()', function () {
        it('is chain-able', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'on');
            eventEmitterStub.returns(undefined);
            expect(dispatcher.on('Test', () => { }) === dispatcher).toBe(true);
            eventEmitterStub.restore();
        });
        it('forwards to eventEmitter.on()', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'on');
            eventEmitterStub.returns(undefined);
            const listener = () => { };
            dispatcher.on('Test', listener);
            expect(eventEmitterStub.calledWith('Test', listener)).toBe(true);
            eventEmitterStub.restore();
        });
    });
    describe('.once()', function () {
        it('is chain-able', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'once');
            eventEmitterStub.returns(undefined);
            expect(dispatcher.once('Test', () => { }) === dispatcher).toBe(true);
            eventEmitterStub.restore();
        });
        it('forwards to eventEmitter.once()', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'once');
            eventEmitterStub.returns(undefined);
            const listener = () => { };
            dispatcher.once('Test', listener);
            expect(eventEmitterStub.calledWith('Test', listener)).toBe(true);
            eventEmitterStub.restore();
        });
    });
    describe('.prependListener()', function () {
        it('is chain-able', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'prependListener');
            eventEmitterStub.returns(undefined);
            expect(dispatcher.prependListener('Test', () => { }) === dispatcher).toBe(true);
            eventEmitterStub.restore();
        });
        it('forwards to eventEmitter.prependListener()', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'prependListener');
            eventEmitterStub.returns(undefined);
            const listener = () => { };
            dispatcher.prependListener('Test', listener);
            expect(eventEmitterStub.calledWith('Test', listener)).toBe(true);
            eventEmitterStub.restore();
        });
    });
    describe('.prependOnceListener()', function () {
        it('is chain-able', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'prependOnceListener');
            eventEmitterStub.returns(undefined);
            expect(dispatcher.prependOnceListener('Test', () => { }) === dispatcher).toBe(true);
            eventEmitterStub.restore();
        });
        it('forwards to eventEmitter.prependOnceListener()', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'prependOnceListener');
            eventEmitterStub.returns(undefined);
            const listener = () => { };
            dispatcher.prependOnceListener('Test', listener);
            expect(eventEmitterStub.calledWith('Test', listener)).toBe(true);
            eventEmitterStub.restore();
        });
    });
    describe('.removeListener()', function () {
        it('is chain-able', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'removeListener');
            eventEmitterStub.returns(undefined);
            expect(dispatcher.removeListener('Test', () => { }) === dispatcher).toBe(true);
            eventEmitterStub.restore();
        });
        it('forwards to eventEmitter.removeListener()', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'removeListener');
            eventEmitterStub.returns(undefined);
            const listener = () => { };
            dispatcher.removeListener('Test', listener);
            expect(eventEmitterStub.calledWith('Test', listener)).toBe(true);
            eventEmitterStub.restore();
        });
    });
    describe('.removeAllListeners()', function () {
        it('is chain-able', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'removeAllListeners');
            eventEmitterStub.returns(undefined);
            expect(dispatcher.removeAllListeners('Test') === dispatcher).toBe(true);
            eventEmitterStub.restore();
        });
        it('forwards to eventEmitter.removeAllListeners()', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'removeAllListeners');
            eventEmitterStub.returns(undefined);
            dispatcher.removeAllListeners('Test');
            expect(eventEmitterStub.calledWith('Test')).toBe(true);
            eventEmitterStub.restore();
        });
    });
    describe('.setMaxListeners()', function () {
        it('is chain-able', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'setMaxListeners');
            eventEmitterStub.returns(undefined);
            expect(dispatcher.setMaxListeners(10) === dispatcher).toBe(true);
            eventEmitterStub.restore();
        });
        it('forwards to eventEmitter.setMaxListeners()', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'setMaxListeners');
            eventEmitterStub.returns(undefined);
            dispatcher.setMaxListeners(10);
            expect(eventEmitterStub.calledWith(10)).toBe(true);
            eventEmitterStub.restore();
        });
    });
    describe('.getMaxListeners()', function () {
        it('forwards to eventEmitter.getMaxListeners()', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'getMaxListeners');
            eventEmitterStub.returns(undefined);
            dispatcher.getMaxListeners();
            expect(eventEmitterStub.calledWith()).toBe(true);
            eventEmitterStub.restore();
        });
    });
    describe('.listeners()', function () {
        it('forwards to eventEmitter.listeners()', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'listeners');
            eventEmitterStub.returns(undefined);
            dispatcher.listeners('test');
            expect(eventEmitterStub.calledWith('test')).toBe(true);
            eventEmitterStub.restore();
        });
    });
    describe('.emit()', function () {
        it('forwards to eventEmitter.emit()', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'emit');
            eventEmitterStub.returns(undefined);
            dispatcher.emit('test', 1, 2, 3);
            expect(eventEmitterStub.calledWith('test', 1, 2, 3)).toBe(true);
            eventEmitterStub.restore();
        });
    });
    describe('.eventNames()', function () {
        it('forwards to eventEmitter.eventNames()', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'eventNames');
            eventEmitterStub.returns(undefined);
            dispatcher.eventNames();
            expect(eventEmitterStub.calledWith()).toBe(true);
            eventEmitterStub.restore();
        });
    });
    describe('.listenerCount()', function () {
        it('forwards to eventEmitter.listenerCount()', function () {
            const dispatcher = new EventDispatcher_1.EventDispatcher();
            const eventEmitterStub = Sinon.stub(dispatcher['eventEmitter'], 'listenerCount');
            eventEmitterStub.returns(undefined);
            dispatcher.listenerCount('test');
            expect(eventEmitterStub.calledWith('test')).toBe(true);
            eventEmitterStub.restore();
        });
    });
});
