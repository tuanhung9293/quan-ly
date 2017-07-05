'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { intlShape, defineMessages } from 'react-intl'
import { FormBlock } from 'packages/oneui'
import RoleUpdateForm from './RoleUpdateForm'

const messages = defineMessages({
  allEmployeesDesc: {
    id: 'RoleSettingsTab.allEmployeesDesc',
    defaultMessage: 'This is role for All Employees who was assigned or even doesn\'t be assigned to any role. If you want to grant access for All Employees, please do it with this role.'
  }
})

const RoleSettingsTab = function (props) {
  const { loading, editMode, actionToggleEditRole, onDeleteClick, role } = props

  if (loading || !role) {
    return (
      <div className='text-center'><i className='fa fa-spinner fa-2x fa-spin text-info'></i></div>
    )
  }

  if (role.is_default) {
    return (
      <FormBlock title={role.name} border={false}>
        <div className='alert alert-info'>
          {props.intl.formatMessage(messages.allEmployeesDesc)}
        </div>
      </FormBlock>
    )
  }

  return (
    <FormBlock title={role.name}
               border={false}
               edit={() => actionToggleEditRole()}
               delete={onDeleteClick}
    >
      <RoleUpdateForm role={role}
                      editMode={editMode}
                      onCancel={() => actionToggleEditRole()}
      />
    </FormBlock>
  )
}
RoleSettingsTab.propTypes = {
  intl: intlShape,
  role: PropTypes.object,
  actionToggleEditRole: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired
}
export default RoleSettingsTab