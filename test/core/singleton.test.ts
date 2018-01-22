import 'jest'
import * as Sinon from 'sinon'
import * as Register from '../../lib/core/register'
import { singleton } from '../../lib/core/singleton'

describe('Najs.singleton', function() {
  it('just a shortcut of register()', function() {})

  it('always passes true to singleton param of register()', function() {
    const spy = Sinon.spy(Register, 'register')
    class Test {
      static className: string = 'Test'
    }
    singleton(Test)
    expect(spy.calledWith(Test, undefined, undefined, true)).toBe(true)
    spy.restore()
  })

  describe('<typeof T>(classDefinition: T)', function() {
    it('calls register(classDefinition, undefined, undefined, true)', function() {
      const spy = Sinon.spy(Register, 'register')
      class Test {
        static className: string = 'Test'
      }
      singleton(Test)
      expect(spy.calledWith(Test, undefined, undefined, true)).toBe(true)
      spy.restore()
    })
  })

  describe('<typeof T>(classDefinition: T, className: string)', function() {
    it('calls register(classDefinition, className, undefined, true)', function() {
      const spy = Sinon.spy(Register, 'register')
      class Test {
        static className: string = 'Test'
      }
      singleton(Test, 'Any')
      expect(spy.calledWith(Test, 'Any', undefined, true)).toBe(true)
      spy.restore()
    })
  })

  describe('<typeof T>(classDefinition: T, className: string, overridable: boolean)', function() {
    it('calls register(classDefinition, className, overridable, true)', function() {
      const spy = Sinon.spy(Register, 'register')
      class Test {
        static className: string = 'Test'
      }
      singleton(Test, 'Any', true)
      expect(spy.calledWith(Test, 'Any', true, true)).toBe(true)

      singleton(Test, 'Any', false)
      expect(spy.calledWith(Test, 'Any', false, true)).toBe(true)
      spy.restore()
    })
  })

  describe('@singleton(name?: string)', function() {
    it('calls register(name, undefined, undefined, true) case 1', function() {
      const spy = Sinon.spy(Register, 'register')
      @singleton()
      class Test {
        static className: string = 'Decorate'
      }
      expect(spy.calledWith(Test, undefined, false, true)).toBe(true)
      spy.restore()
    })

    it('calls register(name, undefined, undefined, true) case 2', function() {
      const spy = Sinon.spy(Register, 'register')
      @singleton('CustomClass')
      class Class {
        static className = 'Class'
      }
      expect(spy.calledWith(Class, 'CustomClass', false, true)).toBe(true)
      spy.restore()
    })
  })
})
