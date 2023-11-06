import BaseValidator from '../BaseValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import { AvatarConfig } from 'App/Models/User'

export default class UploadAvatarUserValidator extends BaseValidator {
  public schema = schema.create({
    file: schema.file({
      size: AvatarConfig.size,
      extnames: AvatarConfig.extnames,
    }),
  })
}

let validator: UploadAvatarUserValidator
export type UploadAvatarUserValidatorProps = typeof validator.schema.props
