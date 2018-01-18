import 'jest'
import { bind, register, ClassRegistry } from '../../lib'

describe('ClassRegistryItem', function() {
  describe('private createInstance', function() {
    @register()
    class Original {
      static className = 'Original'
    }
    it('returns undefined if there is concreteClassName but concreteClass not register yet', function() {
      class Final1 {
        static className = 'Final1'
      }

      bind(Original.className, Final1.className)
      expect(ClassRegistry.findOrFail(Original.className)['createInstance']()).toBeUndefined()
    })

    it('skips instance... values if has concreteClassName', function() {
      const classRegistryItem = ClassRegistry.findOrFail(Original.className)
      classRegistryItem.instanceCreator = function() {
        return new Date()
      }
      expect(ClassRegistry.findOrFail(Original.className)['createInstance']()).toBeUndefined()
    })

    it('returns createInstance of ClassRegistryItem with concreteClassName', function() {
      @register()
      class Final {
        static className = 'Final'
      }

      bind(Original.className, Final.className)
      expect(ClassRegistry.findOrFail(Original.className)['createInstance']()).toBeInstanceOf(Final)
    })

    it('creates instance from instanceConstructor if it set', function() {
      @register()
      class Test {
        static className = 'Test'
      }
      expect(ClassRegistry.findOrFail('Test')['createInstance']()).toBeInstanceOf(Test)
    })

    it('creates instance from instanceCreator if instanceConstructor not found', function() {
      const classRegistryItem = ClassRegistry.findOrFail('Test')
      classRegistryItem.instanceConstructor = undefined
      classRegistryItem.instanceCreator = function() {
        return new Date()
      }
      expect(classRegistryItem['createInstance']()).toBeInstanceOf(Date)
    })

    it('return instance if instanceConstructor and instanceCreator not found and singleton is true', function() {
      const classRegistryItem = ClassRegistry.findOrFail('Test')
      classRegistryItem.instanceConstructor = undefined
      classRegistryItem.instanceCreator = undefined
      classRegistryItem.instance = new Date()
      classRegistryItem.singleton = true
      expect(classRegistryItem['createInstance']()).toBeInstanceOf(Date)
    })

    it('return undefined if instanceConstructor and instanceCreator not found', function() {
      const classRegistryItem = ClassRegistry.findOrFail('Test')
      classRegistryItem.instanceConstructor = undefined
      classRegistryItem.instanceCreator = undefined
      classRegistryItem.singleton = false
      expect(classRegistryItem['createInstance']()).toBeUndefined()
    })
  })
})
