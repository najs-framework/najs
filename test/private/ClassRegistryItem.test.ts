import 'jest'
import { register, ClassRegistry } from '../../lib'

describe('ClassRegistryItem', function() {
  describe('private createInstance', function() {
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
