import { BaseCommand, args, flags } from '@adonisjs/core/build/standalone'
import Role from 'App/Models/Role'
import UserService from 'App/Services/UserService'

export default class extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'users:create'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  @args.string({ description: 'Email of the user', required: true })
  public email: string

  @args.string({ description: 'Password', required: true })
  public password: string

  @flags.string({ description: 'Role' })
  public role: string | null

  public async run() {
    const role = this.role
      ? await Role.findByOrFail('uid', this.role)
      : await Role.findByOrFail('isDefault', true)

    const user = await UserService.create({
      email: this.email,
      username: this.email.split('@')[0],
      password: this.password,
      roleId: role.id,
    })

    this.logger.info(`created user, email: ${user.email}, password: ${this.password}`)

    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}
