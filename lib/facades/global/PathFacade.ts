/// <reference path="../../contracts/Path.ts" />

import '../../file-system/Path'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { Najs } from '../../core/Najs'
import { make } from 'najs-binding'
import { Najs as NajsClasses } from '../../constants'

const facade = Facade.create<Najs.Contracts.Path>(<any>Najs, 'path', function() {
  return make<Najs.Contracts.Path>(NajsClasses.FileSystem.Path)
})

export const Path: Najs.Contracts.Path & IFacadeBase = facade
export const PathFacade: Najs.Contracts.Path & IFacade = facade
