import 'jest'
import { ClassRegistryItem } from '../../lib/private/ClassRegistryItem'
import { ClassRegistry } from '../../lib'

describe('ClassRegistry', function() {
  describe('register', function() {
    it('can detect circular reference', function() {
      const noCircular = new ClassRegistryItem('NoCircular', undefined, undefined, true, false)
      ClassRegistry.register(noCircular)

      try {
        const circular = new ClassRegistryItem('circular', undefined, undefined, true, false)
        circular.concreteClassName = 'circular'
        ClassRegistry.register(circular)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toEqual('Circular reference detected "circular => circular"')
        return
      }

      expect('should not reach here').toEqual('yay')
    })
  })
})
