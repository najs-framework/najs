"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = require("../lib/http/routing/Route");
function desc(name, callback) { }
desc('Simple route with prefix() before HTTP verb', () => {
    Route_1.Route.prefix('test').get('/get', 'Controller@endpoint');
});
desc('Simple route with prefix() after HTTP verb', () => {
    Route_1.Route.get('/get', 'Controller@endpoint').prefix('test');
});
desc('Simple route with middleware() before HTTP verb', () => {
    Route_1.Route.middleware('test').get('/get', 'Controller@endpoint');
});
desc('Simple route with middleware() after HTTP verb', () => {
    Route_1.Route.get('/get', 'Controller@endpoint').middleware('test');
});
desc('Simple route with use() before HTTP verb', () => {
    Route_1.Route.use('test').get('/get', 'Controller@endpoint');
});
desc('Simple route with middleware after HTTP verb', () => {
    Route_1.Route.get('/get', 'Controller@endpoint').use('test');
});
desc('Name a function after using HTTP Verb', () => {
    Route_1.Route.get('/get', 'Controller@endpoint').name('test');
});
desc('Name a function before using prefix() after HTTP Verb', () => {
    Route_1.Route.name('test')
        .get('/get', 'Controller@endpoint')
        .prefix('test');
});
desc('Name a function before using middleware() after HTTP Verb', () => {
    Route_1.Route.name('test')
        .get('/get', 'Controller@endpoint')
        .middleware('test');
});
desc('Name a function before using use() after HTTP Verb', () => {
    Route_1.Route.name('test')
        .get('/get', 'Controller@endpoint')
        .use('test');
});
desc('Name a function after using prefix() after HTTP Verb', () => {
    Route_1.Route.get('/get', 'Controller@endpoint')
        .prefix('test')
        .name('test');
});
desc('Name a function after using middleware() after HTTP Verb', () => {
    Route_1.Route.get('/get', 'Controller@endpoint')
        .middleware('test')
        .name('test');
});
desc('Name a function after using use() after HTTP Verb', () => {
    Route_1.Route.get('/get', 'Controller@endpoint')
        .use('test')
        .name('test');
});
desc('Group routes group()', () => {
    Route_1.Route.group(function () {
        Route_1.Route.get('/get', 'Controller@endpoint');
    });
});
desc('Group routes before using prefix()', () => {
    Route_1.Route.group(function () {
        Route_1.Route.get('/get', 'Controller@endpoint');
    })
        .prefix('test')
        .use('test')
        .middleware('test');
});
desc('Group routes before using middleware()', () => {
    Route_1.Route.group(function () {
        Route_1.Route.get('/get', 'Controller@endpoint');
    }).middleware('test');
});
desc('Group routes before using use()', () => {
    Route_1.Route.group(function () {
        Route_1.Route.get('/get', 'Controller@endpoint');
    }).use('test');
});
desc('Group routes after using prefix()', () => {
    Route_1.Route.prefix('test').group(function () {
        Route_1.Route.get('/get', 'Controller@endpoint');
    });
});
desc('Group routes after using middleware()', () => {
    Route_1.Route.middleware('test').group(function () {
        Route_1.Route.get('/get', 'Controller@endpoint');
    });
});
desc('Group routes after using use()', () => {
    Route_1.Route.use('test').group(function () {
        Route_1.Route.get('/get', 'Controller@endpoint');
    });
});
desc('Can use multiple-level group', () => {
    Route_1.Route.group(() => {
        Route_1.Route.get('/', 'Controller@endpoint');
        Route_1.Route.group(() => {
            Route_1.Route.get('/', 'Controller@endpoint');
        });
    });
});
desc('Simple route with prefix().middleware() before HTTP verb', () => {
    Route_1.Route.prefix('test')
        .middleware('test')
        .get('/get', 'Controller@endpoint');
});
desc('Simple route with prefix() after HTTP verb', () => {
    Route_1.Route.get('/get', 'Controller@endpoint')
        .prefix('test')
        .middleware('test');
});
desc('Can use .where() to validate param in path', () => {
    Route_1.Route.get('/get/:id', 'Controller@endpoint')
        .name('getName');
});
