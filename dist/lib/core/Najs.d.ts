export declare type NajsOptions = {
    port: number;
    host: string;
    httpDriver: string;
};
export declare class Najs {
    private static options;
    static use(options: Partial<NajsOptions>): typeof Najs;
    static make<T>(classDefinition: any): T;
    static make<T>(className: string): T;
    static make<T>(className: string, data: Object): T;
    static register<T>(classDefinition: T): typeof Najs;
    static register<T>(classDefinition: T, className: string): typeof Najs;
    static register<T>(classDefinition: T, className: string, overridable: boolean): typeof Najs;
    static loadClasses(classes: Array<any>): typeof Najs;
    static loadClasses(classes: Object): typeof Najs;
    static remap(data: Object): typeof Najs;
    static remap(target: string, destination: string): typeof Najs;
    static start(options?: Partial<NajsOptions>): void;
}
