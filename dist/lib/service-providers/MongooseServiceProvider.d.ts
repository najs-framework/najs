import { ServiceProvider } from '../core/ServiceProvider';
import { Schema, Document, Model } from 'mongoose';
export declare class MongooseServiceProvider extends ServiceProvider {
    static className: string;
    getClassName(): string;
    getMongooseInstance(): any;
    createModelFromSchema<T extends Document>(modelName: string, schema: Schema): Model<T>;
    boot(): Promise<any>;
}
