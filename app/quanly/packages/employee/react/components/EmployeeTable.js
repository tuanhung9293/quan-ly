'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import Classnames from 'classnames'
import { TableRowStatus } from 'packages/oneui'
import Constants from '../../lib/constants'
import { TableRowAction } from '../../../uilib'

const messages = defineMessages({
  defaultRoleText: {
    id: 'Role.defaultRoleText',
    defaultMessage: 'All Employees'
  },
  emailColumnHeader: {
    id: 'EmployeeTable.emailColumnHeader',
    defaultMessage: 'Email'
  },
  nameColumnHeader: {
    id: 'EmployeeTable.nameColumnHeader',
    defaultMessage: 'Name'
  },
  phoneColumnHeader: {
    id: 'EmployeeTable.phoneColumnHeader',
    defaultMessage: 'Phone'
  },
  roleColumnHeader: {
    id: 'EmployeeTable.roleColumnHeader',
    defaultMessage: 'Role'
  },
  noEmployeeYet: {
    id: 'EmployeeTable.noEmployeeYet',
    defaultMessage: 'There is no employee yet, please create new one'
  }
})

class EmployeeTable extends Component {
  static propTypes = {
    intl: intlShape,
    deleteClick: PropTypes.func.isRequired,
    updateClick: PropTypes.func.isRequired,
    enableClick: PropTypes.func.isRequired,
    disableClick: PropTypes.func.isRequired
  }

  static defaultProps = {
    loading: true,
    employees: null
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    const { loading, employees, disableClick, enableClick, deleteClick, updateClick } = this.props

    if (loading) {
      return (
        <div className='text-center'><i className='fa fa-spinner fa-2x fa-spin text-info'></i></div>
      )
    }

    if (employees === null || employees.isEmpty()) {
      return (
        <div className='well text-muted'>{formatMessage(messages.noEmployeeYet)}</div>
      )
    }

    const employeeRows = employees.valueSeq().map(function (employee) {
      return (
        <tr key={employee.id}
            className={Classnames({ 'text-line-through text-muted': employee.status === Constants.STATUS_INACTIVE })}>
          <td>
            <TableRowStatus rowId={employee.id}
                            isEnabled={employee.status === Constants.STATUS_ACTIVE}
                            onDisabledClick={() => enableClick({ id: employee.id })}
                            onEnabledClick={() => disableClick({ id: employee.id })}
            />
          </td>
          <td>{employee.email}</td>
          <td>{employee.name}</td>
          <td>{employee.phone}</td>
          <td>
            <span className='label label-default'>{formatMessage(messages.defaultRoleText)}</span>
          </td>
          <td className='text-center'>
            <div className='btn-group'>
              <TableRowAction.Edit rowId={employee.id}
                                   href='javascript:void(0)'
                                   onClick={() => updateClick({ id: employee.id })}
              />
              <TableRowAction.Delete rowId={employee.id}
                                     href='javascript:void(0)'
                                     onClick={() => deleteClick({ id: employee.id })}
              />
            </div>
          </td>
        </tr>
      )
    })

    return (
      <table className='table table-striped table-borderless table-vcenter'>
        <thead>
        <tr>
          <th className='width-20px'></th>
          <th className='width-20'>{formatMessage(messages.emailColumnHeader)}</th>
          <th className='width-20'>{formatMessage(messages.nameColumnHeader)}</th>
          <th className='width-15'>{formatMessage(messages.phoneColumnHeader)}</th>
          <th>{formatMessage(messages.roleColumnHeader)}</th>
          <th className='width-10 text-center'>
            <i className="fa fa-flash"></i>
          </th>
        </tr>
        </thead>
        <tbody>
        {employeeRows}
        </tbody>
      </table>
    )
  }
}

export default injectIntl(EmployeeTable)
