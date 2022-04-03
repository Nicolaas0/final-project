import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import Venue from 'App/Models/Venue'
import Booking from 'App/Models/Booking'
import { column, beforeSave, BaseModel, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'

/**
  * @swagger
  * definitions:
  *      User:
  *         type: object
  *         properties:
  *          email:
  *            type: string
  *          password:
  *            type: string
  *          role:
  *            type: string 
*/

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public role: string

  @column()
  public rememberMeToken?: string

  @column()
  public isVerified: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
  @hasMany(() => Venue, { foreignKey: 'userId' })
  public venues: HasMany<typeof Venue>

  @hasMany(() => Booking)
  public bookings: HasMany<typeof Booking>
}
