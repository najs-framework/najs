import 'jest'
import * as Sinon from 'sinon'
import * as Winston from 'winston'
import { ClassRegistry } from './../../lib/core/ClassRegistry'
import { WinstonLogger } from '../../lib/log/WinstonLogger'
import { LoggerClass } from './../../lib/constants'

describe('WinstonLogger', function() {
  it('implements ILogger and registers to LoggerClass by default', function() {
    expect(ClassRegistry.has(WinstonLogger.className)).toBe(true)
    expect(ClassRegistry.has(LoggerClass)).toBe(true)
    expect(ClassRegistry.findOrFail(LoggerClass).instanceConstructor === WinstonLogger).toBe(true)
  })

  it('calls .getOptions() and get options for Winston, and call loggerDidCreate() to customize logger', function() {
    const getOptionsSpy = Sinon.spy(WinstonLogger.prototype, <any>'getOptions')
    const loggerDidCreateSpy = Sinon.spy(WinstonLogger.prototype, <any>'loggerDidCreate')
    new WinstonLogger()
    expect(getOptionsSpy.called).toBe(true)
    expect(loggerDidCreateSpy.called).toBe(true)
  })

  describe('log functions', function() {
    for (const functionName in WinstonLogger['levels']) {
      it(
        'implements .' +
          functionName +
          '() and pass all to .log with level "' +
          WinstonLogger['levels'][functionName] +
          '"',
        function() {
          const logger = new WinstonLogger()
          logger['logger'].remove(Winston.transports.Console)
          const logSpy = Sinon.spy(logger, 'log')
          logger[functionName](functionName)
          expect(logSpy.calledWith(WinstonLogger['levels'][functionName], functionName)).toBe(true)
          logger[functionName](functionName, 1, 2, 3)
          expect(logSpy.calledWith(WinstonLogger['levels'][functionName], functionName, 1, 2, 3)).toBe(true)
        }
      )
    }

    it('.log() calls WinstonInstance.log() and passes all data to it', function() {
      const logger = new WinstonLogger()
      logger['logger'].remove(Winston.transports.Console)
      const logSpy = Sinon.spy(logger['logger'], 'log')
      logger.log('emergency', 'test')
      expect(logSpy.calledWith('emergency', 'test')).toBe(true)
      logger.log('emergency', 'test', 1, 2, 3)
      expect(logSpy.calledWith('emergency', 'test', 1, 2, 3)).toBe(true)
    })
  })
})
