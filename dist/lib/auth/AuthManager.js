"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_facade_1 = require("najs-facade");
const EventFacade_1 = require("../facades/global/EventFacade");
const constants_1 = require("../constants");
class AuthManager extends najs_facade_1.ContextualFacade {
    constructor(controller) {
        super(controller);
        /**
         * Indicates if the logout method has been called.
         */
        this.loggedOut = false;
    }
    check() {
        return !!this.user();
    }
    guest() {
        return !this.check();
    }
    user() {
        if (this.loggedOut) {
            return undefined;
        }
        return this.currentUser;
    }
    id() {
        if (this.loggedOut || !this.currentUser) {
            return undefined;
        }
        return this.currentUser.getAuthIdentifier();
    }
    async validate(credentials) {
        return this.attempt(credentials, false, false);
    }
    setUser(user) {
        this.currentUser = user;
        this.loggedOut = false;
    }
    guard(name) {
        return this;
    }
    login(user, remember = false) {
        EventFacade_1.Event.emit(constants_1.AuthEvent.Login, user, remember);
        this.setUser(user);
    }
    logout(user) {
        EventFacade_1.Event.emit(constants_1.AuthEvent.Logout, user);
        this.currentUser = undefined;
        this.loggedOut = true;
    }
    async attempt(credentials, remember = false, login = true) {
        return false;
    }
}
exports.AuthManager = AuthManager;
