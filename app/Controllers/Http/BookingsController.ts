import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookingValidator from 'App/Validators/BookingValidator'
import Booking from 'App/Models/Booking'

export default class BookingsController {

    /**
        *@swagger
        * /bookings:
        *  get:
        *     tags:
        *       - Bookings
        *     summary: Get all Bookings
        *     produces:
        *       - application/json
        *     responses:
        *       200:
        *         description: Success
        * @swagger
        * /bookings/{id}:
        *   get:
        *     tags:
        *       - Bookings
        *     summary: Get selected bookings
        *     parameters:
        *       - name: id
        *         description: id of the bookings
        *         in: path
        *         required: true  
        *     produces:
        *       - application/json
        *     responses:
        *       200:
        *         description: Success
        * @swagger
        * /venues/{id}/bookings:
        *   post:
        *     tags:
        *       - Bookings
        *     summary: Create Bookings
        *     parameters:
        *       - name: id
        *         description: id of the bookings
        *         in: path
        *         required: true  
        *     requestBody:
        *       required: true
        *       content:
        *        application/x-www-form-urlencoded:
        *           schema:
        *            type: object
        *            properties:
        *               play_date_start:
        *                type: date
        *               play_date_end:
        *                type: date
        *     produces:
        *       - application/json
        *     responses:
        *       200:
        *         description: Success
        * @swagger
        * /bookings/{id}:
        *   put:
        *     tags:
        *       - Bookings
        *     summary: Update Selected bookings
        *     parameters:
        *       - name: id
        *         description: id of the bookings
        *         in: path
        *         required: true    
        *     requestBody:
        *       required: true
        *       content:
        *        application/x-www-form-urlencoded:
        *           schema:
        *            type: object
        *            properties:
        *               play_date_start:
        *                type: date
        *               play_date_end:
        *                type: date
        *     produces:
        *       - application/json
        *     responses:
        *       200:
        *         description: Success
        * @swagger
        * /bookings/{id}:
        *   delete:
        *     tags:
        *       - Bookings
        *     summary: Delete selecteed bookings
        *     parameters:
        *       - name: id
        *         description: id of the bookings
        *         in: path
        *         required: true  
        *     produces:
        *       - application/json
        *     responses:
        *       200:
        *         description: Success
     */

    public async index({ response }: HttpContextContract) {
        try {
            const booking = await Booking.all()
            response.ok({ status: 'complete', data: booking })
        } catch (error) {
            console.log(error)
            response.badRequest({ message: 'Error!' })
        }
    }

    public async ShowBooking({ response, params }: HttpContextContract) {
        try {
            const booking = await Booking.findBy('id', params.id)
            response.ok({ status: 'Complete!', data: booking })
        } catch (error) {
            response.badRequest({ message: 'Error!' })
        }
    }

    public async CreateBooking({ request, response, params, auth }: HttpContextContract) {
        try {
            await auth.use('api').authenticate()
            await request.validate(BookingValidator)
            const id = await auth.user!.id
            const newBooking = await Booking.create({
                user_id: id,
                play_date_start: request.input('play_date_start'),
                play_date_end: request.input('play_date_end'),
                field_id: params.id
            })
            response.created({ message: 'Created!' })
        } catch (error) {
            response.badRequest({ error: error })
        }
    }

    public async UpdateBooking({ request, response, params, auth }: HttpContextContract) {
        try {
            await auth.use('api').authenticate()
            const data = await request.validate(BookingValidator)
            const booking = await Booking.findOrFail(params.id)
            const id = await auth.user!.id
            booking.merge({
                user_id: id,
                play_date_start: request.input('play_date_start'),
                play_date_end: request.input('play_date_end'),
                field_id: params.id
            })
            booking.save()
            response.ok({ message: 'Updated!' })
        } catch (error) {
            response.badRequest({ error: error })
        }
    }

    public async DestroyBooking({ response, params }: HttpContextContract) {
        try {
            const booking = await Booking.findOrFail(params.id)
            booking.delete()
            response.ok({ message: 'Deleted!' })
        } catch (error) {
            response.badRequest({ error: error })
        }
    }
}
