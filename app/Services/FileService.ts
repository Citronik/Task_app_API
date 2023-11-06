import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import File from 'App/Models/File'
import User from 'App/Models/User'
import { AttachmentConfig } from 'Config/attachment'

class FileService {
  public async create(uploadedFile: MultipartFileContract, config: AttachmentConfig, user: User) {
    const file = Attachment.fromFile(uploadedFile).setOptions({
      folder: config.folder,
      preComputeUrl: true,
    })

    await file.save()

    return await File.create({
      file,
      userId: user.id,
    })
  }
}

export default new FileService()
