import 'jest'
import * as Sinon from 'sinon'
import { Config } from '../../lib/config/Config'
import { Facade } from '../../lib/facades/Facade'

describe('Config', function() {
  it('extends from Facade so it definitely a FacadeClass', function() {
    const config = new Config()
    expect(config).toBeInstanceOf(Facade)
  })

  describe('.get()', function() {
    it('calls "config".get if there is no default value', function() {
      const fakeConfig = {
        get() {}
      }
      const config = new Config()
      config['config'] = <any>fakeConfig
      const getSpy = Sinon.spy(fakeConfig, 'get')
      config.get('any')
      expect(getSpy.calledWith('any')).toBe(true)
    })

    it('returns defaultValue if provided and key not found', function() {
      const fakeConfig = {
        has() {
          return false
        },
        get() {}
      }
      const config = new Config()
      config['config'] = <any>fakeConfig
      const getSpy = Sinon.spy(fakeConfig, 'get')
      expect(config.get('any', 'default')).toEqual('default')
      expect(getSpy.called).toBe(false)
    })
  })

  describe('.has()', function() {
    it('calls "config".has, the "config" contains Config instance from "config" library', function() {
      const fakeConfig = {
        has() {}
      }
      const config = new Config()
      config['config'] = <any>fakeConfig
      const hasSpy = Sinon.spy(fakeConfig, 'has')
      config.has('any')
      expect(hasSpy.calledWith('any')).toBe(true)
    })
  })
})
