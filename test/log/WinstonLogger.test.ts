import 'jest'
import * as Sinon from 'sinon'
import * as Winston from 'winston'
import { ClassRegistry } from 'najs-binding'
import { WinstonLogger } from '../../lib/log/WinstonLogger'
import { Facade } from 'najs-facade'

describe('WinstonLogger', function() {
  it('extends from Facade so it definitely a FacadeClass', function() {
    const logger = new WinstonLogger()
    expect(logger).toBeInstanceOf(Facade)
    expect(logger.getClassName()).toEqual(WinstonLogger.className)
  })

  it('implements contracts Najs.Contracts.Log and registers under name "Najs.Log.WinstonLogger"', function() {
    expect(ClassRegistry.has(WinstonLogger.className)).toBe(true)
    expect(ClassRegistry.has('Najs.Log.WinstonLogger')).toBe(true)
    expect(ClassRegistry.findOrFail('Najs.Log.WinstonLogger').instanceConstructor === WinstonLogger).toBe(true)
  })

  it('calls .setup() and use .getDefaultOptions() to get options for Winston', function() {
    const setupSpy = Sinon.spy(WinstonLogger.prototype, <any>'setup')
    const getDefaultOptionsSpy = Sinon.spy(WinstonLogger.prototype, <any>'getDefaultOptions')
    new WinstonLogger()
    expect(setupSpy.called).toBe(true)
    expect(getDefaultOptionsSpy.called).toBe(true)
  })

  describe('.log()', function() {
    it('calls WinstonInstance.log() and passes all data to it', function() {
      const logger = new WinstonLogger()
      logger['logger'].remove(Winston.transports.Console)
      const logSpy = Sinon.spy(logger['logger'], 'log')
      logger.log('emergency', 'test')
      expect(logSpy.calledWith('emergency', 'test')).toBe(true)
      logger.log('emergency', 'test', 1, 2, 3)
      expect(logSpy.calledWith('emergency', 'test', 1, 2, 3)).toBe(true)
    })
  })

  for (const level in WinstonLogger.Levels) {
    describe('.' + level + '()', function() {
      it(`implements .${level}() and passes all args to .logs with level "${level}"`, function() {
        const logger = new WinstonLogger()
        logger['logger'].remove(Winston.transports.Console)
        const logSpy = Sinon.spy(logger, 'log')
        logger[level](level)
        expect(logSpy.calledWith(WinstonLogger.Levels[level], level)).toBe(true)
        logger[level](level, 1, 2, 3)
        expect(logSpy.calledWith(WinstonLogger.Levels[level], level, 1, 2, 3)).toBe(true)
      })
    })
  }
})
