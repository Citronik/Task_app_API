import Env from '@ioc:Adonis/Core/Env'
import path from 'path'

export type AttachmentConfig = {
  folder: string
  size: string
  extnames?: string[]
}

const imageExtnames = ['jpeg', 'jpg', 'gif', 'png', 'webp']

const attachmentConfig: { [key: string]: AttachmentConfig } = {
  user: {
    folder: path.join(Env.get('DRIVE_ROOT', ''), 'users/avatars'),
    size: '8mb',
    extnames: imageExtnames,
  },
  room: {
    folder: path.join(Env.get('DRIVE_ROOT', ''), 'rooms/photos'),
    size: '8mb',
    extnames: imageExtnames,
  },
}

export default attachmentConfig
