import 'jest';
export declare class TodoModel {
    static className: string;
}
export declare class TodoRepository {
    static className: string;
    todoModel: TodoModel;
}
export declare class TodoService {
    static className: string;
    todoModel: TodoModel;
    todoRepository: TodoRepository;
    constructor();
}
export declare class TodoController {
    static className: string;
    protected __autoloadMetadata: Object;
    constructor(requestId: string);
    todoService: TodoService;
}
