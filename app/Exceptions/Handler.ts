/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    if (typeof error.handle === 'function') {
      return error.handle(error, ctx)
    }

    const status = error.status || 500
    const data: any = {
      status,
    }

    if (error.code === 'E_ROW_NOT_FOUND') {
      data.code = 'E_NOT_FOUND'
      data.message = 'Record was not found.'
    } else if (status >= 400 && status < 500) {
      data.code = error.code
      data.message = error.message.replace(new RegExp('^' + error.code + ': '), '')
    } else {
      data.message = 'An unknown error occurred, please try again later.'
    }

    if (error.toJSON) {
      Object.assign(data, error.toJSON())
    }

    return ctx.response.status(status).json({
      error: data,
    })
  }
}
