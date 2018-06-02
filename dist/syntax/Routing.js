"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouteFacade_1 = require("../lib/facades/global/RouteFacade");
const lib_1 = require("../lib");
function desc(name, callback) { }
desc('Simple route with prefix() before HTTP verb', () => {
    RouteFacade_1.RouteFacade.prefix('test').get('/get', 'Controller@endpoint');
});
desc('Simple route with prefix() after HTTP verb', () => {
    RouteFacade_1.RouteFacade.get('/get', 'Controller@endpoint').prefix('test');
});
desc('Simple route with middleware() before HTTP verb', () => {
    RouteFacade_1.RouteFacade.middleware('test').get('/get', 'Controller@endpoint');
});
desc('Simple route with middleware() after HTTP verb', () => {
    RouteFacade_1.RouteFacade.get('/get', 'Controller@endpoint').middleware('test');
});
desc('Simple route with use() before HTTP verb', () => {
    RouteFacade_1.RouteFacade.use('test').get('/get', 'Controller@endpoint');
});
desc('Simple route with middleware after HTTP verb', () => {
    RouteFacade_1.RouteFacade.get('/get', 'Controller@endpoint').use('test');
});
desc('Name a function after using HTTP Verb', () => {
    RouteFacade_1.RouteFacade.get('/get', 'Controller@endpoint').name('test');
});
desc('Name a function before using prefix() after HTTP Verb', () => {
    RouteFacade_1.RouteFacade.name('test')
        .get('/get', 'Controller@endpoint')
        .prefix('test');
});
desc('Name a function before using middleware() after HTTP Verb', () => {
    RouteFacade_1.RouteFacade.name('test')
        .get('/get', 'Controller@endpoint')
        .middleware('test');
});
desc('Name a function before using use() after HTTP Verb', () => {
    RouteFacade_1.RouteFacade.name('test')
        .get('/get', 'Controller@endpoint')
        .use('test');
});
desc('Name a function after using prefix() after HTTP Verb', () => {
    RouteFacade_1.RouteFacade.get('/get', 'Controller@endpoint')
        .prefix('test')
        .name('test');
});
desc('Name a function after using middleware() after HTTP Verb', () => {
    RouteFacade_1.RouteFacade.get('/get', 'Controller@endpoint')
        .middleware('test')
        .name('test');
});
desc('Name a function after using use() after HTTP Verb', () => {
    RouteFacade_1.RouteFacade.get('/get', 'Controller@endpoint')
        .use('test')
        .name('test');
});
desc('Group routes group()', () => {
    RouteFacade_1.RouteFacade.group(function () {
        RouteFacade_1.RouteFacade.get('/get', 'Controller@endpoint');
    });
});
desc('Group routes before using prefix()', () => {
    RouteFacade_1.RouteFacade.group(function () {
        RouteFacade_1.RouteFacade.get('/get', 'Controller@endpoint');
    })
        .prefix('test')
        .use('test')
        .middleware('test');
});
desc('Group routes before using middleware()', () => {
    RouteFacade_1.RouteFacade.group(function () {
        RouteFacade_1.RouteFacade.get('/get', 'Controller@endpoint');
    }).middleware('test');
});
desc('Group routes before using use()', () => {
    RouteFacade_1.RouteFacade.group(function () {
        RouteFacade_1.RouteFacade.get('/get', 'Controller@endpoint');
    }).use('test');
});
desc('Group routes after using prefix()', () => {
    RouteFacade_1.RouteFacade.prefix('test').group(function () {
        RouteFacade_1.RouteFacade.get('/get', 'Controller@endpoint');
    });
});
desc('Group routes after using middleware()', () => {
    RouteFacade_1.RouteFacade.middleware('test').group(function () {
        RouteFacade_1.RouteFacade.get('/get', 'Controller@endpoint');
    });
});
desc('Group routes after using use()', () => {
    RouteFacade_1.RouteFacade.use('test').group(function () {
        RouteFacade_1.RouteFacade.get('/get', 'Controller@endpoint');
    });
});
desc('Can use multiple-level group', () => {
    RouteFacade_1.RouteFacade.group(() => {
        RouteFacade_1.RouteFacade.get('/', 'Controller@endpoint');
        RouteFacade_1.RouteFacade.group(() => {
            RouteFacade_1.RouteFacade.get('/', 'Controller@endpoint');
        });
    });
});
desc('Simple route with prefix().middleware() before HTTP verb', () => {
    RouteFacade_1.RouteFacade.prefix('test')
        .middleware('test')
        .get('/get', 'Controller@endpoint');
});
desc('Simple route with prefix() after HTTP verb', () => {
    RouteFacade_1.RouteFacade.get('/get', 'Controller@endpoint')
        .prefix('test')
        .middleware('test');
});
desc('Can use .where() to validate param in path', () => {
    RouteFacade_1.RouteFacade.get('/get/:id', 'Controller@endpoint')
        .name('getName');
});
desc('Can use Joi Validation Middleware with prettier ignore flag', () => {
    // {
    //   something: test.do().something().awesome().by().using().chain().functions(),
    //   somethingElse: test.do().something().awesome().by().using().chain().functions()
    // }
    const test = {};
    const AjvValidator = {};
    const JoiValidation = {};
    // prettier-ignore
    // const template = {
    //   something: test.do().something().awesome().by().using().chain().functions(),
    //   somethingElse: test.do().something().awesome().by().using().chain().functions()
    // }
    // prettier-ignore
    RouteFacade_1.RouteFacade.get('/get/:id', 'Controller@endpoint')
        .use(JoiValidation({
        something: test.do().something().awesome().by().using().chain().functions(),
        somethingElse: test.do().something().awesome().by().using().chain().functions()
    }));
    RouteFacade_1.RouteFacade.get('/get/:id', 'Controller@endpoint').use(AjvValidator({
        properties: {
            something: { type: 'string' }
        },
        required: 'something'
    }));
    // prettier-ignore
    RouteFacade_1.RouteFacade.get('/get/:id', 'Controller@endpoint')
        .use(JoiValidation({
        something: test.do().something().awesome().by().using().chain().functions(),
        somethingElse: test.do().something().awesome().by().using().chain().functions()
    }));
});
desc('it can detect invalid endpoint if passed controller constructor', function () {
    class TestController extends lib_1.Controller {
        validEndpoint() { }
        getClassName() {
            return 'TestController';
        }
    }
    RouteFacade_1.RouteFacade.get('/', TestController, 'validEndpoint');
    RouteFacade_1.RouteFacade.method('GET', '/', TestController, 'validEndpoint');
});
desc('it can detect invalid endpoint if passed controller instance', function () {
    class TestController extends lib_1.Controller {
        validEndpoint() { }
        getClassName() {
            return 'TestController';
        }
    }
    const controllerInstance = new TestController({}, {});
    RouteFacade_1.RouteFacade.get('/', controllerInstance, 'validEndpoint');
    RouteFacade_1.RouteFacade.method('GET', '/', controllerInstance, 'validEndpoint');
});
