/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})


Route.post('/user/register', 'UsersController.register').as('users.register')
Route.post('/user/login', 'UsersController.login').as('users.login')
Route.post('/user/otp-verif', 'UsersController.otp_confirmation').as('users.otp_confirmation')

Route.post('/venues', 'VenuesController.CreateVenue')
Route.get('/venues', 'VenuesController.index')
Route.get('/venues/:id', 'VenuesController.ShowVenue')
Route.put('/venues/:id', 'VenuesController.UpdateVenue')
Route.delete('/venues/:id', 'VenuesController.DestroyVenue')

Route.post('/fields', 'FieldsController.CreateField').as('fields.create')
Route.get('/fields/', 'FieldsController.index').as('fields.index')
Route.get('/fields/:id', 'FieldsController.ShowField').as('fields.show')
Route.put('/fields/:id', 'FieldsController.UpdateField').as('fields.update')
Route.delete('/fields/:id', 'FieldsController.DestroyField').as('fields.destroy')

Route.get('/bookings', 'BookingsController.index').as('bookings.index')
Route.post('/venues/:id/bookings', 'BookingsController.CreateBooking').as('bookings.create')
Route.put('/bookings/:id', 'BookingsController.UpdateBooking').as('bookings.update')
Route.get('/bookings/:id', 'BookingsController.ShowBooking').as('bookings.show')
Route.delete('/bookings/:id', 'BookingsController.DestroyBooking').as('bookings.destroy')

// Route.resource('venues', 'VenuesController').apiOnly().middleware({ '*': ['auth', 'verify'] })
