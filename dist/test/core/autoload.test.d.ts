import 'jest';
export declare class Repository {
    static className: string;
    getSomething(): string;
}
export declare class TestAutoloadPropertyDecorator {
    static className: string;
    repository: Repository;
    getSomething(): string;
}
