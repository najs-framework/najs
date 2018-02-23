"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const ConfigFacade_1 = require("../../lib/facades/global/ConfigFacade");
const constants_1 = require("../../lib/constants");
const MongooseServiceProvider_1 = require("../../lib/service-providers/MongooseServiceProvider");
const mongoose = require('mongoose');
describe('MongooseServiceProvider', function () {
    describe('.getClassName()', function () {
        it('returns name of the provider', function () {
            const serviceProvider = new MongooseServiceProvider_1.MongooseServiceProvider({});
            expect(serviceProvider.getClassName() === MongooseServiceProvider_1.MongooseServiceProvider.className).toBe(true);
        });
    });
    describe('.getMongooseInstance()', function () {
        it('returns instance (singleton) of "mongoose" package', function () {
            const serviceProvider = new MongooseServiceProvider_1.MongooseServiceProvider({});
            expect(serviceProvider.getMongooseInstance() === mongoose).toBe(true);
        });
    });
    describe('.createModelFromSchema()', function () {
        it('calls "mongoose".model()', function () {
            const modelStub = Sinon.stub(mongoose, 'model');
            modelStub.callsFake(() => { });
            const serviceProvider = new MongooseServiceProvider_1.MongooseServiceProvider({});
            serviceProvider.createModelFromSchema('test', 'anything');
            expect(modelStub.calledWith('test', 'anything')).toBe(true);
            modelStub.restore();
        });
    });
    describe('.boot()', function () {
        it('calls mongoose.connect() and resolved when event mongoose.connection.once("open") fired', async function () {
            const connectStub = Sinon.stub(mongoose, 'connect');
            connectStub.callsFake(() => { });
            const onceStub = Sinon.stub(mongoose.connection, 'once');
            onceStub.callsFake((event, cb) => cb());
            const serviceProvider = new MongooseServiceProvider_1.MongooseServiceProvider({});
            await serviceProvider.boot();
            expect(connectStub.called).toBe(true);
            expect(onceStub.calledWith('open')).toBe(true);
            onceStub.restore();
            connectStub.restore();
        });
        it('calls mongoose.connect() with Config get from ConfigFacade', async function () {
            const getConfigSpy = ConfigFacade_1.ConfigFacade.spy('get');
            const connectStub = Sinon.stub(mongoose, 'connect');
            connectStub.callsFake(() => { });
            const onceStub = Sinon.stub(mongoose.connection, 'once');
            onceStub.callsFake((event, cb) => cb());
            const serviceProvider = new MongooseServiceProvider_1.MongooseServiceProvider({});
            await serviceProvider.boot();
            expect(getConfigSpy.callCount).toEqual(2);
            expect(getConfigSpy.firstCall.args[0]).toEqual(constants_1.ConfigurationKeys.Mongoose);
            expect(getConfigSpy.firstCall.args[1]).toEqual('mongodb://localhost:27017/najs');
            expect(getConfigSpy.secondCall.args[0]).toEqual(constants_1.ConfigurationKeys.MongooseOptions);
            expect(getConfigSpy.secondCall.args[1]).toEqual({});
            onceStub.restore();
            connectStub.restore();
        });
    });
});
