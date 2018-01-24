"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Winston = require("winston");
const ClassRegistry_1 = require("./../../lib/core/ClassRegistry");
const WinstonLogger_1 = require("../../lib/log/WinstonLogger");
const constants_1 = require("./../../lib/constants");
describe('WinstonLogger', function () {
    it('implements ILogger and registers to LoggerClass by default', function () {
        expect(ClassRegistry_1.ClassRegistry.has(WinstonLogger_1.WinstonLogger.className)).toBe(true);
        expect(ClassRegistry_1.ClassRegistry.has(constants_1.LoggerClass)).toBe(true);
        expect(ClassRegistry_1.ClassRegistry.findOrFail(constants_1.LoggerClass).instanceConstructor === WinstonLogger_1.WinstonLogger).toBe(true);
    });
    it('calls .setup() and use .getDefaultOptions() to get options for Winston', function () {
        const setupSpy = Sinon.spy(WinstonLogger_1.WinstonLogger.prototype, 'setup');
        const getDefaultOptionsSpy = Sinon.spy(WinstonLogger_1.WinstonLogger.prototype, 'getDefaultOptions');
        new WinstonLogger_1.WinstonLogger();
        expect(setupSpy.called).toBe(true);
        expect(getDefaultOptionsSpy.called).toBe(true);
    });
    describe('log functions', function () {
        for (const functionName in WinstonLogger_1.WinstonLogger['levels']) {
            it('implements .' +
                functionName +
                '() and pass all to .log with level "' +
                WinstonLogger_1.WinstonLogger['levels'][functionName] +
                '"', function () {
                const logger = new WinstonLogger_1.WinstonLogger();
                logger['logger'].remove(Winston.transports.Console);
                const logSpy = Sinon.spy(logger, 'log');
                logger[functionName](functionName);
                expect(logSpy.calledWith(WinstonLogger_1.WinstonLogger['levels'][functionName], functionName)).toBe(true);
                logger[functionName](functionName, 1, 2, 3);
                expect(logSpy.calledWith(WinstonLogger_1.WinstonLogger['levels'][functionName], functionName, 1, 2, 3)).toBe(true);
            });
        }
        it('.log() calls WinstonInstance.log() and passes all data to it', function () {
            const logger = new WinstonLogger_1.WinstonLogger();
            logger['logger'].remove(Winston.transports.Console);
            const logSpy = Sinon.spy(logger['logger'], 'log');
            logger.log('emergency', 'test');
            expect(logSpy.calledWith('emergency', 'test')).toBe(true);
            logger.log('emergency', 'test', 1, 2, 3);
            expect(logSpy.calledWith('emergency', 'test', 1, 2, 3)).toBe(true);
        });
    });
});
