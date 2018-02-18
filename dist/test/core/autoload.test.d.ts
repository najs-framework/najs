import 'jest';
export declare class Model {
    static className: string;
}
export declare class Repository {
    static className: string;
    model: Model;
    constructor();
    constructor(metadata: Object);
    getSomething(): string;
}
export declare class CustomMetadataRepository {
    static className: string;
    model: Model;
    constructor(metadata?: Object);
    getSomething(): string;
}
export declare class TestAutoloadPropertyDecorator {
    static className: string;
    repository: Repository;
    customMetadataRepository: CustomMetadataRepository;
    constructor();
    constructor(metadata: Object);
    getSomething(): string;
}
