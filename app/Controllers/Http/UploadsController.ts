// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Upload from 'App/Models/Upload'
import UploadFile from 'App/Validators/UploadFileValidator'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UploadsController {
  public async upload ({ request } : HttpContextContract){
    console.log('uploading file')
    const payloadFile = await request.validate(UploadFile)
    const upload = new Upload()
    upload.file = Attachment.fromFile(payloadFile.file)
    try {
      await upload.save()
      return upload
    } catch (error) {
      console.log('file upload', error)
      return null
    }
  }

  public async getUrl ({ params }: HttpContextContract) {
    console.log('generating url')
    try {
      const upload = await Upload.findOrFail(params.id)
      const url = upload.file.getSignedUrl()
      console.log(url)
      return url
    } catch (error) {
      console.log('file url: ', error)
      return null
    }
  }
}
