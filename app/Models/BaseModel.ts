import { type NormalizeConstructor } from '@ioc:Adonis/Core/Helpers'
import { BaseModel as AdonisBaseModel } from '@ioc:Adonis/Lucid/Orm'
import CamelCaseNamingStrategy from 'App/Utils/CamelCaseNamingStrategy'

export default class BaseModel extends AdonisBaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
}

export type NormalizedBaseModel = NormalizeConstructor<typeof BaseModel>
