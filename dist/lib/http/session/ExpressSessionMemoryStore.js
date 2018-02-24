"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
const Session = require("express-session");
class ExpressSessionMemoryStore extends Session.MemoryStore {
    getClassName() {
        return ExpressSessionMemoryStore.className;
    }
}
ExpressSessionMemoryStore.className = 'ExpressSessionMemoryStore';
exports.ExpressSessionMemoryStore = ExpressSessionMemoryStore;
najs_binding_1.register(ExpressSessionMemoryStore);
najs_binding_1.bind(constants_1.SystemClass.ExpressSessionStore, ExpressSessionMemoryStore.className);
