import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VenueValidator from 'App/Validators/VenueValidator'
import Venue from 'App/Models/Venue'

export default class VenuesController {

    /**
        * @swagger
        * /venues:
        *  get:
        *     tags:
        *       - Venue
        *     summary: Get all venues
        *     produces:
        *       - application/json
        *     responses:
        *       200:
        *         description: Success
        * @swagger
        * /venues/{id}:
        *   get:
        *     tags:
        *       - Venue
        *     summary: Get selected venues
        *     parameters:
        *       - name: id
        *         description: id of the venues
        *         in: path
        *         required: true  
        *     produces:
        *       - application/json
        *     responses:
        *       200:
        *         description: Success
        * @swagger
        * /venues:
        *   post:
        *     tags:
        *       - Venue
        *     summary: Create venues
        *     requestBody:
        *       required: true
        *       content:
        *        application/x-www-form-urlencoded:
        *           schema:
        *            type: object
        *            properties:
        *               name:
        *                type: string
        *               address:
        *                type: string
        *               phone:
        *                type: string
        *     produces:
        *       - application/json
        *     responses:
        *       200:
        *         description: Success
        * @swagger
        * /venues/{id}:
        *   put:
        *     tags:
        *       - Venue
        *     summary: Update Selected venues
        *     parameters:
        *       - name: id
        *         description: id of the venues
        *         in: path
        *         required: true    
        *     requestBody:
        *       required: true
        *       content:
        *        application/x-www-form-urlencoded:
        *           schema:
        *            type: object
        *            properties:
        *               name:
        *                type: string
        *               address:
        *                type: string
        *               phone:
        *                type: string
        *     produces:
        *       - application/json
        *     responses:
        *       200:
        *         description: Success
        * @swagger
        * /venues/{id}:
        *   delete:
        *     tags:
        *       - Venue
        *     summary: Delete selecteed venues
        *     parameters:
        *       - name: id
        *         description: id of the venues
        *         in: path
        *         required: true  
        *     produces:
        *       - application/json
        *     responses:
        *       200:
        *         description: Success
     */

    public async index({ request, response }: HttpContextContract) {
        if (request.qs().name) {
            try {
                const venue = await Venue.findBy('name', request.qs)
                return response.ok({ status: 'complete', data: venue })
            } catch (error) {
                response.badRequest({ message: 'Error!' })
            }
        }

        try {
            const venue = await Venue.all()
            response.ok({ status: 'complete', data: venue })
        } catch (error) {
            console.log(error)
            response.badRequest({ message: 'Error!' })
        }

    }

    public async ShowVenue({ response, params, auth }: HttpContextContract) {
        try {
            await auth.use('api').authenticate()
            const role = auth.user!.role
            if (role === 'owner') {
                const venue = await Venue.findBy('id', params.id)
                response.ok({ status: 'Complete!', data: venue })
            } else {
                response.unauthorized({ message: 'You are not an owner!' })
            }
        } catch (error) {
            response.badRequest({ message: 'Error!' })
        }
    }

    public async CreateVenue({ request, response, auth }: HttpContextContract) {
        try {
            await auth.use('api').authenticate()
            const role = auth.user!.role
            if (role === 'owner') {
                const data = await request.validate(VenueValidator)
                const newVenue = new Venue()
                newVenue.name = data.name
                newVenue.address = data.address
                newVenue.phone = data.phone

                const authUser = auth.user
                await authUser?.related('venues').save(newVenue)
                // await authUser!.related('venues').save('newVenue')
                // const venue = await Database.table('venues').returning('id').insert({
                //     name: request.input('name'),
                //     address: request.input('address'),
                //     phone: request.input('phone')
                // })
                response.created({ message: 'Created!' })
            } else {
                response.unauthorized({ message: 'You are not an owner!' })
            }
        } catch (error) {
            console.log(error)
            response.badRequest({ error: error })
        }
    }

    public async UpdateVenue({ request, response, params, auth }: HttpContextContract) {
        await auth.use('api').authenticate()
        const role = auth.user!.role
        if (role === 'owner') {
            try {
                const data = await request.validate(VenueValidator)
                const venue = await Venue.findOrFail(params.id)
                const updatedVenue = venue.merge(data)
                updatedVenue.save()
                response.ok({ message: 'Updated!', data: updatedVenue })
            } catch (error) {
                console.log(error)
                response.badRequest({ error: error })
            }
        } else {
            response.unauthorized({ message: 'You are not an owner!' })
        }
    }

    public async DestroyVenue({ response, params, auth }: HttpContextContract) {
        await auth.use('api').authenticate()
        const role = auth.user!.role
        if (role === 'owner') {
            try {
                const venue = await Venue.findOrFail(params.id)
                venue.delete()

                response.ok({ message: 'Deleted!' })
            } catch (error) {
                response.badRequest({ error: error })
            }
        } else {
            response.unauthorized({ message: 'You are not an owner!' })
        }
    }
}