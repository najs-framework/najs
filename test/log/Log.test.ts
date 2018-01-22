import 'jest'
import { WinstonLogger } from '../../lib/log/WinstonLogger'
import { LoggerClass } from './../../lib/constants'
import { Log, reload } from '../../lib/log/Log'
import { register } from '../../lib/core/register'

describe('Log', function() {
  it('implements ILogger and registers to LoggerClass by default', function() {
    expect(Log).toBeInstanceOf(WinstonLogger)
  })

  it('.reload() can be used to reload the new instance of Logger after binding', function() {
    class Custom {
      static className: string = 'Custom'
    }
    register(Custom, LoggerClass)
    expect(Log).toBeInstanceOf(WinstonLogger)
    reload()
    expect(Log).toBeInstanceOf(Custom)
  })
})
