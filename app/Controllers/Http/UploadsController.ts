// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Upload from "App/Models/Upload";
import UploadFile from "App/Validators/UploadFileValidator";
import Application from '@ioc:Adonis/Core/Application'
import { Attachment } from "@ioc:Adonis/Addons/AttachmentLite";

export default class UploadsController {
  public async upload( request ){
    console.log('uploading file');
    const payload_file = await request.validate(UploadFile);
    const upload = new Upload();
    upload.file = Attachment.fromFile(payload_file.file)
    try {
      await upload.save();
      return upload;
    } catch (error) {
      console.log('file upload', error)
      return null;
    }
  }
}
