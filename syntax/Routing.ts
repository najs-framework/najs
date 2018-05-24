import { RouteFacade as Route } from '../lib/facades/global/RouteFacade'
import { Controller } from '../lib'

function desc(name: string, callback: () => void): void {}

desc('Simple route with prefix() before HTTP verb', () => {
  Route.prefix('test').get('/get', 'Controller@endpoint')
})

desc('Simple route with prefix() after HTTP verb', () => {
  Route.get('/get', 'Controller@endpoint').prefix('test')
})

desc('Simple route with middleware() before HTTP verb', () => {
  Route.middleware('test').get('/get', 'Controller@endpoint')
})

desc('Simple route with middleware() after HTTP verb', () => {
  Route.get('/get', 'Controller@endpoint').middleware('test')
})

desc('Simple route with use() before HTTP verb', () => {
  Route.use('test').get('/get', 'Controller@endpoint')
})

desc('Simple route with middleware after HTTP verb', () => {
  Route.get('/get', 'Controller@endpoint').use('test')
})

desc('Name a function after using HTTP Verb', () => {
  Route.get('/get', 'Controller@endpoint').name('test')
})

desc('Name a function before using prefix() after HTTP Verb', () => {
  Route.name('test')
    .get('/get', 'Controller@endpoint')
    .prefix('test')
})

desc('Name a function before using middleware() after HTTP Verb', () => {
  Route.name('test')
    .get('/get', 'Controller@endpoint')
    .middleware('test')
})

desc('Name a function before using use() after HTTP Verb', () => {
  Route.name('test')
    .get('/get', 'Controller@endpoint')
    .use('test')
})

desc('Name a function after using prefix() after HTTP Verb', () => {
  Route.get('/get', 'Controller@endpoint')
    .prefix('test')
    .name('test')
})

desc('Name a function after using middleware() after HTTP Verb', () => {
  Route.get('/get', 'Controller@endpoint')
    .middleware('test')
    .name('test')
})

desc('Name a function after using use() after HTTP Verb', () => {
  Route.get('/get', 'Controller@endpoint')
    .use('test')
    .name('test')
})

desc('Group routes group()', () => {
  Route.group(function() {
    Route.get('/get', 'Controller@endpoint')
  })
})

desc('Group routes before using prefix()', () => {
  Route.group(function() {
    Route.get('/get', 'Controller@endpoint')
  })
    .prefix('test')
    .use('test')
    .middleware('test')
})

desc('Group routes before using middleware()', () => {
  Route.group(function() {
    Route.get('/get', 'Controller@endpoint')
  }).middleware('test')
})

desc('Group routes before using use()', () => {
  Route.group(function() {
    Route.get('/get', 'Controller@endpoint')
  }).use('test')
})

desc('Group routes after using prefix()', () => {
  Route.prefix('test').group(function() {
    Route.get('/get', 'Controller@endpoint')
  })
})

desc('Group routes after using middleware()', () => {
  Route.middleware('test').group(function() {
    Route.get('/get', 'Controller@endpoint')
  })
})

desc('Group routes after using use()', () => {
  Route.use('test').group(function() {
    Route.get('/get', 'Controller@endpoint')
  })
})

desc('Can use multiple-level group', () => {
  Route.group(() => {
    Route.get('/', 'Controller@endpoint')
    Route.group(() => {
      Route.get('/', 'Controller@endpoint')
    })
  })
})

desc('Simple route with prefix().middleware() before HTTP verb', () => {
  Route.prefix('test')
    .middleware('test')
    .get('/get', 'Controller@endpoint')
})

desc('Simple route with prefix() after HTTP verb', () => {
  Route.get('/get', 'Controller@endpoint')
    .prefix('test')
    .middleware('test')
})

desc('Can use .where() to validate param in path', () => {
  Route.get('/get/:id', 'Controller@endpoint')
    // .where('id', Joi.string().required())
    // .where('id', function() {
    // })
    .name('getName')
})

desc('Can use Joi Validation Middleware with prettier ignore flag', () => {
  // {
  //   something: test.do().something().awesome().by().using().chain().functions(),
  //   somethingElse: test.do().something().awesome().by().using().chain().functions()
  // }
  const test: any = {}
  const AjvValidator: any = {}
  const JoiValidation: any = {}

  // prettier-ignore
  // const template = {
  //   something: test.do().something().awesome().by().using().chain().functions(),
  //   somethingElse: test.do().something().awesome().by().using().chain().functions()
  // }

  // prettier-ignore
  Route.get('/get/:id', 'Controller@endpoint')
    .use(JoiValidation({
      something: test.do().something().awesome().by().using().chain().functions(),
      somethingElse: test.do().something().awesome().by().using().chain().functions()
    }))

  Route.get('/get/:id', 'Controller@endpoint').use(
    AjvValidator({
      properties: {
        something: { type: 'string' }
      },
      required: 'something'
    })
  )

  // prettier-ignore
  Route.get('/get/:id', 'Controller@endpoint')
    .use(JoiValidation({
      something: test.do().something().awesome().by().using().chain().functions(),
      somethingElse: test.do().something().awesome().by().using().chain().functions()
    }))
})

desc('it can detect invalid endpoint if passed controller constructor', function() {
  class TestController extends Controller {
    validEndpoint() {}

    getClassName() {
      return 'TestController'
    }
  }

  Route.get('/', TestController, 'validEndpoint')
  Route.method('GET', '/', TestController, 'validEndpoint')
})

desc('it can detect invalid endpoint if passed controller instance', function() {
  class TestController extends Controller {
    validEndpoint() {}

    getClassName() {
      return 'TestController'
    }
  }

  const controllerInstance = new TestController(<any>{}, <any>{})
  Route.get('/', controllerInstance, 'validEndpoint')
  Route.method('GET', '/', controllerInstance, 'validEndpoint')
})
