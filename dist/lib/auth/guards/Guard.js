"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Guard {
    // The constructor must be in string literal otherwise typescript don't understand the constructor
    // prettier-ignore
    "constructor"(controller, provider) {
        this.controller = controller;
        this.provider = provider;
    }
    /**
     * Get user provider.
     */
    getUserProvider() {
        return this.provider;
    }
}
exports.Guard = Guard;
