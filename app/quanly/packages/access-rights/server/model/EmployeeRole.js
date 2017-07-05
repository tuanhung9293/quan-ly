'use strict'

import Model from '../../../api/server/Model'

module.exports = function (mongoose, entity) {
  var employeeRoleSchema = new mongoose.Schema(
    {
      employee_id: mongoose.Schema.Types.ObjectId,
      role_id: mongoose.Schema.Types.ObjectId
    },
    {
      collection: 'access_rights_employee_roles',
      entity: entity
    }
  )
  employeeRoleSchema.loadClass(Model)
  return mongoose.model('EmployeeRole', employeeRoleSchema)
}
