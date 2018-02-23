import { ConfigurationKeys } from './../constants'
import { ConfigFacade } from './../facades/global/ConfigFacade'
import { ServiceProvider } from '../core/ServiceProvider'
import { register, bind } from 'najs-binding'
import { Schema, Document, Model } from 'mongoose'
const mongoose = require('mongoose')

export class MongooseServiceProvider extends ServiceProvider {
  static className: string = 'Najs.MongooseDriverServiceProvider'

  getClassName() {
    return MongooseServiceProvider.className
  }

  getMongooseInstance() {
    return mongoose
  }

  createModelFromSchema<T extends Document>(modelName: string, schema: Schema): Model<T> {
    return mongoose.model(modelName, schema)
  }

  async boot() {
    return <any>new Promise(resolve => {
      mongoose.connect(
        ConfigFacade.get(ConfigurationKeys.Mongoose, 'mongodb://localhost:27017/najs'),
        ConfigFacade.get(ConfigurationKeys.MongooseOptions, {})
      )
      mongoose.connection.once('open', resolve)
    })
  }
}
register(MongooseServiceProvider)
bind('MongooseProvider', MongooseServiceProvider.className)
