import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File'

export default class FilesController {
  public async show({ params }: HttpContextContract) {
    const file = await File.findOrFail(params.id)

    const url = file.file.getSignedUrl()

    return url
  }
}
