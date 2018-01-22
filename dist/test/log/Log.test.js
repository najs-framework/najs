"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const WinstonLogger_1 = require("../../lib/log/WinstonLogger");
const constants_1 = require("./../../lib/constants");
const Log_1 = require("../../lib/log/Log");
const register_1 = require("../../lib/core/register");
describe('Log', function () {
    it('implements ILogger and registers to LoggerClass by default', function () {
        expect(Log_1.Log).toBeInstanceOf(WinstonLogger_1.WinstonLogger);
    });
    it('.reload() can be used to reload the new instance of Logger after binding', function () {
        class Custom {
        }
        Custom.className = 'Custom';
        register_1.register(Custom, constants_1.LoggerClass);
        expect(Log_1.Log).toBeInstanceOf(WinstonLogger_1.WinstonLogger);
        Log_1.reload();
        expect(Log_1.Log).toBeInstanceOf(Custom);
    });
});
