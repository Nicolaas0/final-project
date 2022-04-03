import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Field from 'App/Models/Field'
import FieldValidator from 'App/Validators/FieldValidator'

export default class FieldsController {
    /**
        * @swagger
        * /fields:
        *  get:
        *     tags:
        *       - Fields
        *     summary: Get all fields
        *     produces:
        *       - application/json
        *     responses:
        *       200:
        *         description: Success
        * @swagger
        * /fields/{id}:
        *   get:
        *     tags:
        *       - Fields
        *     summary: Get selected fields
        *     parameters:
        *       - name: id
        *         description: id of the fields
        *         in: path
        *         required: true  
        *     produces:
        *       - application/json
        *     responses:
        *       200:
        *         description: Success
        * @swagger
        * /fields:
        *   post:
        *     tags:
        *       - Fields
        *     summary: Create Fields
        *     requestBody:
        *       required: true
        *       content:
        *        application/x-www-form-urlencoded:
        *           schema:
        *            type: object
        *            properties:
        *               name:
        *                type: string
        *               type:
        *                type: string
        *               venue_id:
        *                type: integer
        *     produces:
        *       - application/json
        *     responses:
        *       200:
        *         description: Success
        * @swagger
        * /fields/{id}:
        *   put:
        *     tags:
        *       - Fields
        *     summary: Update Selected fields
        *     parameters:
        *       - name: id
        *         description: id of the fields
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
        *               tpye:
        *                type: string
        *               venue_id:
        *                type: integer
        *     produces:
        *       - application/json
        *     responses:
        *       200:
        *         description: Success
        * @swagger
        * /fields/{id}:
        *   delete:
        *     tags:
        *       - Fields
        *     summary: Delete selecteed fields
        *     parameters:
        *       - name: id
        *         description: id of the fields
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
                const field = await Field.findBy('name', request.qs().name)
                return response.ok({ status: 'complete', data: field })
            } catch (error) {
                response.badRequest({ message: 'Error!' })
            }
        }

        try {
            const field = await Field.all()
            response.ok({ status: 'complete', data: field })
        } catch (error) {
            response.badRequest({ message: 'Error!' })
        }

    }

    public async ShowField({ response, params }: HttpContextContract) {
        try {
            const field = await Field.findBy('id', params.id)
            response.ok({ status: 'Complete!', data: field })
        } catch (error) {
            response.badRequest({ message: 'Error!' })
        }
    }

    public async CreateField({ request, response }: HttpContextContract) {
        try {
            const data = await request.validate(FieldValidator)
            const newFieldId = await Field.create(data)
            response.created({ message: 'Created!', id: newFieldId })
        } catch (error) {
            response.badRequest({ error: error })
        }
    }

    public async UpdateField({ request, response, params }: HttpContextContract) {
        try {
            const data = await request.validate(FieldValidator)
            const field = await Field.findOrFail(params.id)
            const updatedField = field.merge(data)
            updatedField.save()
            response.ok({ message: 'Updated!' })
        } catch (error) {
            response.badRequest({ error: error })
        }
    }

    public async DestroyField({ response, params }: HttpContextContract) {
        try {
            const field = await Field.findOrFail(params.id)
            field.delete()
            response.ok({ message: 'Deleted!' })
        } catch (error) {
            response.badRequest({ error: error })
        }
    }
}