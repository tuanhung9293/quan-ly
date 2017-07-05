'use strict'

import Model from '../../../api/server/Model'

module.exports = function (mongoose, entity) {
  var roleSchema = new mongoose.Schema(
    {
      name: String,
      alias: String,
      is_admin: Boolean,
      is_default: Boolean,
      is_removable: Boolean,
      created_at: Date,
      updated_at: Date,
      deleted_at: Date,
      status: String
    },
    {
      collection: 'access_rights_roles',
      entity: entity
    }
  )
  roleSchema.loadClass(Model)
  return mongoose.model('Role', roleSchema)
}
