import 'jest'
import { ClassRegistry, register, IAutoload } from '../../lib'

class TestAutoload implements IAutoload {
  getClassName() {
    return 'TestAutoload'
  }
}

class TestClassName {
  static className: string = 'TestClassName'
}

class Invalid {}

describe('Najs.register', function() {
  it('throws an TypeError if the class definition not implemented IAutoload or has no className', function() {
    try {
      expect(register(Invalid))
    } catch (error) {
      expect(error instanceof TypeError)
      expect(error.message).toEqual('Please define "className" or "getClassName" for ' + Invalid)
      return
    }
    expect('should throw a TypeError').toEqual('')
  })

  describe('<typeof T>(classDefinition: T)', function() {
    it('can registry a class definition by called IAutoload.getClassName()', function() {
      register<typeof TestAutoload>(TestAutoload)
      expect(ClassRegistry[Symbol.for('TestAutoload')]).toEqual({
        name: 'TestAutoload',
        definition: TestAutoload,
        overridable: true
      })
    })

    it('can registry a class definition get value of property Class.className', function() {
      register<typeof TestClassName>(TestClassName)
      expect(ClassRegistry[Symbol.for('TestClassName')]).toEqual({
        name: 'TestClassName',
        definition: TestClassName,
        overridable: true
      })
    })

    it('does not accept string as a first param', function() {
      try {
        register('TestClassName')
      } catch (error) {
        expect(error instanceof TypeError)
        return
      }
      expect('should throw a TypeError').toEqual('')
    })
  })

  describe('<typeof T>(classDefinition: T, className: string)', function() {
    it('can register an class definition with custom name', function() {
      register<typeof TestAutoload>(TestAutoload, 'Najs.TestAutoload')
      expect(ClassRegistry[Symbol.for('Najs.TestAutoload')]).toEqual({
        name: 'Najs.TestAutoload',
        definition: TestAutoload,
        overridable: true
      })
    })

    it('we often use this param for overriding the class definition', function() {
      register<typeof TestClassName>(TestClassName, 'Najs.TestAutoload')
      expect(ClassRegistry[Symbol.for('Najs.TestAutoload')]).toEqual({
        name: 'Najs.TestAutoload',
        definition: TestClassName,
        overridable: true
      })
    })
  })

  describe('<typeof T>(classDefinition: T, className: string, overridable: boolean)', function() {
    it('can lock the definition, no one can override it', function() {
      register<typeof TestAutoload>(TestAutoload, 'Not-Overridable', false)
      expect(ClassRegistry[Symbol.for('Not-Overridable')]).toEqual({
        name: 'Not-Overridable',
        definition: TestAutoload,
        overridable: false
      })
    })

    it('we often use this param for overriding the class definition', function() {
      try {
        register<typeof TestClassName>(TestClassName, 'Not-Overridable')
      } catch (error) {
        expect(error instanceof Error)
        expect(error.message).toEqual('Can not overridable Not-Overridable')
        return
      }
      expect('should throw an Error').toEqual('')
    })
  })
})
