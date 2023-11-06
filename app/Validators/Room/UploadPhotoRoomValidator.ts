import BaseValidator from '../BaseValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import { PhotoConfig } from 'App/Models/Room'

export default class UploadPhotoRoomValidator extends BaseValidator {
  public schema = schema.create({
    file: schema.file({
      size: PhotoConfig.size,
      extnames: PhotoConfig.extnames,
    }),
  })
}

let validator: UploadPhotoRoomValidator
export type UploadPhotoRoomValidatorProps = typeof validator.schema.props
