# <img src="https://raw.githubusercontent.com/najs-framework/najs/master/najs.png" alt="najs">

[![Travis](https://img.shields.io/travis/najs-framework/najs/master.svg?style=flat-square)](https://travis-ci.org/najs-framework/najs/builds)
[![Coverage Status](https://img.shields.io/coveralls/najs-framework/najs/master.svg?style=flat-square)](https://coveralls.io/r/najs-framework/najs?branch=master)
[![node version](https://img.shields.io/node/v/najs.svg?style=flat-square)](https://nodejs.org/en/download/)
[![npm version](https://img.shields.io/npm/v/najs.svg?style=flat-square)](http://badge.fury.io/js/najs)
[![npm downloads](https://img.shields.io/npm/dm/najs.svg?style=flat-square)](http://badge.fury.io/js/najs)
[![npm license](https://img.shields.io/npm/l/najs.svg?style=flat-square)](http://badge.fury.io/js/najs)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

# _Warning_: This project is still `In Progress`

## Purpose

I want to create a web framework with really _`Najs`_ and elegant syntax like Laravel for Node Js, use Typescript.

Najs must have:

1. Type-Safety: Written 100% in Typescript with strict rules
2. Beautiful code: Use Class as must as possible, just like Java
3. Reliable: Rely on strong and trusted frameworks such as `express` (for routing), `bull` (for Task Queue)
4. High-Quality: Every single line of `Najs` must have unit test, coverage up to `99%` (because awaiter coverage problem)

## Syntax

This is the syntax looks like

### Binding

Register a class

```typescript
// file: UserRepository.ts
import { register } from 'najs'
import { User } from './User' // please checkout najs-eloquent package

@register()
class UserRepository {
  static className = 'Namespace.UserRepository'

  async getUsers(): Promise<User> {
    return User.all()
  }
}
```

Extend class

```typescript
// file: UserRepositoryCached.ts
import { register } from 'najs'

@register()
class UserRepositoryCached extends UserRepository {
  static className = 'Namespace.UserRepositoryCached'

  async getUsers(): Promise<User> {
    return this.cacheManager.cache('getUsers', 10, () => {
      return super.getUsers()
    })
  }
}
```

Bind class

```typescript
// file: index.ts
import { Najs, make } from 'najs'

// before binding return instance of UserRepository
make('Namespace.UserRepository')

Najs.bind('Namespace.UserRepository', 'Namespace.UserRepositoryCached')

// after binding return instance of UserRepositoryCached
make('Namespace.UserRepository')
```

Autoload

```typescript
// file: UserService.ts
import { autoload, register } from 'najs'
import { UserRepository } from './UserRepository'

@register()
class UserService {
  static className = 'Namespace.UserService'

  // this autoload UserRepository instance, if you already binding in index.ts it loads UserRepositoryCached instead
  @autoload(UserRepository) userRepository: UserRepository

  async getUsers(): Promise<User> {
    return this.userRepository.getUsers()
  }
}
```

### Routing

```typescript
Route.middleware('csrf', 'cors').group(function() {
  Route.get('/users/', 'UserController@getUsers')
})
```

### Model

Please check out this package [Najs Eloquent](https://www.npmjs.com/package/najs-eloquent)

### Controller

```typescript
// file: UserController.ts
import { autoload, register, Controller, Response } from 'najs'
import { UserService } from './UserService'

@register()
class UsersController extends Controller {
  static className = 'Namespace.Controller'

  @autoload(UserService) userService: UserService

  async getUsers(): Promise<User> {
    return Response.json(this.userService.getUsers())
  }

  getIndex(): any {
    return Response.view('users').with('currentUser', this.Auth.user())
  }
}
```

## Status and Road map

I. Class Binding (In Progress - 75%)

* `register()` [Released] - register a class
* `singleton()` [Released] - register a class as a singleton
* `make()` [Released] - make an instance of class which registered by `register()`
* `bind()` [In Progress] - simple binding + primitives binding

II. Model [Released] - It's developed and released in separate package [Najs Eloquent](https://www.npmjs.com/package/najs-eloquent)

III. Routing - I'm going to use `express` as a routing framework

IV. Controller

## Contribute

If you want to be a contributor, please [let me know](mailto:nhat@ntworld.net).
