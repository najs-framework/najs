export interface IAutoload {
    getClassName(): string;
    createClassInstance?(data?: Object): any;
}
