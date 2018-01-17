import 'jest'
import { ClassRegistry } from '../../lib/core/ClassRegistry'
import { register } from '../../lib/core/register'
import { bind } from '../../lib/core/bind'

describe('Najs.bind', function() {
  describe('@bind(bindToClassName: string)', function() {
    it('should return decorator if 2nd param is missing, and bind Target to bindToClassName', function() {
      class Test1 {
        static className = 'Test1'
      }
      register(Test1)

      @bind('Test1')
      class Test1Cached {
        static className = 'Test1Cached'
      }

      expect(ClassRegistry.has('Test1')).toBe(true)
      expect(ClassRegistry.has(Test1Cached.className)).toBe(true)
      expect(ClassRegistry.findOrFail('Test1').concreteClassName).toEqual('Test1Cached')
    })

    it('does not register if class already registered', function() {
      class Test2 {
        static className = 'Test2'
      }
      register(Test2)

      @bind('Test2')
      @register()
      class Test2Cached {
        static className = 'Test2Cached'
      }

      expect(ClassRegistry.has('Test2')).toBe(true)
      expect(ClassRegistry.has(Test2Cached.className)).toBe(true)
      expect(ClassRegistry.findOrFail('Test2').concreteClassName).toEqual('Test2Cached')
    })
  })

  describe('bind(className: string, instanceCreator: () => any)', function() {
    it('sets to instanceCreator if there is no item in ClassRegistry', function() {
      const instanceCreator = function() {
        return 'any'
      }

      expect(ClassRegistry.has('NotRegisterYet')).toBe(false)
      bind('NotRegisterYet', instanceCreator)
      expect(ClassRegistry.has('NotRegisterYet')).toBe(true)
      const item = ClassRegistry.findOrFail('NotRegisterYet')
      expect(item.className).toEqual('NotRegisterYet')
      expect(item.instanceCreator === instanceCreator).toBe(true)
    })

    it('sets to instanceCreator if there is an item in ClassRegistry', function() {
      class TestInstanceCreator {
        static className = 'TestInstanceCreator'
      }
      register(TestInstanceCreator)

      const instanceCreator = function() {
        return 'any'
      }

      bind('TestInstanceCreator', instanceCreator)
      const item = ClassRegistry.findOrFail('TestInstanceCreator')
      expect(item.className).toEqual('TestInstanceCreator')
      expect(item.instanceCreator === instanceCreator).toBe(true)
    })

    it('could not set instanceCreator if the Class is not overridable', function() {
      class IsNotOverridable {
        static className = 'IsNotOverridable'
      }
      register(IsNotOverridable, 'IsNotOverridable', false)
      try {
        bind('IsNotOverridable', function() {})
      } catch (error) {
        expect(error.message).toEqual('Can not override IsNotOverridable')
        return
      }
      expect('should not reach this line').toBe(true)
    })
  })

  describe('bind(className: string, concrete: string)', function() {
    it('sets to concreteClassName if there is no item in ClassRegistry', function() {
      bind('NotRegisterYetConcrete', 'Test')
      expect(ClassRegistry.has('NotRegisterYetConcrete')).toBe(true)
      const item = ClassRegistry.findOrFail('NotRegisterYetConcrete')
      expect(item.className).toEqual('NotRegisterYetConcrete')
      expect(item.concreteClassName).toEqual('Test')
    })

    it('sets to instanceCreator if there is an item in ClassRegistry', function() {
      class TestInstanceCreatorConcrete {
        static className = 'TestInstanceCreatorConcrete'
      }
      register(TestInstanceCreatorConcrete)

      bind('TestInstanceCreatorConcrete', 'Test')
      const item = ClassRegistry.findOrFail('TestInstanceCreatorConcrete')
      expect(item.className).toEqual('TestInstanceCreatorConcrete')
      expect(item.concreteClassName).toEqual('Test')
    })
  })
})
