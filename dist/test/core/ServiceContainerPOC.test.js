"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const make_1 = require("../../lib/core/make");
const register_1 = require("../../lib/core/register");
function autoload(classDefinition) {
    return function (target, key, descriptor) {
        console.log('autoload decorator runs container', target.constructor.className, 'binding', classDefinition.className, 'with key', key);
        const className = classDefinition.className;
        Object.defineProperty(target, key, {
            get: function () {
                if (typeof this.__autoload === 'undefined') {
                    this.__autoload = {};
                }
                if (typeof this.__autoload[className] === 'undefined') {
                    this.__autoload[className] = make_1.make(className);
                }
                if (this.__autoloadContext) {
                    this.__autoload[className].__autoloadContext = this.__autoloadContext;
                }
                console.log(this.__autoloadContext);
                return this.__autoload[className];
            },
            set: function (value) {
                throw new Error('Can not set autoload property "' + key + '"');
            }
        });
    };
}
class TodoModel {
}
TodoModel.className = 'TodoModel';
exports.TodoModel = TodoModel;
register_1.register(TodoModel);
class TodoRepository {
}
TodoRepository.className = 'TodoRepository';
__decorate([
    autoload(TodoModel)
], TodoRepository.prototype, "todoModel", void 0);
exports.TodoRepository = TodoRepository;
register_1.register(TodoRepository);
class TodoService {
}
TodoService.className = 'TodoService';
__decorate([
    autoload(TodoModel)
], TodoService.prototype, "todoModel", void 0);
__decorate([
    autoload(TodoRepository)
], TodoService.prototype, "todoRepository", void 0);
exports.TodoService = TodoService;
register_1.register(TodoService);
// ------------------------------------------------------------------------------------------------
class TodoController {
    constructor(requestId) {
        this.__autoloadContext = { requestId };
    }
}
TodoController.className = 'TodoController';
__decorate([
    autoload(TodoService)
], TodoController.prototype, "todoService", void 0);
exports.TodoController = TodoController;
register_1.register(TodoController);
describe('ServiceContainerPOC', function () {
    it('does something', function () {
        const controllerOne = new TodoController('123');
        controllerOne.todoService.todoModel;
        controllerOne.todoService.todoRepository;
        console.log(controllerOne.todoService.todoRepository.todoModel['__autoloadContext']);
        const controllerTwo = new TodoController('456');
        controllerTwo.todoService.todoRepository;
        controllerTwo.todoService.todoRepository.todoModel;
        console.log(controllerTwo.todoService.todoRepository.todoModel['__autoloadContext']);
        const service = new TodoService();
        service.todoModel;
        service.todoRepository.todoModel;
        console.log(service.todoRepository.todoModel['__autoloadContext']);
    });
});
