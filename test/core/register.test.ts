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
        overridable: true,
        singleton: false
      })
    })

    it('can registry a class definition get value of property Class.className', function() {
      register<typeof TestClassName>(TestClassName)
      expect(ClassRegistry[Symbol.for('TestClassName')]).toEqual({
        name: 'TestClassName',
        definition: TestClassName,
        overridable: true,
        singleton: false
      })
    })
  })

  describe('<typeof T>(classDefinition: T, className: string)', function() {
    it('can register an class definition with custom name', function() {
      register<typeof TestAutoload>(TestAutoload, 'Najs.TestAutoload')
      expect(ClassRegistry[Symbol.for('Najs.TestAutoload')]).toEqual({
        name: 'Najs.TestAutoload',
        definition: TestAutoload,
        overridable: true,
        singleton: false
      })
    })

    it('we often use this param for overriding the class definition', function() {
      register<typeof TestClassName>(TestClassName, 'Najs.TestAutoload')
      expect(ClassRegistry[Symbol.for('Najs.TestAutoload')]).toEqual({
        name: 'Najs.TestAutoload',
        definition: TestClassName,
        overridable: true,
        singleton: false
      })
    })
  })

  describe('<typeof T>(classDefinition: T, className: string, overridable: boolean)', function() {
    it('can lock the definition, no one can override it', function() {
      register<typeof TestAutoload>(TestAutoload, 'Not-Overridable', false)
      expect(ClassRegistry[Symbol.for('Not-Overridable')]).toEqual({
        name: 'Not-Overridable',
        definition: TestAutoload,
        overridable: false,
        singleton: false
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

  describe('<typeof T>(classDefinition: T, className: string, overridable: boolean, singleton: boolean)', function() {
    it('has default value is false', function() {
      register<typeof TestAutoload>(TestAutoload, 'Singleton', true)
      expect(ClassRegistry[Symbol.for('Singleton')]).toEqual({
        name: 'Singleton',
        definition: TestAutoload,
        overridable: true,
        singleton: false
      })
    })

    it('can define a class is singleton', function() {
      register<typeof TestAutoload>(TestAutoload, 'Singleton', false, true)
      expect(ClassRegistry[Symbol.for('Singleton')]).toEqual({
        name: 'Singleton',
        definition: TestAutoload,
        overridable: false,
        singleton: true
      })
    })
  })

  describe('@register(name?: string)', function() {
    it('can be used as a decorator', function() {
      @register()
      class A {
        getClassName() {
          return 'A'
        }
      }
      expect(new A()).toBeInstanceOf(A)
      expect(ClassRegistry[Symbol.for('A')]).toEqual({
        name: 'A',
        definition: A,
        overridable: true,
        singleton: false
      })
    })

    it('can be used if class has static className', function() {
      @register()
      class B {
        static className: string = 'B'
      }
      expect(new B()).toBeInstanceOf(B)
      expect(ClassRegistry[Symbol.for('B')]).toEqual({
        name: 'B',
        definition: B,
        overridable: true,
        singleton: false
      })
    })

    it('can be used as a decorator with custom name', function() {
      @register('Cindy')
      class C {
        static className: 'C'
      }
      expect(new C()).toBeInstanceOf(C)
      expect(ClassRegistry[Symbol.for('Cindy')]).toEqual({
        name: 'Cindy',
        definition: C,
        overridable: true,
        singleton: false
      })
    })
  })
})
