import 'jest'
import { register, autoload } from '../../lib'

export class Model {
  static className = 'Model'
}

export class Repository {
  static className = 'Repository'

  @autoload(Model.className) model: Model

  constructor()
  constructor(metadata: Object)
  constructor(metadata?: Object) {
    if (metadata) {
      this['__autoloadMetadata'] = metadata
    }
  }

  getSomething() {
    return 'something'
  }
}

export class CustomMetadataRepository {
  static className = 'CustomMetadataRepository'

  @autoload(Model.className) model: Model

  constructor(metadata?: Object) {
    this['__autoloadMetadata'] = { diff: 'yes' }
  }

  getSomething() {
    return 'something'
  }
}

export class TestAutoloadPropertyDecorator {
  static className = 'TestAutoloadDecorator'

  @autoload(Repository.className) repository: Repository
  @autoload(CustomMetadataRepository.className) customMetadataRepository: CustomMetadataRepository

  constructor()
  constructor(metadata: Object)
  constructor(metadata?: Object) {
    if (metadata) {
      this['__autoloadMetadata'] = metadata
    }
  }

  getSomething() {
    return this.repository.getSomething()
  }
}

describe('@autoload', function() {
  register(Model)
  register(Repository)
  register(CustomMetadataRepository)

  it('can be used for property inside a class to initialize automatically', function() {
    for (let i = 0; i < 10; i++) {
      const hosted = new TestAutoloadPropertyDecorator()
      expect(hosted.repository).toBeInstanceOf(Repository)
    }
  })

  it('creates new instance of autoload property for every instance of hosted class', function() {
    let previousInstance: Repository | undefined
    for (let i = 0; i < 100; i++) {
      const hosted = new TestAutoloadPropertyDecorator()
      expect(hosted.repository).toBeInstanceOf(Repository)
      if (previousInstance) {
        expect(previousInstance === hosted.repository).toBe(false)
      }
      previousInstance = hosted.repository
    }
  })

  it('creates single instance inside the hosted class', function() {
    const hosted = new TestAutoloadPropertyDecorator()
    let previousInstance: Repository = hosted.repository
    for (let i = 0; i < 100; i++) {
      expect(previousInstance === hosted.repository).toBe(true)
      previousInstance = hosted.repository
    }
  })

  it('passes autoload metadata to the instances which are autoload', function() {
    const metadata = { meta: 'anything' }
    const hosted = new TestAutoloadPropertyDecorator(metadata)
    expect(hosted.repository['__autoloadMetadata'] === metadata).toBe(true)
    expect(hosted.repository.model['__autoloadMetadata'] === metadata).toBe(true)
  })

  it('merges autoload metadata if metadata in tree have different', function() {
    const metadata = { meta: 'anything' }
    const hosted = new TestAutoloadPropertyDecorator(metadata)
    expect(hosted.customMetadataRepository['__autoloadMetadata']).toEqual({
      meta: 'anything',
      diff: 'yes'
    })
    expect(hosted.customMetadataRepository.model['__autoloadMetadata']).toEqual({
      meta: 'anything',
      diff: 'yes'
    })
  })

  it('prevents assign new value to autoload property', function() {
    const hosted = new TestAutoloadPropertyDecorator()
    try {
      hosted.repository = new Repository()
    } catch (error) {
      expect(error instanceof Error)
      expect(error.message).toEqual('Can not set autoload property "repository"')
      return
    }
    expect('should throw a Error').toEqual('')
  })

  it('throws a TypeError if used to decorate a class', function() {
    try {
      @autoload('Repository')
      class DecorateByAutoload {}
      new DecorateByAutoload()
    } catch (error) {
      expect(error instanceof TypeError)
      expect(error.message).toEqual('Could not apply autoload decorator to Class')
      return
    }
    expect('should throw a Error').toEqual('')
  })

  it('throws a TypeError if used to decorate a method', function() {
    try {
      class DecorateByAutoload {
        @autoload('Repository')
        getSomething() {}
      }
      new DecorateByAutoload()
    } catch (error) {
      expect(error instanceof TypeError)
      expect(error.message).toEqual('Could not apply autoload decorator to Method')
      return
    }
    expect('should throw a Error').toEqual('')
  })
})
