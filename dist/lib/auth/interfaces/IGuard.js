"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// hasUser(user): boolean
// async retrieveUser()
// async attachUser()
// async detachUser()
// async validate()
// async Auth.login(user): login as a user => calls Guard.attachUser()
// async Auth.logout(): logout user => calls Guard.detachUser() if current user is logged in via guard
// async Auth.attempt(): calls Guard.validate() and if login call Guard.attach()
// async Auth.validate(): calls Guard.validate()
// Auth.check(): check
// Auth.user(): get current user, an alias of .getUser()
// Auth.guest():
// Auth.id(): get current user's id
// Auth.setUser(): set current user only, do not call Guard.remember()
// Auth.getUser(): get current user
