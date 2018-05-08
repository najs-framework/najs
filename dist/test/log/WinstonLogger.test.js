"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Winston = require("winston");
const najs_binding_1 = require("najs-binding");
const WinstonLogger_1 = require("../../lib/log/WinstonLogger");
const najs_facade_1 = require("najs-facade");
describe('WinstonLogger', function () {
    it('extends from Facade so it definitely a FacadeClass', function () {
        const logger = new WinstonLogger_1.WinstonLogger();
        expect(logger).toBeInstanceOf(najs_facade_1.Facade);
        expect(logger.getClassName()).toEqual(WinstonLogger_1.WinstonLogger.className);
    });
    it('implements contracts Najs.Contracts.Log and registers under name "Najs.Log.WinstonLogger"', function () {
        expect(najs_binding_1.ClassRegistry.has(WinstonLogger_1.WinstonLogger.className)).toBe(true);
        expect(najs_binding_1.ClassRegistry.has('Najs.Log.WinstonLogger')).toBe(true);
        expect(najs_binding_1.ClassRegistry.findOrFail('Najs.Log.WinstonLogger').instanceConstructor === WinstonLogger_1.WinstonLogger).toBe(true);
    });
    it('calls .setup() and use .getDefaultOptions() to get options for Winston', function () {
        const setupSpy = Sinon.spy(WinstonLogger_1.WinstonLogger.prototype, 'setup');
        const getDefaultOptionsSpy = Sinon.spy(WinstonLogger_1.WinstonLogger.prototype, 'getDefaultOptions');
        new WinstonLogger_1.WinstonLogger();
        expect(setupSpy.called).toBe(true);
        expect(getDefaultOptionsSpy.called).toBe(true);
    });
    describe('.log()', function () {
        it('calls WinstonInstance.log() and passes all data to it', function () {
            const logger = new WinstonLogger_1.WinstonLogger();
            logger['logger'].remove(Winston.transports.Console);
            const logSpy = Sinon.spy(logger['logger'], 'log');
            logger.log('emergency', 'test');
            expect(logSpy.calledWith('emergency', 'test')).toBe(true);
            logger.log('emergency', 'test', 1, 2, 3);
            expect(logSpy.calledWith('emergency', 'test', 1, 2, 3)).toBe(true);
        });
    });
    for (const level in WinstonLogger_1.WinstonLogger.Levels) {
        describe('.' + level + '()', function () {
            it(`implements .${level}() and passes all args to .logs with level "${level}"`, function () {
                const logger = new WinstonLogger_1.WinstonLogger();
                logger['logger'].remove(Winston.transports.Console);
                const logSpy = Sinon.spy(logger, 'log');
                logger[level](level);
                expect(logSpy.calledWith(WinstonLogger_1.WinstonLogger.Levels[level], level)).toBe(true);
                logger[level](level, 1, 2, 3);
                expect(logSpy.calledWith(WinstonLogger_1.WinstonLogger.Levels[level], level, 1, 2, 3)).toBe(true);
            });
        });
    }
});
