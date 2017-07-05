'use strict'

import { defineMessages } from 'react-intl'

var messages = defineMessages({
  allEmployeeRoleName: {
    id: 'DemoAccount.all-employee-role-name',
    defaultMessage: 'All Employees'
  }
})

module.exports = function () {
  const si = this

  si.add('role:demo-account, cmd:generate', function () {
    // All Employee (default role)
    si.act('role:role, cmd:find', { is_default: true }, function (err, respond) {
      if (err || !respond.ok) return

      if (!respond.role) {
        si.act('role:role, cmd:add', {
          name: messages.allEmployeeRoleName.defaultMessage,
          is_default: true
        })
      }
    })

  })

  return 'demo-account'
}