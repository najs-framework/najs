"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_facade_1 = require("najs-facade");
const EventFacade_1 = require("../facades/global/EventFacade");
const ConfigFacade_1 = require("./../facades/global/ConfigFacade");
const constants_1 = require("../constants");
class AuthManager extends najs_facade_1.ContextualFacade {
    constructor(controller) {
        super(controller);
        /**
         * Indicates if the logout method has been called.
         */
        this.loggedOut = false;
        this.guardBag = {};
        this.configurations = ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Auth.guards, {
            web: {
                driver: 'Najs.SessionGuard',
                provider: 'Najs.GenericUser',
                default: true
            }
        });
        this.guard(this.findDefaultGuardName());
    }
    findDefaultGuardName() {
        let firstName;
        for (const name in this.configurations) {
            if (!this.configurations[name].isDefault) {
                if (!firstName) {
                    firstName = name;
                }
                continue;
            }
            return name;
        }
        return firstName;
    }
    resolveGuard(name) {
        return {};
    }
    getCurrentGuard() {
        return this.currentGuard;
    }
    guard(name) {
        if (!this.guardBag[name]) {
            this.currentGuard = this.guardBag[name];
        }
        else {
            const guard = this.resolveGuard(name);
            if (guard) {
                this.guardBag[name] = guard;
                this.currentGuard = this.guardBag[name];
            }
        }
        return this;
    }
    async login(user, remember = false) {
        EventFacade_1.EventFacade.emit(constants_1.AuthEvent.Login, user, remember);
        this.currentGuard.attachUser(user, remember);
        this.setUser(user);
    }
    async logout() {
        EventFacade_1.EventFacade.emit(constants_1.AuthEvent.Logout, this.currentUser);
        if (!this.loggedOut && this.currentUser) {
            if (this.currentGuard.hasUser(this.currentUser)) {
                this.currentGuard.detachUser(this.currentUser);
            }
            this.currentUser = undefined;
            this.loggedOut = true;
        }
    }
    async attempt(credentials, remember = false, login = true) {
        EventFacade_1.EventFacade.emit(constants_1.AuthEvent.Attempt, credentials, remember, login);
        const user = await this.currentGuard.getUserProvider().retrieveByCredentials(credentials);
        if (user && this.currentGuard.getUserProvider().validateCredentials(user, credentials)) {
            if (login) {
                this.login(user, remember);
            }
            return true;
        }
        return false;
    }
    async validate(credentials) {
        return this.attempt(credentials, false, false);
    }
    check() {
        return !!this.user();
    }
    guest() {
        return !this.check();
    }
    user() {
        return this.getUser();
    }
    id() {
        if (this.loggedOut || !this.currentUser) {
            return undefined;
        }
        return this.currentUser.getAuthIdentifier();
    }
    getUser() {
        if (this.loggedOut) {
            return undefined;
        }
        return this.currentUser;
    }
    setUser(user) {
        this.currentUser = user;
        this.loggedOut = false;
    }
}
exports.AuthManager = AuthManager;
