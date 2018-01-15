export declare type NajsOptions = {
    port: number;
    host: string;
    httpDriver: string;
};
export declare class Najs {
    private static options;
    static use(options: Partial<NajsOptions> | undefined): typeof Najs;
    static make<T>(classDefinition: any): T;
    static make<T>(className: string): T;
    static make<T>(className: string, data: Object): T;
    static register<T>(classDefinition: T): typeof Najs;
    static register<T>(classDefinition: T, className: string): typeof Najs;
    static register<T>(classDefinition: T, className: string, overridable: boolean): typeof Najs;
    static register<T>(classDefinition: T, className: string, overridable: boolean, singleton: boolean): typeof Najs;
    static start(): void;
    static start(options: Partial<NajsOptions>): void;
}
