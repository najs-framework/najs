import { ISchemaValidator } from './ISchemaValidator'
import { make } from 'najs-binding'
import { SchemaValidatorClass } from '../constants'
import { AjvSchemaValidator } from './AjvSchemaValidator'

export let SchemaValidatorFacade: ISchemaValidator = new AjvSchemaValidator()
export function reload() {
  SchemaValidatorFacade = make<ISchemaValidator>(SchemaValidatorClass)
  return SchemaValidatorFacade
}
