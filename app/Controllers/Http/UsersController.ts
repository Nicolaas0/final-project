import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
/**
		* @swagger
		* /user/register:
		*  post:
		*     tags:
		*       - Authentications
		*     requestBody:
		*       required: true
		*       content:
        *         application/x-www-form-urlencoded:
		*           schema:
        *               type: object
        *               properties:
        *                   email:
        *                       type: string
        *                   password:
        *                       type: string
        *                   role:
        *                       type: string
		*         application/json:
		*           schema:
		*             type: object
		*             properties:
		*               phone:
		*                 type: string
		*                 example: '081905560385'
		*                 required: true
		*               email:
		*                 type: string
		*                 example: 'Bond007@example.com'
		*                 required: true
        *               role:
        *                 type: string
        *                 example: 'owner'
        *                 required: true
        *               password:
        *                 type: string
        *                 example: 'iamhandsome'
        *                 required: true
		*     produces:
		*       - application/json
		*     responses:
		*       200:
		*         description: Success

        * @swagger
		* /user/login:
		*  post:
		*     tags:
		*       - Authentications
		*     requestBody:
		*       required: true
		*       content:
        *         application/x-www-form-urlencoded:
		*           schema:
        *               type: object
        *               properties:
        *                   email:
        *                       type: string
        *                   password:
        *                       type: integer
		*         application/json:
		*           schema:
		*             type: object
		*             properties:
		*               email:
		*                 type: string
		*                 example: 'Bond007@example.com'
		*                 required: true
        *               password:
        *                 type: string
        *                 example: 'iamhandsome'
        *                 required: true
		*     produces:
		*       - application/json
		*     responses:
		*       200:
		*         description: Success

        * @swagger
		* /user/otp-verif:
		*  post:
		*     tags:
		*       - Authentications
		*     requestBody:
		*       required: true
		*       content:
		*         application/x-www-form-urlencoded:
		*           schema:
        *               type: object
        *               properties:
        *                   email:
        *                       type: string
        *                   otp_code:
        *                       type: integer
		*     produces:
		*       - application/json
		*     responses:
		*       200:
		*         description: Success
		*/
    public async register({ request, response }: HttpContextContract) {
        try {
            const data = await request.validate(UserValidator)
            const email = request.input('email')
            const newUser = await User.create(data)
            const otp_code = Math.floor(100000 + Math.random() * 900000)
            let saveCode = await Database.table('otp_codes').insert({ otp_code: otp_code, user_id: newUser.id })
            await Mail.send((message) => {
                message
                    .from('admin@todoapi.com')
                    .to(email)
                    .subject('Welcome Onboard!')
                    .htmlView('emails/otp_verification', { otp_code })
            })
            return response.ok({ message: 'Created!' })
        } catch (error) {
            console.log(error)
            return response.badRequest({ message: 'Error!', error: error.messages })
        }
    }

    public async login({ request, response, auth }: HttpContextContract) {
        try {

            const email = request.input('email')
            const password = request.input('password')


            const token = await auth.use('api').attempt(email, password, {
                expiresIn: '24hours',
            })
            return response.ok({ message: 'Login success!!', token: token })
        } catch (error) {
            console.log(error)
            return response.badRequest({ message: 'Error!', error: error.messages })
        }
    }

    public async otp_confirmation({ request, response }: HttpContextContract) {
        let otp_code = request.input('otp_code')
        let email = request.input('email')

        let user = await User.findBy('email', email)
        let otpCheck = await Database.query().from('otp_codes').where('otp_code', otp_code).first()

        if (user?.id == otpCheck.user_id) {
            user.isVerified = true
            await user?.save()
        } else {
            return response.status(400).json({ message: 'gagal konfirmasi OTP' })
        }
    }
}
