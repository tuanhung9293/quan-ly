'use strict'

import Model from '../../../api/server/Model'

module.exports = function (mongoose, entity) {
  var employeeSchema = new mongoose.Schema(
    {
      name: String,
      email: { type: String, index: { unique: true }, lowercase: true },
      phone: String,
      address: String,
      created_at: Date,
      updated_at: Date,
      deleted_at: Date,
      status: String
    },
    {
      collection: 'company_employees',
      entity: entity
    }
  )
  employeeSchema.loadClass(Model)
  return mongoose.model('Employee', employeeSchema)
}
